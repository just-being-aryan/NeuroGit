import { db } from "@/server/db";
import {Octokit} from "octokit";
import { aiSummariseCommit, generateEmbedding } from "./gemini";
import { linkCommitToIssues } from "./linking";
import axios from 'axios'


export const octokit = new Octokit({
    auth:process.env.GITHUB_TOKEN,
})

const githubUrl = 'https://github.com/docker/genai-stock'

type Response = {
    commitHash:string;
    commitMessage:string;
    commitAuthorName:string;
    commitAuthorAvatar:string;
    commitDate:string;
}

export const getCommitHashes = async(githubUrl:string) : Promise<Response[]> => {
    
    const [owner,repo] = githubUrl.split('/').slice(-2)
    if(!owner || !repo) {
        throw new Error('Invalid Github url')
    }
    
    const {data} = await octokit.rest.repos.listCommits({
        
        owner,
        repo
    })
    const sortedCommits = data.sort((a:any, b:any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any
    
    
    return sortedCommits.slice(0,15).map((commit:any) => ({
        commitHash: commit.sha as string,
        commitMessage: commit.commit.message ?? "",
        commitAuthorName: commit.commit?.author?.name ?? "",
        commitAuthorAvatar: commit?.author?.avatar_url ?? "",
        commitDate: commit.commit?.author?.date ?? ""
    }))
}

const POLL_COOLDOWN_MS = 60 * 1000

// getCommitHashes(githubUrl)
export const pollCommits = async(projectId : string, linkAfterInsert: boolean = true) => {
    const project = await db.project.findUnique({where: {id: projectId}, select: {lastPolledAt: true}})
    if(project?.lastPolledAt && Date.now() - project.lastPolledAt.getTime() < POLL_COOLDOWN_MS) {
        return [] // checked recently, skip hitting GitHub again
    }
    await db.project.update({where: {id: projectId}, data: {lastPolledAt: new Date()}})

    const {githubUrl} = await fetchProjectGithubUrl(projectId)
    const commitHashes = await getCommitHashes(githubUrl)
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)

    const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit => {
        return summariseCommit(githubUrl, commit.commitHash)

    }))

    const summaries = summaryResponses.map((response) => {
        if(response.status === 'fulfilled'){
            return response.value as string
        }
        return ""
    })

    const createdCommits = await Promise.allSettled(summaries.map(async(summary, index) => {
        console.log(`processing commit ${index}`)
        const commit = await db.commit.create({
            data: {
                projectId:projectId,
                commitHash:unprocessedCommits[index]!.commitHash,
                commitMessage:unprocessedCommits[index]!.commitMessage,
                commitAuthorName:unprocessedCommits[index]!.commitAuthorName,
                commitAuthorAvatar:unprocessedCommits[index]!.commitAuthorAvatar,
                commitDate:unprocessedCommits[index]!.commitDate,
                summary
            }
        })

        if(summary) {
            const embedding = await generateEmbedding(summary)
            await db.$executeRaw`
            UPDATE "Commit"
            SET "summaryEmbedding" = ${`[${embedding.join(',')}]`}::vector
            WHERE "id" = ${commit.id}
            `

            if(linkAfterInsert) {
                await linkCommitToIssues(commit.id, projectId).catch((error) => {
                    console.error(`Failed to link commit ${commit.id} to issues`, error)
                })
            }
        }

        return commit
    }))

    return createdCommits

}

async function summariseCommit(githubUrl:string, commitHash:string){
 const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, { 
    headers:{
        Accept:'application/vnd.github.v3.diff'
     }
  })
  return await aiSummariseCommit(data) || ''
}



async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where: { id:projectId },
        select:{
            githubUrl: true
        }
    })
    if(!project?.githubUrl)
    {
        throw new Error('Project has no github Url')
    }

    return {project,githubUrl: project?.githubUrl}
}


async function filterUnprocessedCommits(projectId:string, commitHashes: Response[])
{
    const processedCommits = await db.commit.findMany({
        where: {projectId}
    })

    const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) =>processedCommit.commitHash === commit.commitHash))
    return unprocessedCommits
}

// await pollCommits('cm7oxl7780003mkrpxbqrjbdp').then(console.log)