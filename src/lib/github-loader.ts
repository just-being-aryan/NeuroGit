import {GithubRepoLoader} from '@langchain/community/document_loaders/web/github'
import { Document } from '@langchain/core/documents'
import { generateEmbedding, summariseCode } from './gemini'
import { db } from '@/server/db'
import { Octokit } from 'octokit'

export const checkCredits = async(githubUrl:string, githubToken?:string) => {
    //find out how many total files are in the repo - one Git Trees call instead of
    //one getContent call per folder, to keep this cheap against GitHub's rate limit
    const octokit = new Octokit({auth: githubToken || process.env.GITHUB_TOKEN})
    const githubOwner = githubUrl.split('/')[3]
    const githubRepo = githubUrl.split('/')[4]
    if(!githubOwner || !githubRepo) {
        return 0
    }
    const {data: repoData} = await octokit.rest.repos.get({owner: githubOwner, repo: githubRepo})
    const {data: treeData} = await octokit.rest.git.getTree({
        owner: githubOwner,
        repo: githubRepo,
        tree_sha: repoData.default_branch,
        recursive: 'true',
    })
    return treeData.tree.filter(item => item.type === 'blob').length
}

export const loadGithubRepo = async (githubUrl: string, githubToken?:string) => {
    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || process.env.GITHUB_TOKEN || '',
        branch : 'main',
        ignoreFiles : ['package-lock.json','yarn-lock','pnpm-lock.yaml','bun.lockb'],
        recursive: true,
        unknown: 'warn',
        maxConcurrency:5
    })
    const docs = await loader.load()
    return docs
} 

// console.log(await loadGithubRepo('https://github.com/just-being-aryan/Food-Delivery-App'))

export const indexGithubRepo = async(projectId: string, githubUrl:string,githubToken?:string ) => {
    const docs = await loadGithubRepo(githubUrl,githubToken)
    const allEmbeddings = await generateEmbeddings(docs)
    await Promise.allSettled(allEmbeddings.map(async(embedding,index) => {
        console.log(`Procedding ${index} of ${allEmbeddings.length}` )
        if(!embedding) return 

        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
            data : {
                summary: embedding.summary,
                sourceCode:embedding.sourceCode,
                fileName: embedding.fileName,
                projectId
            }
        })

        await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE "id" = ${sourceCodeEmbedding.id}
        
        `
    }))
}


const generateEmbeddings = async(docs:Document[]) => {
    return await Promise.all(docs.map(async doc => {
        const summary = await summariseCode(doc)
        const embedding = await generateEmbedding(summary)
        return {
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName : doc.metadata.source,
        }
    }))
}