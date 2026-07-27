import { db } from "@/server/db"
import { generateDecisionRecord } from "./decisionRecord"

const SIMILARITY_FLOOR = 0.55
const DATE_WINDOW_DAYS = 14
const STRONG_COMBINED_SCORE = 0.72
const STRONG_SIMILARITY = 0.6

function daysBetween(a: Date, b: Date) {
    return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24)
}

function computeDateScore(commitDate: string, meetingCreatedAt: Date): number | null {
    const parsedCommitDate = new Date(commitDate)
    if (isNaN(parsedCommitDate.getTime())) return null
    const diff = daysBetween(parsedCommitDate, meetingCreatedAt)
    return Math.max(0, 1 - diff / DATE_WINDOW_DAYS)
}

async function upsertCommitIssueLink(commitId: string, issueId: string, similarity: number, dateScore: number | null) {
    const combinedScore = dateScore !== null
        ? similarity * 0.8 + dateScore * 0.2
        : similarity

    const link = await db.commitIssueLink.upsert({
        where: { commitId_issueId: { commitId, issueId } },
        create: { commitId, issueId, similarity, dateScore, combinedScore },
        update: { similarity, dateScore, combinedScore },
    })

    if (combinedScore >= STRONG_COMBINED_SCORE && similarity >= STRONG_SIMILARITY) {
        generateDecisionRecord(commitId).catch((error) => {
            console.error(`Failed to generate decision record for commit ${commitId}`, error)
        })
    }

    return link
}

export async function linkCommitToIssues(commitId: string, projectId: string) {
    const commit = await db.commit.findUnique({ where: { id: commitId } })
    if (!commit) return

    const candidates = await db.$queryRaw`
        SELECT i."id" as "issueId", m."createdAt" as "meetingCreatedAt",
        1 - (i."summaryEmbedding" <=> c."summaryEmbedding") AS similarity
        FROM "Issue" i
        JOIN "Meeting" m ON m."id" = i."meetingId"
        JOIN "Commit" c ON c."id" = ${commitId}
        WHERE m."projectId" = ${projectId}
        AND i."summaryEmbedding" IS NOT NULL
        AND c."summaryEmbedding" IS NOT NULL
        AND 1 - (i."summaryEmbedding" <=> c."summaryEmbedding") > ${SIMILARITY_FLOOR}
        ORDER BY similarity DESC
        LIMIT 5
    ` as { issueId: string; meetingCreatedAt: Date; similarity: number }[]

    for (const candidate of candidates) {
        const dateScore = computeDateScore(commit.commitDate, candidate.meetingCreatedAt)
        await upsertCommitIssueLink(commitId, candidate.issueId, candidate.similarity, dateScore)
    }
}

export async function linkIssuesToCommits(meetingId: string, projectId: string) {
    const meeting = await db.meeting.findUnique({ where: { id: meetingId }, include: { issues: true } })
    if (!meeting) return

    for (const issue of meeting.issues) {
        const candidates = await db.$queryRaw`
            SELECT c."id" as "commitId", c."commitDate" as "commitDate",
            1 - (c."summaryEmbedding" <=> i."summaryEmbedding") AS similarity
            FROM "Commit" c
            JOIN "Issue" i ON i."id" = ${issue.id}
            WHERE c."projectId" = ${projectId}
            AND c."summaryEmbedding" IS NOT NULL
            AND i."summaryEmbedding" IS NOT NULL
            AND 1 - (c."summaryEmbedding" <=> i."summaryEmbedding") > ${SIMILARITY_FLOOR}
            ORDER BY similarity DESC
            LIMIT 5
        ` as { commitId: string; commitDate: string; similarity: number }[]

        for (const candidate of candidates) {
            const dateScore = computeDateScore(candidate.commitDate, meeting.createdAt)
            await upsertCommitIssueLink(candidate.commitId, issue.id, candidate.similarity, dateScore)
        }
    }
}
