import {GoogleGenerativeAI} from '@google/generative-ai'



import { Document } from '@langchain/core/documents'
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({
    model : 'gemini-1.5-flash'
})

export const aiSummariseCommit = async(diff:string) => {
    const response = await model.generateContent([
        `You are an expert programmer, and you are trying to summarize a git diff.
        Reminders about the git diff format:
        For every file, there are a few metdata lines. like (for example)
        \'\'\'
        diff --git a/lib/index.js b/lib/index.js
        index aadf6891..bfef603 100644
        ---a/lib/index.js
        ---b/lib/index.js
        \'\'\'
        This means that \'lib/index.js\' was modified in this commit. note that this is only an example.
        Then there is a specifier of the lines that were modifies.
        A line starting with \'+\' means it was added 
        A line starting with \'-\' means it was deleted 
        A line that starts with  neither \'+\' nor \'-\' is code given for context and better understanding
        it is not part of the diff
        [...]
         
        EXAMPLE SUMMARY CONTENTS:
        \'\'\'
        
        *Raised the amount of returned recordings from \'10\' to \'100\' [packages/server/recordings_api.ts], [packages/server/constant..]
        *Fixed a typo in the github action name [.gihub/workflows/gpt-commit-summarizer.yml]
        *Moved the \'octokit\' intialization to a seperate file [src/octokit.ts], [src/index.ts]
        *Lowered numeric tolerance for test files
        *added an openAI for completions [packafes/utils/apis/openai.ts]
        
        Most commits will have less comitts than the relevant files in the hypothetical commit.
        Do not include parts of your example in summary
        It is given only as an example of apropriate comments.`,
        `Please summarize the following diff file: \n\n${diff}`,
    ]);


    return response.response.text();
}

export async function summariseCode(doc: Document) {
    console.log("getting summary for", doc.metadata.source);
    try {
        const code = doc.pageContent.slice(0,10000); //limit to 10,000 character
        const response = await model.generateContent([
        `You are an intelligent senior software engineer who specialises in onboarding junion software engineers onto projects`,
         `You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file`,
        `Here is the code:
        ---
        ${code}
        ---
            Give a summary no more than 100 words for the code above`,        

    ]);



    return response.response.text()

    
    } catch (error) {
        return ''
    }
    

    
}

export async function generateEmbedding(sumary:string) {
    const model = genAI.getGenerativeModel({
        model: 'text-embedding-004'
    })
    const result = await model.embedContent(sumary)              //spelling
    const embedding = result.embedding
    return embedding.values
}

