'use client'

// Server Actions (askWhy) inherit their execution timeout from this page - extend
// past Vercel's default ~10s so retrieval + streaming generation has room to finish.
export const maxDuration = 60

import React, { useState } from 'react'
import useProject from '@/hooks/use-project'
import { askWhy } from '@/lib/archaeology'
import { readStreamableValue } from 'ai/rsc'
import MDEditor from '@uiw/react-md-editor'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import { GitCommitHorizontal, Presentation, FileCode, HelpCircle } from 'lucide-react'
import type { WhyCitation } from '@/lib/archaeology'

const exampleQuestions = [
  'Why does the auth system use JWT instead of sessions?',
  'Why was the caching layer added to the API?',
  'Why did we switch from REST to tRPC?',
]

const AskWhyPage = () => {
  const {project} = useProject()
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState('')
  const [citations, setCitations] = useState<WhyCitation[]>([])
  const [asked, setAsked] = useState(false)
  const saveWhyAnswer = api.project.saveWhyAnswer.useMutation()

  const handleAsk = async (q?: string) => {
    const finalQuestion = q ?? question
    if (!finalQuestion.trim() || !project?.id) return
    setQuestion(finalQuestion)
    setAnswer('')
    setCitations([])
    setLoading(true)
    setAsked(true)

    try {
      const {output, citations: cites} = await askWhy(finalQuestion, project.id)
      setCitations(cites)

      for await (const delta of readStreamableValue(output)) {
        if (delta) setAnswer(ans => ans + delta)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to ask question')
      setAsked(false)
    } finally {
      setLoading(false)
    }
  }

  const commitCitations = citations.filter((c): c is Extract<WhyCitation, {type: 'commit'}> => c.type === 'commit')
  const issueCitations = citations.filter((c): c is Extract<WhyCitation, {type: 'issue'}> => c.type === 'issue')
  const fileCitations = citations.filter((c): c is Extract<WhyCitation, {type: 'file'}> => c.type === 'file')

  return (
    <div className="p-8 bg-archaeology-bg min-h-full">
      <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-2">ASK WHY / {project?.name?.toUpperCase() ?? '...'}</div>
      <h1 className="font-display text-3xl font-extrabold text-archaeology-text mb-6">Code Archaeology</h1>

      <div className="bg-archaeology-card border border-archaeology-border rounded-md p-2 flex items-center gap-2 mb-3">
        <span className="font-mono text-xs text-archaeology-orange pl-2">WHY</span>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
          placeholder="...does this code exist the way it does?"
          className="bg-transparent outline-none text-sm text-archaeology-text placeholder:text-archaeology-textDim flex-1"
        />
        <button
          onClick={() => handleAsk()}
          disabled={loading}
          className="bg-archaeology-orange text-white text-sm px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? 'Searching…' : 'Ask'}
        </button>
      </div>

      {!asked && (
        <div className="flex flex-wrap gap-2 mb-8">
          {exampleQuestions.map(q => (
            <button
              key={q}
              onClick={() => handleAsk(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-archaeology-border text-archaeology-textSecondary hover:border-archaeology-orange hover:text-archaeology-orange"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {!asked && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-archaeology-textDim">
          <HelpCircle className="size-10 mb-3" />
          <p>Ask your first question</p>
        </div>
      )}

      {asked && (
        <div>
          <div className="mb-4">
            <p className="text-lg text-archaeology-text font-medium">{question}</p>
          </div>

          <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4 mb-6">
            <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-2">ANSWER</div>
            <MDEditor.Markdown
              source={answer || (loading ? 'Searching commits and meeting discussions…' : 'No answer yet.')}
              className="!bg-transparent !text-archaeology-text"
              style={{backgroundColor: 'transparent', color: '#EFEFEF'}}
            />
          </div>

          {(commitCitations.length > 0 || issueCitations.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {commitCitations.length > 0 && (
                <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-archaeology-textDim mb-3">
                    <GitCommitHorizontal className="size-3" /> COMMIT EVIDENCE
                  </div>
                  {commitCitations.map((c, i) => (
                    <div key={i} className="text-sm mb-2">
                      <span className="font-mono text-archaeology-orange">{c.commitHash.slice(0,7)}</span>{' '}
                      <span className="text-archaeology-textSecondary">{c.commitMessage}</span>
                    </div>
                  ))}
                </div>
              )}
              {issueCitations.length > 0 && (
                <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-archaeology-textDim mb-3">
                    <Presentation className="size-3" /> MEETING EXCERPT
                  </div>
                  {issueCitations.map((c, i) => (
                    <div key={i} className="text-sm mb-2">
                      <span className="text-archaeology-text font-medium">{c.meetingName}</span>{' '}
                      <span className="font-mono text-xs text-archaeology-textDim">at {c.start}</span>
                      <p className="text-archaeology-textSecondary italic">{c.headline}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {fileCitations.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {fileCitations.map((c, i) => (
                <span key={i} className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-archaeology-card border border-archaeology-border text-archaeology-textSecondary">
                  <FileCode className="size-3" /> {c.fileName}
                </span>
              ))}
            </div>
          )}

          {!loading && answer && (
            <button
              disabled={saveWhyAnswer.isPending}
              onClick={() => {
                if (!project?.id) return
                saveWhyAnswer.mutate({
                  projectId: project.id,
                  question,
                  answer,
                  citations,
                }, {
                  onSuccess: () => toast.success('Saved to Q&A History'),
                  onError: () => toast.error('Failed to save'),
                })
              }}
              className="text-sm px-4 py-2 rounded-md border border-archaeology-border text-archaeology-text hover:bg-archaeology-cardHover"
            >
              Save to Q&A History
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default AskWhyPage
