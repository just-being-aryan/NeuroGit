import { processMeeting } from "@/lib/assembly";
import { generateEmbedding } from "@/lib/gemini";
import { linkIssuesToCommits } from "@/lib/linking";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"


const bodyParser = z.object({
    meetingUrl: z.string(),
    projectId: z.string(),
    meetingId: z.string()
})

export const maxDuration = 60 //5 minutes

export async function POST(req: NextRequest) {
    const {userId} = await auth()
    if(!userId)
    {
        return NextResponse.json({error: "Unautharized"}, {status: 401})
    }

    try{
        const body = await req.json()
        const {meetingUrl,projectId,meetingId} = bodyParser.parse(body)
        const {summaries} = await processMeeting(meetingUrl)

        await Promise.allSettled(summaries.map(async(summary) => {
            const issue = await db.issue.create({
                data: {
                    start:summary.start,
                    end: summary.end,
                    gist: summary.gist,
                    headline:summary.headline,
                    summary: summary.summary,
                    meetingId,
                }
            })

            const embedding = await generateEmbedding(`${summary.headline}\n${summary.summary}`)
            await db.$executeRaw`
            UPDATE "Issue"
            SET "summaryEmbedding" = ${`[${embedding.join(',')}]`}::vector
            WHERE "id" = ${issue.id}
            `
        }))

        await db.meeting.update({
            where: {id: meetingId} , data: {
                status: "COMPLETED",
                name: summaries[0]!.headline
            }
        })

        try {
            await linkIssuesToCommits(meetingId, projectId)
        } catch (error) {
            console.error(`Failed to link issues for meeting ${meetingId}`, error)
        }

        return NextResponse.json({success: true}, {status:200})
    }catch(error){
        console.log(error)
        return NextResponse.json({error: "Internal Server Error"}, {status:500})
    }
}