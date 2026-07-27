import { db } from "@/server/db"

export async function deleteProjectCascade(projectId: string) {
    return await db.$transaction([
        // Commit deletion cascades to CommitIssueLink + DecisionRecord (onDelete: Cascade on those relations)
        db.commit.deleteMany({where: {projectId}}),
        // Meeting deletion cascades to Issue, which cascades to any remaining CommitIssueLink
        db.meeting.deleteMany({where: {projectId}}),
        db.sourceCodeEmbedding.deleteMany({where: {projectId}}),
        db.question.deleteMany({where: {projectId}}),
        db.userToProject.deleteMany({where: {projectId}}),
        db.project.delete({where: {id: projectId}}),
    ])
}
