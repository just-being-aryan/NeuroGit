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
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const DeleteProjectButton = () => {
    const deleteProject = api.project.deleteProject.useMutation()
    const {projectId, setProjectId} = useProject()
    const refetch = useRefetch()
    const router = useRouter()

    const handleDelete = () => {
        deleteProject.mutate({projectId}, {
            onSuccess: () => {
                toast.success("Project deleted")
                setProjectId('')
                refetch()
                router.push('/dashboard')
            },
            onError: () => {
                toast.error("Failed to delete project")
            }
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button disabled={deleteProject.isPending} size='sm' variant='destructive'>
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-archaeology-card border-archaeology-border">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-archaeology-text">Permanently delete this project?</AlertDialogTitle>
                    <AlertDialogDescription className="text-archaeology-textSecondary">
                        This will permanently delete all commits, meetings, decision records, and saved questions for this
                        project. This cannot be undone - use Archive instead if you just want to hide it.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-archaeology-surface border-archaeology-border text-archaeology-text hover:bg-archaeology-cardHover">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
                        Delete Permanently
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteProjectButton
