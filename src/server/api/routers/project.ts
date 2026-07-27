import { z } from "zod"
import { createTRPCRouter,protectedProcedure, publicProcedure } from "../trpc"
import { pollCommits } from "@/lib/github"
import { checkCredits, indexGithubRepo } from "@/lib/github-loader"
import { generateDecisionRecord } from "@/lib/decisionRecord"
import { deleteProjectCascade } from "@/lib/project-cleanup"



export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name : z.string(),
            githubUrl : z.string(),
            githubToken: z.string().optional()
        })
    ).mutation(async({ctx,input}) => {

        const user = await ctx.db.user.findUnique({where: {id: ctx.user.userId!}, select: {credits: true}})
        if(!user){
            throw new Error("User not found")
        }

        // Repo indexing itself is free - credits are only spent on questions asked (Ask Why / code Q&A).
        const project = await ctx.db.project.create({
            data: {
                githubUrl: input.githubUrl,
                name:input.name,
                userToProjects: {
                    create: {
                        userId: ctx.user.userId!,
                    }
                }
            }

        })

        try {
            await indexGithubRepo(project.id,input.githubUrl, input.githubToken)
            await pollCommits(project.id, false) // skip linking: a brand-new project has no meetings yet
        } catch (error) {
            // don't leave an empty, broken project sitting in the sidebar if indexing failed
            await deleteProjectCascade(project.id).catch(cleanupError => {
                console.error(`Failed to clean up project ${project.id} after failed indexing:`, cleanupError)
            })
            throw error
        }

        return project

    }),
    getProjects:protectedProcedure.query(async({ctx}) => {
        return await ctx.db.project.findMany({
            where:{
                userToProjects:{
                    some:{
                        userId:ctx.user.userId!
                    }
                },
                deletedAt:null
            }
        })
    }),
    getCommits:protectedProcedure.input(z.object ({
        projectId : z.string(),
        limit: z.number().optional(),
    })).query(async({ctx,input}) =>{
        pollCommits(input.projectId).then().catch(console.error)
        return await ctx.db.commit.findMany({
            where:{projectId:input.projectId},
            include: {
                _count: {select: {issueLinks: true}},
                decisionRecord: {select: {id: true, title: true, confidence: true}},
                issueLinks: {
                    orderBy: {combinedScore: 'desc'},
                    take: 1,
                    select: {issue: {select: {gist: true}}},
                },
            },
            orderBy: {commitDate: 'desc'},
            take: input.limit,
        })
    }),

    getCommitStats: protectedProcedure.input(z.object({projectId: z.string()})).query(async({ctx,input}) => {
        const [total, linked] = await Promise.all([
            ctx.db.commit.count({where: {projectId: input.projectId}}),
            ctx.db.commit.count({where: {projectId: input.projectId, issueLinks: {some: {}}}}),
        ])
        return {total, linked}
    }),
   
    saveAnswer:protectedProcedure.input(z.object({
        projectId: z.string(),
        answer: z.string(),
        question: z.string(),
        filesReferences: z.any(),
    })).mutation(async({ctx,input}) => {
        return await ctx.db.question.create({
            data: {
                answer:input.answer,
                filesReferences: input.filesReferences,
                projectId: input.projectId,
                question: input.question,
                userId: ctx.user.userId!,
                
            }
        })
    }),
    getQuestions: protectedProcedure.input(z.object({projectId:z.string()})).query(async({ctx,input}) => {
        return await ctx.db.question.findMany({
            where : {
                projectId:input.projectId
            },
            include: {
                user:true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })  
    }),
    uploadMeeting: protectedProcedure.input(z.object({
        projectId: z.string(),
        meetingUrl: z.string(),
        name: z.string(),
        
    }))
    .mutation(async ({ ctx, input }) => {
        const meeting = await ctx.db.meeting.create({
            data: {
                meetingUrl: input.meetingUrl,
                projectId: input.projectId,
                name: input.name,
                status: "PROCESSING"
            }
        })
        return meeting
    }),
    getMeetings: protectedProcedure.input(z.object({projectId: z.string()}))
        .query(async({ctx,input}) => {
            return await ctx.db.meeting.findMany({where: {projectId: input.projectId}, include: {issues: true}})
    }),

    deleteMeeting: protectedProcedure.input(z.object({meetingId: z.string()})).mutation(async({ctx,input}) => {
            return await ctx.db.meeting.delete({where: {id: input.meetingId}})
    }),
    getMeetingById:protectedProcedure.input(z.object({meetingId: z.string()})).query(async({ctx,input}) => {
    return await ctx.db.meeting.findUnique({
        where: {id: input.meetingId},
        include: {issues: {include: {commitLinks: {include: {commit: true}, orderBy: {combinedScore: 'desc'}}}}}
    })
   }),

   archiveProject: protectedProcedure.input(z.object({projectId: z.string()})).mutation(async ({ctx,input}) => {
    return await ctx.db.project.update({where: {id: input.projectId}, data: {deletedAt: new Date()}})
   }),

   deleteProject: protectedProcedure.input(z.object({projectId: z.string()})).mutation(async ({input}) => {
    return await deleteProjectCascade(input.projectId)
   }),

   getTeamMembers:protectedProcedure.input(z.object({projectId: z.string()})).query(async({ctx,input}) => {
    return await ctx.db.userToProject.findMany({where: {projectId: input.projectId}, include: {user: true}})
   }),
   
   //FOR BILLING
   
   getMyCredits: protectedProcedure.query(async ( {ctx} ) => {
    return await ctx.db.user.findUnique({where: {id: ctx.user.userId!}, select: {credits:true}})
   }),

   getTransactions: protectedProcedure.query(async ({ctx}) => {
    return await ctx.db.stripeTransaction.findMany({
        where: {userId: ctx.user.userId!},
        orderBy: {createdAt: 'desc'}
    })
   }),

   checkCredits: protectedProcedure.input(z.object({githubUrl: z.string(),githubToken:z.string().optional() })).mutation(async({ctx,input}) => {
    const fileCount = await checkCredits(input.githubUrl, input.githubToken)
    const userCredits = await ctx.db.user.findUnique({where: {id: ctx.user.userId!}, select: {credits: true}})
    return {fileCount,userCredits:userCredits?.credits || 0}
   }),

   // CODE ARCHAEOLOGY

   getDecisionRecords: protectedProcedure.input(z.object({projectId: z.string()})).query(async({ctx,input}) => {
    return await ctx.db.decisionRecord.findMany({
        where: {projectId: input.projectId},
        include: {commit: true, issue: {include: {meeting: true}}},
        orderBy: {createdAt: 'desc'}
    })
   }),

   getDecisionRecordByCommit: protectedProcedure.input(z.object({commitId: z.string()})).query(async({ctx,input}) => {
    return await ctx.db.decisionRecord.findUnique({
        where: {commitId: input.commitId},
        include: {commit: true, issue: {include: {meeting: true}}}
    })
   }),

   getDecisionRecord: protectedProcedure.input(z.object({id: z.string()})).query(async({ctx,input}) => {
    return await ctx.db.decisionRecord.findUnique({
        where: {id: input.id},
        include: {commit: true, issue: {include: {meeting: true}}}
    })
   }),

   regenerateDecisionRecord: protectedProcedure.input(z.object({commitId: z.string()})).mutation(async({ctx,input}) => {
    await generateDecisionRecord(input.commitId)
    return await ctx.db.decisionRecord.findUnique({
        where: {commitId: input.commitId},
        include: {commit: true, issue: {include: {meeting: true}}}
    })
   }),

   getCommitLinks: protectedProcedure.input(z.object({commitId: z.string()})).query(async({ctx,input}) => {
    return await ctx.db.commitIssueLink.findMany({
        where: {commitId: input.commitId},
        include: {issue: {include: {meeting: true}}},
        orderBy: {combinedScore: 'desc'}
    })
   }),

   saveWhyAnswer: protectedProcedure.input(z.object({
    projectId: z.string(),
    answer: z.string(),
    question: z.string(),
    citations: z.any(),
   })).mutation(async({ctx,input}) => {
    return await ctx.db.question.create({
        data: {
            answer: input.answer,
            citations: input.citations,
            projectId: input.projectId,
            question: input.question,
            userId: ctx.user.userId!,
        }
    })
   })

})