import {Octokit} from "octokit";

export const octokit = new Octokit({
    auth:process.env.GITHUB_TOKEN,
})

const githubUrl = 'https://github.com/docker/genai-stock'

type Response = {
    commitHash:String;
    commitMessage:String;
    commitAuthorName:String;
    commitAuthorAvatar:String;
    commitDate:String;
}

export const getCommitHashes = async(githubUrl:string) : Promise<Response[]> => {
    const {data} = await octokit.rest.repos.listCommits({
        owner: 'docker',
        repo: 'genai-stack'
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

// getCommitHashes(githubUrl)
console.log(await getCommitHashes(githubUrl))