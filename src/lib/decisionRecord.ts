import { GoogleGenerativeAI } from '@google/generative-ai'
import { db } from '@/server/db'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

export async function generateDecisionRecord(commitId: string): Promise<void> {
    const bestLink = await db.commitIssueLink.findFirst({
        where: { commitId },
        orderBy: { combinedScore: 'desc' },
        include: { issue: { include: { meeting: true } }, commit: true },
    })

    if (!bestLink) return
    if (bestLink.combinedScore < 0.72 || bestLink.similarity < 0.6) return

    const { commit, issue } = bestLink

    const response = await model.generateContent([
        `You are a senior software engineer writing a lightweight Architecture Decision Record (ADR) reconstructing why a code change was made, based on a meeting discussion that plausibly relates to it.`,
        `IMPORTANT: the link between this meeting excerpt and this commit is inferred from semantic similarity and rough timing, NOT verified. Always hedge the causal claim with language like "likely", "suggested by the discussion", or "this appears to be related to" - never state it as established fact.`,
        `Meeting chapter headline: ${issue.headline}
        Meeting chapter summary: ${issue.summary}
        Meeting name: ${issue.meeting.name}
        Chapter timestamp: ${issue.start} - ${issue.end}`,
        `Commit message: ${commit.commitMessage}
        Commit summary: ${commit.summary}
        Commit author: ${commit.commitAuthorName}
        Commit date: ${commit.commitDate}`,
        `Write a short ADR-style narrative in markdown with these sections:
        ## Context
        What the meeting discussion covered.
        ## Decision
        What the commit actually did.
        ## Rationale
        Why this change likely happened, hedged appropriately, connecting the meeting discussion to the commit.
        ## Consequences
        Any inferable follow-on effects, or omit this section if none are inferable.

        Also provide a short one-line title (no more than 12 words) summarizing the decision, on the very first line, prefixed with "TITLE: ".`,
    ])

    const text = response.response.text()
    const titleMatch = text.match(/^TITLE:\s*(.+)$/m)
    const title = titleMatch?.[1]?.trim() ?? commit.commitMessage.slice(0, 80)
    const narrative = text.replace(/^TITLE:\s*.+$/m, '').trim()

    await db.decisionRecord.upsert({
        where: { commitId },
        create: {
            projectId: commit.projectId,
            commitId,
            issueId: issue.id,
            title,
            narrative,
            confidence: bestLink.combinedScore,
        },
        update: {
            issueId: issue.id,
            title,
            narrative,
            confidence: bestLink.combinedScore,
            status: 'GENERATED',
        },
    })
}
