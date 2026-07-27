'use client'

import React, { useState } from 'react'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { confidenceColor, confidencePercent } from '@/lib/utils'

const DecisionFeedPage = () => {
  const {projectId} = useProject()
  const {data: decisions} = api.project.getDecisionRecords.useQuery({projectId}, {enabled: !!projectId})
  const [search, setSearch] = useState('')

  const filtered = (decisions ?? []).filter(d =>
    !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.narrative.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 bg-archaeology-bg min-h-full">
      <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-2">DECISION RECORDS</div>
      <h1 className="font-display text-3xl font-extrabold text-archaeology-text mb-6">Institutional Memory</h1>

      <div className="flex items-center gap-2 bg-archaeology-card border border-archaeology-border rounded-md px-3 py-2 max-w-md mb-6">
        <Search className="size-4 text-archaeology-textDim" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search decision records..."
          className="bg-transparent outline-none text-sm text-archaeology-text placeholder:text-archaeology-textDim flex-1"
        />
      </div>

      <div className="space-y-3">
        {filtered.map(decision => (
          <Link key={decision.id} href={`/decisions/${decision.id}`} className="block bg-archaeology-card border border-archaeology-border rounded-md p-4 hover:border-archaeology-orange">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-archaeology-text font-medium mb-1">{decision.title}</p>
                <p className="text-sm text-archaeology-textSecondary line-clamp-2">{decision.narrative}</p>
                <div className="flex items-center gap-3 mt-2 font-mono text-xs text-archaeology-textDim">
                  <span>{decision.commit.commitHash.slice(0,7)}</span>
                  <span>{decision.commit.commitDate.slice(0,10)}</span>
                  <span>{decision.commit.commitAuthorName}</span>
                  {decision.issue && <span className="text-archaeology-blue">{decision.issue.meeting.name}</span>}
                </div>
              </div>
              <div
                className="shrink-0 size-12 rounded-full border-2 flex items-center justify-center font-mono text-sm"
                style={{borderColor: confidenceColor(decision.confidence), color: confidenceColor(decision.confidence)}}
              >
                {confidencePercent(decision.confidence)}%
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-archaeology-textDim text-center py-10">No decision records yet.</div>
        )}
      </div>
    </div>
  )
}

export default DecisionFeedPage
