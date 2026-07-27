'use client'

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronDown, Plus } from "lucide-react"
import Link from "next/link"
import React from "react"
import { cn } from "@/lib/utils"
import useProject from "@/hooks/use-project"

export function ProjectSelector() {
    const {projects, project, projectId, setProjectId} = useProject()
    const [open, setOpen] = React.useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center justify-between gap-2 w-full text-left px-3 py-2 rounded-md border border-archaeology-border bg-archaeology-card text-sm text-archaeology-text hover:bg-archaeology-cardHover">
                    <span className="truncate">{project ? project.name : 'Select Project'}</span>
                    <ChevronDown className="size-3.5 text-archaeology-textDim shrink-0" />
                </button>
            </DialogTrigger>
            <DialogContent className="bg-archaeology-card border-archaeology-border">
                <DialogHeader>
                    <DialogTitle className="text-archaeology-text">Select Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-1 max-h-80 overflow-y-auto">
                    {projects?.map(p => (
                        <button
                            key={p.id}
                            onClick={() => { setProjectId(p.id); setOpen(false) }}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-archaeology-cardHover',
                                p.id === projectId && 'bg-archaeology-orangeDim'
                            )}
                        >
                            <div className={cn(
                                'rounded-sm border border-archaeology-border size-7 flex items-center justify-center text-sm shrink-0 bg-archaeology-surface text-archaeology-text',
                                p.id === projectId && 'bg-archaeology-orange text-white border-archaeology-orange'
                            )}>
                                {p.name[0]?.toUpperCase()}
                            </div>
                            <span className={cn('text-sm truncate', p.id === projectId ? 'text-archaeology-orange font-medium' : 'text-archaeology-text')}>
                                {p.name}
                            </span>
                        </button>
                    ))}
                    {(!projects || projects.length === 0) && (
                        <p className="text-sm text-archaeology-textDim text-center py-4">No projects yet.</p>
                    )}
                </div>
                <Link href="/create" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full border-archaeology-border text-archaeology-text hover:bg-archaeology-cardHover">
                        <Plus className="size-4" /> New Project
                    </Button>
                </Link>
            </DialogContent>
        </Dialog>
    )
}
