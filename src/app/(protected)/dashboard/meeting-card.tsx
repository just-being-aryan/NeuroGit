'use client'
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';
import { Card } from '@/components/ui/card'
import {useDropzone} from 'react-dropzone'
import React from 'react'
import { uploadFile } from '@/lib/firebase'
import { Presentation, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MeetingCard = () => {

    const [isUploading,setIsUploading] = React.useState(false)
    const [progress,setProgress] = React.useState(0)
    const {getRootProps,getInputProps} = useDropzone({
        accept:{
            'audio/*': ['.mp3','.wav','.m4a']
        },
        multiple:false,
        maxSize:50_000_000,
        onDrop: async acceptedFiles => {
            setIsUploading(true)
            console.log(acceptedFiles)
            const file = acceptedFiles[0]
            const downloadURL = await uploadFile(file as File,setProgress)
            window.alert(downloadURL)
            setIsUploading(false)
        }
    })

  return (
    <Card className='col-span-2 flex flex-col items-center justify-between p-10' {...getRootProps()}>
            {!isUploading && (
                <>
                    <Presentation className='h-10 w-10 animate-bounce'/>
                    <h3 className='mt-2 text-sm font-semibold text-gray-900'>
                        Create a New Meeting
                    </h3>
                    <p className='mt-1 text-center text-sm text-gray-500'>
                        Analyze your meeting with NeuroGit.
                        <br />
                        Powered by AI.
                    </p>
                    <div className="mt-6">
                        <Button disabled = {isUploading}>
                            <Upload className='-m1-0.5 mr-1.5 h-5 w-5' aria-hidden= "true"/>
                            Upload Meeting
                            <input className = 'hidden' {...getInputProps()} />
                        </Button>
                    </div>
                </>
            )}
            {isUploading && (
                <div className='flex justify-center'>
                    <CircularProgressbar value = {progress} text = {`${progress}%`} className='size-20' styles = {
                        buildStyles({
                            pathColor : '#FBA518',
                            textColor : '#FBA518'
                        })
                    }/>
                    <p className='text-sm text-gray-500 text-center'>Uploading your meeting...</p>
                </div>

            )}
    </Card>
  )
}

export default MeetingCard