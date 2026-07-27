'use client'
import { api, RouterOutputs } from '@/trpc/react'
import { VideoIcon, ChevronDown, GitCommitHorizontal } from 'lucide-react'
import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'


type Props = {
    meetingId: string
}

const IssuesList = ({meetingId}: Props) => {
    const {data: meeting, isLoading} = api.project.getMeetingById.useQuery({meetingId}, {
        refetchInterval: (query) => query.state.data?.status === 'PROCESSING' ? 4000 : false
    })
    if(isLoading || !meeting) return <div className="p-8 text-sm text-archaeology-textDim">Loading...</div>
  return (
      <div className='p-8 bg-archaeology-bg min-h-full'>
        <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-2">MEETINGS / MEETING CHAPTERS</div>
        <div className='flex items-center gap-x-4 border-b border-archaeology-borderSubtle pb-6 mb-6'>
            <div className='rounded-full border border-archaeology-border bg-archaeology-card p-3'>
                <VideoIcon className='h-6 w-6 text-archaeology-orange'/>
            </div>
            <div>
              <div className='text-sm text-archaeology-textSecondary'>
                  Meeting on {""}{meeting.createdAt.toLocaleDateString()}
              </div>
              <div className='mt-1 font-display text-xl font-bold text-archaeology-text'>
                    {meeting.name}
              </div>
            </div>
        </div>
        <div className="font-mono text-xs tracking-widest text-archaeology-textDim mb-3">CHAPTERS — {meeting.issues.length} TOTAL</div>
        <div className='space-y-2'>
            {meeting.issues.map(issue => (
              <IssueRow key = {issue.id} issue={issue}/>
            ))}
        </div>
      </div>
  )
}

function IssueRow({ issue }: { issue: NonNullable<RouterOutputs["project"]["getMeetingById"]>["issues"][number] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-archaeology-card border border-archaeology-border rounded-md overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-xs text-archaeology-textDim shrink-0">{issue.start}</span>
          <span className="text-sm text-archaeology-text font-medium truncate">{issue.headline}</span>
          {issue.commitLinks.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-archaeology-greenDim text-archaeology-green shrink-0">
              {issue.commitLinks.length} COMMIT{issue.commitLinks.length > 1 ? 'S' : ''} LINKED
            </span>
          )}
        </div>
        <ChevronDown className={cn('size-4 text-archaeology-textDim shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-archaeology-borderSubtle pt-3">
          <p className="text-sm text-archaeology-textSecondary mb-3">{issue.summary}</p>
          <blockquote className="border-l-2 border-archaeology-orange bg-archaeology-surface p-3 rounded mb-3">
              <span className="text-xs font-mono text-archaeology-textDim">
                  {issue.start} - {issue.end}
              </span>
              <p className="italic text-archaeology-text mt-1">
                  {issue.gist}
              </p>
          </blockquote>
          {issue.commitLinks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {issue.commitLinks.map(link => (
                <Link
                  key={link.id}
                  href="/commits"
                  className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-archaeology-surface border border-archaeology-border text-archaeology-orange hover:bg-archaeology-cardHover"
                >
                  <GitCommitHorizontal className="size-3" />
                  {link.commit.commitHash.slice(0,7)}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default IssuesList
