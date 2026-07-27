'use client'

import React, { useState } from 'react'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'linked' | 'unlinked'

const CommitsPage = () => {
  const {projectId} = useProject()
  const {data: commits} = api.project.getCommits.useQuery({projectId}, {enabled: !!projectId})
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const filtered = (commits ?? []).filter(c => {
    if (filter === 'linked' && c._count.issueLinks === 0) return false
    if (filter === 'unlinked' && c._count.issueLinks > 0) return false
    if (search && !`${c.commitMessage} ${c.commitHash} ${c.commitAuthorName}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const linkedCount = (commits ?? []).filter(c => c._count.issueLinks > 0).length
  const unlinkedCount = (commits?.length ?? 0) - linkedCount

  return (
    <div className="p-8 bg-archaeology-bg min-h-full">
      <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-2">COMMITS</div>
      <h1 className="font-display text-3xl font-extrabold text-archaeology-text mb-6">Commit History</h1>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-archaeology-card border border-archaeology-border rounded-md px-3 py-2 flex-1 max-w-md">
          <Search className="size-4 text-archaeology-textDim" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search commits..."
            className="bg-transparent outline-none text-sm text-archaeology-text placeholder:text-archaeology-textDim flex-1"
          />
        </div>
        <div className="flex gap-1">
          {(['all','linked','unlinked'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-mono uppercase border',
                filter === f ? 'bg-archaeology-orangeDim text-archaeology-orange border-archaeology-orange' : 'text-archaeology-textSecondary border-archaeology-border'
              )}
            >
              {f} {f === 'linked' ? `(${linkedCount})` : f === 'unlinked' ? `(${unlinkedCount})` : `(${commits?.length ?? 0})`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-archaeology-card border border-archaeology-border rounded-md overflow-hidden">
        <div className="grid grid-cols-[100px_1fr_140px_120px_160px] gap-2 px-4 py-2 border-b border-archaeology-borderSubtle font-mono text-[10px] tracking-widest text-archaeology-textDim">
          <span>HASH</span><span>COMMIT</span><span>AUTHOR</span><span>DATE</span><span>STATUS</span>
        </div>
        {filtered.map(commit => (
          <div key={commit.id} className="grid grid-cols-[100px_1fr_140px_120px_160px] gap-2 px-4 py-3 border-b border-archaeology-borderSubtle last:border-0 items-center">
            <span className="font-mono text-xs text-archaeology-orange">{commit.commitHash.slice(0,7)}</span>
            <div className="min-w-0">
              <p className="text-sm text-archaeology-text truncate">{commit.commitMessage}</p>
              {commit.issueLinks[0] && (
                <p className="text-xs text-archaeology-textDim italic truncate border-l-2 border-archaeology-orangeDim pl-2 mt-1">
                  &quot;{commit.issueLinks[0].issue.gist}&quot;
                </p>
              )}
            </div>
            <span className="text-xs text-archaeology-textSecondary truncate">{commit.commitAuthorName}</span>
            <span className="text-xs text-archaeology-textSecondary">{commit.commitDate.slice(0,10)}</span>
            <div className="flex items-center gap-1">
              {commit._count.issueLinks > 0 ? (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-archaeology-greenDim text-archaeology-green">MEETING LINKED</span>
              ) : (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-archaeology-card text-archaeology-textDim border border-archaeology-border">NO LINK</span>
              )}
              {commit.decisionRecord && (
                <Link href={`/decisions/${commit.decisionRecord.id}`} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-archaeology-orangeDim text-archaeology-orange">
                  ◆ DECISION
                </Link>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-6 text-sm text-archaeology-textDim text-center">No commits match this filter.</div>
        )}
      </div>
    </div>
  )
}

export default CommitsPage
