'use server'
import { streamText } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateEmbedding } from '@/lib/gemini'
import { db } from '@/server/db'
import { Prisma } from '@prisma/client'

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
})

export type WhyCitation =
    | { type: 'file'; fileName: string }
    | { type: 'commit'; commitHash: string; commitMessage: string }
    | { type: 'issue'; meetingName: string; headline: string; start: string; end: string }

export async function askWhy(
    question: string,
    projectId: string,
    scope?: { fileName?: string; commitHash?: string }
) {
    const stream = createStreamableValue()

    const queryVector = await generateEmbedding(question)
    const vectorQuery = `[${queryVector.join(',')}]`

    const codeMatches = await db.$queryRaw(Prisma.sql`
        SELECT "fileName", "sourceCode", "summary",
        1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
        FROM "SourceCodeEmbedding"
        WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
        AND "projectId" = ${projectId}
        ${scope?.fileName ? Prisma.sql`AND "fileName" = ${scope.fileName}` : Prisma.empty}
        ORDER BY similarity DESC
        LIMIT 10
    `) as { fileName: string; sourceCode: string; summary: string }[]

    const commitMatches = await db.$queryRaw(Prisma.sql`
        SELECT "commitHash", "commitMessage", "commitAuthorName", "commitDate", "summary",
        1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
        FROM "Commit"
        WHERE "summaryEmbedding" IS NOT NULL
        AND 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
        AND "projectId" = ${projectId}
        ${scope?.commitHash ? Prisma.sql`AND "commitHash" = ${scope.commitHash}` : Prisma.empty}
        ORDER BY similarity DESC
        LIMIT 5
    `) as { commitHash: string; commitMessage: string; commitAuthorName: string; commitDate: string; summary: string }[]

    const issueMatches = await db.$queryRaw`
        SELECT i."headline", i."summary", i."start", i."end", m."name" as "meetingName",
        1 - (i."summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
        FROM "Issue" i
        JOIN "Meeting" m ON m."id" = i."meetingId"
        WHERE i."summaryEmbedding" IS NOT NULL
        AND 1 - (i."summaryEmbedding" <=> ${vectorQuery}::vector) > .5
        AND m."projectId" = ${projectId}
        ORDER BY similarity DESC
        LIMIT 5
    ` as { headline: string; summary: string; start: string; end: string; meetingName: string }[]

    let context = 'CODE:\n'
    for (const doc of codeMatches) {
        context += `[file ${doc.fileName}]\ncode content: ${doc.sourceCode}\nsummary: ${doc.summary}\n\n`
    }

    context += 'COMMITS:\n'
    for (const commit of commitMatches) {
        context += `[commit ${commit.commitHash.slice(0, 7)}] by ${commit.commitAuthorName} on ${commit.commitDate}\nmessage: ${commit.commitMessage}\nsummary: ${commit.summary}\n\n`
    }

    context += 'MEETING DISCUSSIONS:\n'
    for (const issue of issueMatches) {
        context += `[meeting "${issue.meetingName}" at ${issue.start}]\nheadline: ${issue.headline}\nsummary: ${issue.summary}\n\n`
    }

    const citations: WhyCitation[] = [
        ...codeMatches.map((d): WhyCitation => ({ type: 'file', fileName: d.fileName })),
        ...commitMatches.map((c): WhyCitation => ({ type: 'commit', commitHash: c.commitHash, commitMessage: c.commitMessage })),
        ...issueMatches.map((i): WhyCitation => ({ type: 'issue', meetingName: i.meetingName, headline: i.headline, start: i.start, end: i.end })),
    ]

    ;(async () => {
        const { textStream } = await streamText({
            model: google('gemini-1.5-flash'),
            prompt: `
            You are an AI assistant reconstructing the reasoning trail behind a piece of code - not just what it does, but WHY it was built this way.
            Your target audience is a developer trying to understand the history and rationale behind a decision in the codebase.
            Use the commit history and meeting discussion excerpts below as evidence to explain the "why", in addition to the code itself.
            Cite every source you use inline with bracketed tags exactly as they appear in the context, e.g. [commit abc1234], [meeting "Sprint Planning" at 04:12], [file src/lib/foo.ts].
            Do not invent anything that is not drawn directly from the context.
            If the context does not provide enough evidence to explain "why", say so plainly instead of guessing at motives.

            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK

            START QUESTION
            ${question}
            END OF QUESTION

            Answer in markdown syntax, with code snippets if needed. Be detailed, and make sure every claim about "why" is backed by an inline citation.
        `,
        })

        for await (const delta of textStream) {
            stream.update(delta)
        }

        stream.done()
    })()

    return {
        output: stream.value,
        citations,
    }
}
