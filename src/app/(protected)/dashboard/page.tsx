'use client'

// Server Actions (askQuestion, used by AskQuestionCard below) inherit their execution
// timeout from this page - extend past Vercel's default ~10s.
export const maxDuration = 60

import React from 'react'
import useProject from '@/hooks/use-project'
import { ExternalLink, Github, GitCommitHorizontal, Link2, FileStack, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { api } from '@/trpc/react'
import { confidenceColor, confidencePercent } from '@/lib/utils'
import AskQuestionCard from './ask-question-card'
import MeetingCard from './meeting-card'
import ArchiveButton from './archive-button'
import DeleteProjectButton from './delete-project-button'
import TeamMembers from './team-members'
import dynamic from 'next/dynamic'

const InviteButton = dynamic(() => import('./invite-button'),{ssr:false})

const StatTile = ({label, value, sub}: {label: string; value: string | number; sub?: string}) => (
  <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4">
    <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-2">{label}</div>
    <div className="font-display text-2xl font-bold text-archaeology-text">{value}</div>
    {sub && <div className="text-xs text-archaeology-textSecondary mt-1">{sub}</div>}
  </div>
)

const DashboardPage = () => {
  const {project, projectId} = useProject()
  const {data: commits} = api.project.getCommits.useQuery({projectId, limit: 5}, {enabled: !!projectId})
  const {data: commitStats} = api.project.getCommitStats.useQuery({projectId}, {enabled: !!projectId})
  const {data: decisions} = api.project.getDecisionRecords.useQuery({projectId}, {enabled: !!projectId})
  const {data: meetings} = api.project.getMeetings.useQuery({projectId}, {enabled: !!projectId})

  const totalCommits = commitStats?.total ?? 0
  const linkedCommits = commitStats?.linked ?? 0
  const linkedPercent = totalCommits > 0 ? Math.round((linkedCommits / totalCommits) * 100) : 0
  const totalDecisions = decisions?.length ?? 0
  const totalMeetings = meetings?.length ?? 0

  return (
    <div className='p-8 bg-archaeology-bg min-h-full'>
      <div className='flex items-center justify-between flex-wrap gap-y-4'>
        <div className = "w-fit rounded-md bg-archaeology-orange px-4 py-3">
          <div className = 'flex items-center'>
            <Github className = "size-5 text-white"/>
             <div className = 'ml-2'>
                <p className='text-sm font-medium text-white'>
                        This project is linked to {''}
                        <Link href = {project?.githubUrl ?? ""} className='inline-flex items-center text-white/80 hover:underline'>
                        {project?.githubUrl}
                        <ExternalLink className='ml-1 size-4'/>
                        </Link>
                </p>
            </div>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <TeamMembers/>
          <InviteButton/>
          <ArchiveButton/>
          <DeleteProjectButton/>
        </div>
      </div>

      <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mt-8 mb-2">DASHBOARD / {project?.name?.toUpperCase() ?? '...'}</div>
      <h1 className="font-display text-3xl font-extrabold text-archaeology-text mb-6">Project Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatTile label="TOTAL COMMITS" value={totalCommits} sub="indexed" />
        <StatTile label="LINKED TO MEETINGS" value={linkedCommits} sub={`${linkedPercent}% coverage`} />
        <StatTile label="DECISION RECORDS" value={totalDecisions} sub="generated" />
        <StatTile label="MEETINGS INDEXED" value={totalMeetings} sub="uploaded" />
      </div>

      <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4 mb-6 flex items-center gap-3">
        <Link2 className="text-archaeology-orange size-5 shrink-0" />
        <Link href="/ask-why" className="flex-1 text-archaeology-textSecondary text-sm hover:text-archaeology-text">
          Ask why a piece of code exists, backed by commits and meeting discussions →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-archaeology-text font-medium">
              <GitCommitHorizontal className="size-4 text-archaeology-orange" />
              Recent Commits
            </div>
            <Link href="/commits" className="text-xs text-archaeology-textSecondary hover:text-archaeology-orange flex items-center gap-1">
              VIEW ALL <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {commits?.slice(0, 5).map(commit => (
              <div key={commit.id} className="border-b border-archaeology-borderSubtle pb-2 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-archaeology-orange">{commit.commitHash.slice(0,7)}</span>
                  {commit._count.issueLinks > 0 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-archaeology-greenDim text-archaeology-green">MEETING LINKED</span>
                  )}
                </div>
                <p className="text-sm text-archaeology-text truncate">{commit.commitMessage}</p>
                {commit.issueLinks[0] && (
                  <p className="text-xs text-archaeology-textDim italic truncate border-l-2 border-archaeology-orangeDim pl-2 mt-1">
                    &quot;{commit.issueLinks[0].issue.gist}&quot;
                  </p>
                )}
              </div>
            ))}
            {(!commits || commits.length === 0) && <p className="text-sm text-archaeology-textDim">No commits indexed yet.</p>}
          </div>
        </div>

        <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-archaeology-text font-medium">
              <FileStack className="size-4 text-archaeology-orange" />
              Recent Decision Records
            </div>
            <Link href="/decisions" className="text-xs text-archaeology-textSecondary hover:text-archaeology-orange flex items-center gap-1">
              View all {totalDecisions} records <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {decisions?.slice(0, 3).map(decision => (
              <Link key={decision.id} href={`/decisions/${decision.id}`} className="block border-b border-archaeology-borderSubtle pb-2 last:border-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-archaeology-text">{decision.title}</p>
                  <span className="font-mono text-xs" style={{color: confidenceColor(decision.confidence)}}>
                    {confidencePercent(decision.confidence)}%
                  </span>
                </div>
                <p className="text-xs text-archaeology-textDim font-mono">{decision.commit.commitHash.slice(0,7)}</p>
              </Link>
            ))}
            {(!decisions || decisions.length === 0) && <p className="text-sm text-archaeology-textDim">No decision records yet — upload a meeting to get started.</p>}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-5'>
          <AskQuestionCard/>
          <MeetingCard/>
      </div>
    </div>
  )
}

export default DashboardPage
