'use client'
import useProject from '@/hooks/use-project'
import React from 'react'
import { api } from '@/trpc/react'
import MeetingCard from '../dashboard/meeting-card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import useRefetch from '@/hooks/use-refetch'

const MeetingsPage = () => {

    const {projectId} = useProject()
    const {data: meetings, isLoading} = api.project.getMeetings.useQuery({projectId},{
        refetchInterval: (query) => query.state.data?.some(m => m.status === 'PROCESSING') ? 4000 : false
    })

    const deleteMeeting = api.project.deleteMeeting.useMutation()
    const refetch = useRefetch()

    return (
    <div className="p-8 bg-archaeology-bg min-h-full">
        <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-2">MEETINGS</div>
        <h1 className="font-display text-3xl font-extrabold text-archaeology-text mb-6">Meetings</h1>

        <MeetingCard/>
        <div className="h-6"></div>

        {meetings && meetings.length === 0 && <div className="text-sm text-archaeology-textDim">No meetings found.</div>}
        {isLoading && <div className="text-sm text-archaeology-textDim">Loading...</div>}

        <div className="bg-archaeology-card border border-archaeology-border rounded-md divide-y divide-archaeology-borderSubtle">
            {meetings?.map(meeting => (
                <div key = {meeting.id} className='flex items-center justify-between p-4 gap-x-6'>
                    <div>
                        <div className='min-w-0'>
                            <div className='flex items-center gap-2'>
                                <Link href = {`/meetings/${meeting.id}`} className='text-sm font-semibold text-archaeology-text hover:text-archaeology-orange'>
                                        {meeting.name}
                                </Link>
                                {meeting.status === 'PROCESSING' && (
                                    <span className='text-[10px] font-mono px-1.5 py-0.5 rounded bg-archaeology-yellowDim text-archaeology-yellow'>
                                        PROCESSING...
                                    </span>
                                ) }
                            </div>
                        </div>
                        <div className='flex items-center text-xs text-archaeology-textSecondary gap-x-2 mt-1'>
                               <p className='whitespace-nowrap'>
                                    {meeting.createdAt.toLocaleDateString()}
                               </p>

                               <p className='truncate'>
                                {meeting.issues.length} chapters
                               </p>
                        </div>
                    </div>
                    <div className='flex items-center flex-none gap-x-3'>
                            <Link href= {`/meetings/${meeting.id}`}>
                                <Button size='sm' variant="outline" className="border-archaeology-border text-archaeology-text hover:bg-archaeology-cardHover">
                                    View Meeting
                                </Button>
                            </Link>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button disabled={deleteMeeting.isPending} size='sm' variant='destructive'>
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-archaeology-card border-archaeology-border">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-archaeology-text">Delete this meeting?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-archaeology-textSecondary">
                                            This will permanently delete &quot;{meeting.name}&quot; and all its chapters and commit links. This cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-archaeology-surface border-archaeology-border text-archaeology-text hover:bg-archaeology-cardHover">
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => deleteMeeting.mutate({meetingId: meeting.id}, {
                                                onSuccess: () => {
                                                    toast.success('Meeting deleted successfully')
                                                    refetch()
                                                }
                                            })}
                                            className="bg-destructive text-white hover:bg-destructive/90"
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default MeetingsPage
