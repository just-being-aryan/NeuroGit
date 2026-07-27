'use client'

import React from 'react'
import { api } from '@/trpc/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import MDEditor from '@uiw/react-md-editor'
import { confidenceColor, confidencePercent } from '@/lib/utils'
import { ArrowLeft, GitCommitHorizontal, Presentation } from 'lucide-react'

const DecisionDetailPage = () => {
  const {decisionId} = useParams<{decisionId: string}>()
  const {data: decision, isLoading} = api.project.getDecisionRecord.useQuery({id: decisionId})

  if (isLoading) return <div className="p-8 text-sm text-archaeology-textDim">Loading...</div>
  if (!decision) return <div className="p-8 text-sm text-archaeology-textDim">Decision record not found.</div>

  const color = confidenceColor(decision.confidence)
  const percent = confidencePercent(decision.confidence)

  return (
    <div className="p-8 bg-archaeology-bg min-h-full">
      <Link href="/decisions" className="flex items-center gap-1 text-xs font-mono text-archaeology-textDim hover:text-archaeology-orange mb-4">
        <ArrowLeft className="size-3" /> DECISION RECORDS / {decision.id.slice(0,8)}
      </Link>

      <h1 className="font-display text-3xl font-extrabold text-archaeology-text mb-6">{decision.title}</h1>

      <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4 mb-6 flex items-center gap-6">
        <div
          className="size-16 rounded-full border-2 flex items-center justify-center font-mono text-lg shrink-0"
          style={{borderColor: color, color}}
        >
          {percent}%
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-1">AI-INFERRED CONFIDENCE</div>
          <p className="text-sm text-archaeology-textSecondary">This link was inferred from semantic similarity and commit/meeting timing — not verified.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 font-mono text-xs">
        <div><div className="text-archaeology-textDim mb-1">COMMIT</div><div className="text-archaeology-orange">{decision.commit.commitHash.slice(0,7)}</div></div>
        <div><div className="text-archaeology-textDim mb-1">DATE</div><div className="text-archaeology-text">{decision.commit.commitDate.slice(0,10)}</div></div>
        <div><div className="text-archaeology-textDim mb-1">AUTHOR</div><div className="text-archaeology-text">{decision.commit.commitAuthorName}</div></div>
        <div><div className="text-archaeology-textDim mb-1">MEETING</div><div className="text-archaeology-text">{decision.issue?.meeting.name ?? '—'}</div></div>
      </div>

      <div className="bg-archaeology-card border border-archaeology-border rounded-md p-6 mb-6">
        <MDEditor.Markdown
          source={decision.narrative}
          style={{backgroundColor: 'transparent', color: '#EFEFEF'}}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-archaeology-textDim mb-3">
            <GitCommitHorizontal className="size-3" /> COMMIT
          </div>
          <p className="text-sm text-archaeology-text mb-1">{decision.commit.commitMessage}</p>
          <p className="text-xs text-archaeology-textSecondary">{decision.commit.summary}</p>
          <Link href="/commits" className="text-xs text-archaeology-orange mt-3 inline-block">VIEW COMMITS →</Link>
        </div>
        {decision.issue && (
          <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-archaeology-textDim mb-3">
              <Presentation className="size-3" /> MEETING SOURCE
            </div>
            <p className="text-sm text-archaeology-text mb-1">{decision.issue.meeting.name}</p>
            <p className="text-xs text-archaeology-textDim font-mono mb-2">{decision.issue.start} - {decision.issue.end}</p>
            <blockquote className="italic text-archaeology-textSecondary border-l-2 border-archaeology-orange pl-3">
              {decision.issue.summary}
            </blockquote>
            <Link href={`/meetings/${decision.issue.meetingId}`} className="text-xs text-archaeology-orange mt-3 inline-block">VIEW MEETING →</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default DecisionDetailPage
