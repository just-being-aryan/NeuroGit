'use server'
import {streamText} from 'ai'
import {createStreamableValue} from 'ai/rsc'
import {createGoogleGenerativeAI} from '@ai-sdk/google'
import { generateEmbedding } from '@/lib/gemini'
import { db } from '@/server/db'
import { auth } from '@clerk/nextjs/server'

// retrieval + streaming generation can take a while - extend past Vercel's default ~10s timeout
export const maxDuration = 60

const QUESTION_CREDIT_COST = 1

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
})


export async function askQuestion(question : string, projectId:string)
{
    const {userId} = await auth()
    if (!userId) throw new Error('Unauthorized')

    const user = await db.user.findUnique({where: {id: userId}, select: {credits: true}})
    if (!user || user.credits < QUESTION_CREDIT_COST) {
        throw new Error('Insufficient credits to ask a question')
    }
    await db.user.update({where: {id: userId}, data: {credits: {decrement: QUESTION_CREDIT_COST}}})

    const stream = createStreamableValue()

    const queryVector= await generateEmbedding(question)
    const vectorQuery = `[${queryVector.join(',')}]`

    const result = await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
    1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
    FROM "SourceCodeEmbedding"
    WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
    AND "projectId" = ${projectId}
    ORDER BY similarity DESC
        LIMIT 10
    ` as {fileName: string; sourceCode : string; summary: string;}[]

    let context = ''

    for (const doc of result)
    {
        context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`
    }

    (async() => {
        const {textStream} = await streamText({
            model: google('gemini-flash-latest'),
            prompt: `
            You are an AI code assistant who answers questions about the codebase. Your target audience is a technical intern who is looking to understand something.

            How to shape your answer depends on what kind of question this is:
            - If it's a general/conceptual question (e.g. "what is this project about", "what does this app do"), answer entirely in prose. Do not include a code block unless the question specifically asks to see code.
            - If it's a question about a specific file, function, or how something works, lead with a clear prose explanation first, then include only the small, targeted snippet of code that's actually relevant to illustrate your point - never paste an entire file. Explain what the snippet does and why it answers the question.
            Never respond with just a code block and no explanation - the explanation is the actual answer, the code (when included) is supporting evidence.

            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK

            START QUESTION
            ${question}
            END OF QUESTION

            Take into account any CONTEXT BLOCK provided above.
            If the context does not provide the answer to the question, say "I'm sorry, but I don't have the answer to that question."
            Do not invent anything that is not drawn directly from the context.
            Answer in markdown syntax. Be detailed and unambiguous, but concise - don't pad the answer with unnecessary code.
        `,
        });

        for await (const delta of textStream) {
            stream.update(delta)
        }

        stream.done()
    })()

    return {
        output: stream.value,
        filesReferences: result,
    }

}