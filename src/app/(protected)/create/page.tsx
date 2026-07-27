'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useRefetch from '@/hooks/use-refetch'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'

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
  const {setProjectId} = useProject()

  function onSubmit(data:FormInput) {

    if(!!checkCredits.data) {
        createProject.mutate({
          githubUrl: data.repoUrl,
          name: data.projectName,
          githubToken: data.githubToken
        }, {
          onSuccess: (newProject) => {
            toast.success('Project created successfully')
            setProjectId(newProject.id)
            refetch()
            reset()
          },
          onError: (error) => {
            toast.error(error.message || "Failed to create project")
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
                  <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-3">REPOSITORY PREVIEW</div>
                  <div className="font-mono text-[9px] tracking-widest text-archaeology-textDim mb-1">FILES FOUND</div>
                  <div className="font-display text-xl font-bold text-archaeology-text">{checkCredits.data.fileCount}</div>
                  <p className="text-xs text-archaeology-textDim mt-2">
                    Indexing is free - credits are only spent on questions you ask.
                  </p>
                </div>
              )}
              <div className='h-4'></div>
              <Button type = 'submit' disabled = {createProject.isPending || checkCredits.isPending} className="bg-archaeology-orange hover:bg-archaeology-orangeLight text-white">
                {!!checkCredits.data? 'Create Project' : 'Check Credits'}
              </Button>

            </form>
          </div>
        </div>
    </div>
  )
}

export default CreatePage