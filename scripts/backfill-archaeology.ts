/**
 * One-off backfill: embeds existing Commit/Issue rows that predate the Code Archaeology
 * feature (summaryEmbedding IS NULL), then re-runs commit<->issue linking per project.
 * Run manually: npx tsx scripts/backfill-archaeology.ts
 */
import { db } from "../src/server/db"
import { generateEmbedding } from "../src/lib/gemini"
import { linkCommitToIssues, linkIssuesToCommits } from "../src/lib/linking"

// Note: summaryEmbedding is an Unsupported("vector(768)") column, so it is invisible
// to the Prisma Client's fluent query builder (can't select/filter/include it). All
// reads and writes of that column go through raw SQL, same as the rest of this codebase.

async function backfillCommits() {
    const commits = await db.$queryRaw`
        SELECT "id", "commitHash", "summary" FROM "Commit" WHERE "summaryEmbedding" IS NULL
    ` as { id: string; commitHash: string; summary: string }[]
    console.log(`Backfilling ${commits.length} commits...`)

    for (const commit of commits) {
        if (!commit.summary) continue
        const embedding = await generateEmbedding(commit.summary)
        await db.$executeRaw`
        UPDATE "Commit"
        SET "summaryEmbedding" = ${`[${embedding.join(',')}]`}::vector
        WHERE "id" = ${commit.id}
        `
        console.log(`  embedded commit ${commit.commitHash.slice(0, 7)}`)
    }
}

async function backfillIssues() {
    const issues = await db.$queryRaw`
        SELECT "id", "headline", "summary" FROM "Issue" WHERE "summaryEmbedding" IS NULL
    ` as { id: string; headline: string; summary: string }[]
    console.log(`Backfilling ${issues.length} issues...`)

    for (const issue of issues) {
        const embedding = await generateEmbedding(`${issue.headline}\n${issue.summary}`)
        await db.$executeRaw`
        UPDATE "Issue"
        SET "summaryEmbedding" = ${`[${embedding.join(',')}]`}::vector
        WHERE "id" = ${issue.id}
        `
        console.log(`  embedded issue "${issue.headline}"`)
    }
}

async function backfillLinks() {
    const projects = await db.project.findMany({ where: { deletedAt: null } })

    for (const project of projects) {
        console.log(`Linking commits/issues for project ${project.name} (${project.id})...`)

        const commits = await db.commit.findMany({ where: { projectId: project.id } })
        for (const commit of commits) {
            await linkCommitToIssues(commit.id, project.id)
        }

        const meetings = await db.meeting.findMany({ where: { projectId: project.id, status: 'COMPLETED' } })
        for (const meeting of meetings) {
            await linkIssuesToCommits(meeting.id, project.id)
        }
    }
}

async function main() {
    await backfillCommits()
    await backfillIssues()
    await backfillLinks()
    console.log('Backfill complete.')
}

main()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
    .finally(() => process.exit(0))
