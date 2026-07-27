'use client'


import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import React, { useState } from 'react'
import AskQuestionCard from '../dashboard/ask-question-card'
import MDEditor from '@uiw/react-md-editor'
import CodeReferences from '../dashboard/code-references'
import { cn } from '@/lib/utils'

type Tab = 'all' | 'why' | 'code'

const QAPage = () => {

  const {projectId} = useProject()
  const {data: questions} = api.project.getQuestions.useQuery({projectId})
  const [questionIndex, setQuestonIndex] = React.useState(0)
  const [tab, setTab] = useState<Tab>('all')

  const typed = (questions ?? []).map(q => ({...q, qaType: q.citations ? 'why' as const : 'code' as const}))
  const filtered = typed.filter(q => tab === 'all' || q.qaType === tab)
  const question = filtered[questionIndex]

  const whyCount = typed.filter(q => q.qaType === 'why').length
  const codeCount = typed.filter(q => q.qaType === 'code').length

  return (
    <Sheet>
      <div className="p-8 bg-archaeology-bg min-h-full">
        <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-2">Q&A HISTORY</div>
        <h1 className="font-display text-3xl font-extrabold text-archaeology-text mb-6">Question History</h1>

        <AskQuestionCard/>
        <div className="h-6"></div>

        <div className="flex gap-1 mb-4">
          {([['all', `ALL (${typed.length})`], ['why', `⬡ WHY QUESTIONS (${whyCount})`], ['code', `⟨/⟩ CODE Q&A (${codeCount})`]] as [Tab,string][]).map(([t, label]) => (
            <button
              key={t}
              onClick={() => {setTab(t); setQuestonIndex(0)}}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-mono border',
                tab === t ? 'bg-archaeology-orangeDim text-archaeology-orange border-archaeology-orange' : 'text-archaeology-textSecondary border-archaeology-border'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {filtered.map((q, index) => {
            return (
              <SheetTrigger key={q.id} onClick={() => {setQuestonIndex(index)}} asChild>
                <div className='flex items-center gap-4 bg-archaeology-card border border-archaeology-border rounded-md p-4 hover:border-archaeology-orange cursor-pointer'>
                    <span className={cn(
                      'text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0',
                      q.qaType === 'why' ? 'bg-archaeology-orangeDim text-archaeology-orange' : 'bg-archaeology-blueDim text-archaeology-blue'
                    )}>
                      {q.qaType === 'why' ? 'WHY' : 'CODE'}
                    </span>
                    <div className='text-left flex flex-col min-w-0 flex-1'>
                        <div className='flex items-center gap-2'>
                            <p className='text-archaeology-text line-clamp-1 font-medium'>
                                  {q.question}
                            </p>
                            <span className='text-xs text-archaeology-textDim whitespace-nowrap font-mono'>
                                    {q.createdAt.toLocaleDateString()}
                            </span>
                        </div>
                        <p className='text-archaeology-textSecondary line-clamp-1 text-sm'>
                              {q.answer}
                        </p>
                    </div>
                </div>
              </SheetTrigger>
            )
          })}
          {filtered.length === 0 && <div className="text-sm text-archaeology-textDim py-8 text-center">No questions yet.</div>}
        </div>
      </div>
       {question && (
        <SheetContent className='sm:max-w-[80vw]'>
          <SheetHeader>
            <SheetTitle>
              {question.question}
            </SheetTitle>
            <MDEditor.Markdown source = {question.answer} />
            <CodeReferences filesReferences={(question.filesReferences ?? []) as any}>

            </CodeReferences>
          </SheetHeader>
        </SheetContent>
       )}
    </Sheet>
  )
}

export default QAPage
