'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project'
import React from 'react'
import { Button } from '@/components/ui/button'
// import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
// import { DialogHeader } from '@/components/ui/dialog'
import { Dialog, DialogTitle,DialogContent, DialogHeader } from '@/components/ui/dialog'
import Image from 'next/image'
import { askQuestion } from './actions'
import { readStreamableValue } from 'ai/rsc'

const AskQuestionCard = () => {

    const {project}  = useProject()
    const [open,setOpen] = React.useState(false)
    const [question,setQuestion] = React.useState('')
    const [loading,setLoading] = React.useState(false)
    const [filesReferences,setFilesReferences] = React.useState<{fileName:string;sourceCode:string;summary:string}[]>([])
    const [answer,setAnswer] = React.useState('')


    const onSubmit = async(e:React.FormEvent<HTMLFormElement>)  => {
        e.preventDefault()
        if(!project?.id) return
        setLoading(true)
        setOpen(true)

        const {output, filesReferences} = await askQuestion(question,project.id)
        setFilesReferences(filesReferences)

        for await (const delta of readStreamableValue(output)) {
            if(delta) {
                setAnswer(ans => ans + delta)
            }
        }

        setLoading(false)
        

    }

  return (
    <>
    <Dialog open = {open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    <Image src ='/logo.png' alt = 'asklogo' width = {100} height = {100}></Image>
                </DialogTitle>
            </DialogHeader>
            {answer}
            <h1>File Reference</h1>
            {filesReferences.map(file => {
                return <span>{file.fileName}</span>
            })}
        </DialogContent>
           
    </Dialog>
    <Card className='relative col-span-3'>
        <CardHeader>
            <CardTitle>Ask a Question</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={onSubmit}>
                <Textarea placeholder='Which file should i edit to change the home page?' value = {question} onChange={e => setQuestion(e.target.value)}/>
                <div className="h-4">
                    <Button type = 'submit'>
                        Ask NeuroGit!
                    </Button>
                </div>     
            </form>
        </CardContent>
    </Card>
    </>
  )
}

export default AskQuestionCard