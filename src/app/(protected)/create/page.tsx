'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import { cn } from '@/lib/utils'

import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'


type FormInput = {
    repoUrl: string
    projectName: string  
    githubToken?: string
}
const CreatePage = () => {


  const{register, handleSubmit, reset} = useForm<FormInput>()
  const createProject = api.project.createProject.useMutation()
  const checkCredits = api.project.checkCredits.useMutation()
  const refetch = useRefetch()

  function onSubmit(data:FormInput) {

    if(!!checkCredits.data) {
        createProject.mutate({
          githubUrl: data.repoUrl,
          name: data.projectName,
          githubToken: data.githubToken
        }, {
          onSuccess: () => {
            toast.success('Project created successfully')
            refetch()
            reset()
          },
          onError: () => {
            toast.error("Failed to create project")
          }
      })
    } else{
      checkCredits.mutate({
        githubUrl: data.repoUrl,
        githubToken: data.githubToken
      })
    }
    
    //return button was removed
  }

  
  const hasEnoughCredits = checkCredits?.data?.userCredits?checkCredits.data.fileCount <= checkCredits.data.userCredits: true


    return (
    <div className = "flex items-center gap-12 h-full justify-center bg-archaeology-bg">
        <img src='/undraw_github.svg' className = "h-56 w-auto" />
        <div>
          <div>
            <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-2">NEW PROJECT</div>
            <h1 className= 'font-display text-2xl font-bold text-archaeology-text'>
                Link your GitHub Repository
            </h1>
            <p className='text-sm text-archaeology-textSecondary'>
                Enter the URL of your repository to link it to NeuroGit
            </p>
          </div>
          <div className = 'h-4'>

          </div>
          <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                    {...register('projectName', {required:true })}
                    placeholder = 'Project Name'
                    required
                    className="bg-archaeology-surface border-archaeology-border text-archaeology-text placeholder:text-archaeology-textDim"
              />
              <div className='h-2'></div>
              <Input
                    {...register('repoUrl', {required:true })}
                    placeholder = 'Github URL'
                    type = 'url'
                    required
                    className="bg-archaeology-surface border-archaeology-border text-archaeology-text placeholder:text-archaeology-textDim"
              />
              <div className='h-2'></div>
              <Input
                    {...register('githubToken')}
                    placeholder = 'GitHub Token (Optional)'
                    className="bg-archaeology-surface border-archaeology-border text-archaeology-text placeholder:text-archaeology-textDim"
              />
              {!!checkCredits.data && (
                <div className='mt-4 bg-archaeology-surface border border-archaeology-border rounded-md p-4'>
                  <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-3">CREDIT COST PREVIEW</div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="font-mono text-[9px] tracking-widest text-archaeology-textDim mb-1">FILES FOUND</div>
                      <div className="font-display text-xl font-bold text-archaeology-text">{checkCredits.data.fileCount}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] tracking-widest text-archaeology-textDim mb-1">CREDITS</div>
                      <div className="font-display text-xl font-bold text-archaeology-orange">{checkCredits.data.fileCount}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] tracking-widest text-archaeology-textDim mb-1">BALANCE</div>
                      <div className="font-display text-xl font-bold text-archaeology-green">{checkCredits.data.userCredits}</div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-archaeology-card rounded-full overflow-hidden">
                    <div
                      className={cn('h-full', hasEnoughCredits ? 'bg-archaeology-orange' : 'bg-archaeology-red')}
                      style={{width: `${Math.min(100, (checkCredits.data.fileCount / Math.max(checkCredits.data.userCredits, 1)) * 100)}%`}}
                    />
                  </div>
                  <p className="text-xs text-archaeology-textDim mt-2">
                    {hasEnoughCredits
                      ? `${checkCredits.data.userCredits - checkCredits.data.fileCount} credits remaining after indexing`
                      : 'Not enough credits to index this repository'}
                  </p>
                </div>
              )}
              <div className='h-4'></div>
              <Button type = 'submit' disabled = {createProject.isPending || checkCredits.isPending || !hasEnoughCredits} className="bg-archaeology-orange hover:bg-archaeology-orangeLight text-white">
                {!!checkCredits.data? 'Create Project' : 'Check Credits'}
              </Button>

            </form>
          </div>
        </div>
    </div>
  )
}

export default CreatePage