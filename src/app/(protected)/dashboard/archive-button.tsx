'use client'
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
import useProject from '@/hooks/use-project'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import React from 'react'
import { toast } from 'sonner'

const ArchiveButton = () => {
    const archiveProject = api.project.archiveProject.useMutation()
    const {projectId} = useProject()
    const refetch = useRefetch()

    const handleArchive = () => {
        archiveProject.mutate({projectId}, {
            onSuccess: () => {
                toast.success("Project archived")
                refetch() //for updating the sidebar
            },
            onError: () => {
                toast.error("Failed to archive project")
            }
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button disabled={archiveProject.isPending} size='sm' variant='destructive'>
                    Archive
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-archaeology-card border-archaeology-border">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-archaeology-text">Archive this project?</AlertDialogTitle>
                    <AlertDialogDescription className="text-archaeology-textSecondary">
                        This project will be hidden from your dashboard. This can be reversed later, but you won&apos;t
                        be able to access it until then.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-archaeology-surface border-archaeology-border text-archaeology-text hover:bg-archaeology-cardHover">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleArchive} className="bg-destructive text-white hover:bg-destructive/90">
                        Archive
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ArchiveButton
