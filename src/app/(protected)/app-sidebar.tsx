'use client'

import { Sidebar, SidebarHeader, SidebarContent, SidebarGroupLabel, SidebarGroup, SidebarGroupContent, SidebarMenuItem, SidebarMenuButton , SidebarMenu} from "@/components/ui/sidebar"
import { LayoutDashboard, HelpCircle, FileStack, History, GitCommitHorizontal, Presentation, Plus, Users, CreditCard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { NeuroGitIcon } from "@/components/neurogit-icon"
import { useSidebar } from "@/components/ui/sidebar"
import useProject from "@/hooks/use-project"
import { UserButton } from "@clerk/nextjs"
import { api } from "@/trpc/react"

const navGroups = [
    {
        label: "OVERVIEW",
        items: [
            { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
            { title: "Ask Why", url: "/ask-why", icon: HelpCircle },
            { title: "Decision Records", url: "/decisions", icon: FileStack },
            { title: "Q&A History", url: "/qa", icon: History },
        ],
    },
    {
        label: "CODE",
        items: [
            { title: "Commits", url: "/commits", icon: GitCommitHorizontal },
            { title: "Meetings", url: "/meetings", icon: Presentation },
        ],
    },
    {
        label: "PROJECT",
        items: [
            { title: "Team", url: "/team", icon: Users },
            { title: "Billing", url: "/billing", icon: CreditCard },
        ],
    },
]

export function AppSidebar()
{
    const pathname = usePathname()
    const {open} = useSidebar()
    const {projects, projectId, setProjectId} = useProject()
    const {data: creditsData} = api.project.getMyCredits.useQuery()

    return(
        <Sidebar collapsible = "icon" className="inset-y-3 left-3 h-[calc(100vh-1.5rem)] rounded-l-2xl overflow-hidden border-y border-l border-sidebar-border">
            <SidebarHeader>

            </SidebarHeader>
                <div className = "flex items-center gap-2 h-14 shrink-0 px-4 border-b border-sidebar-border">
                        <NeuroGitIcon size={36} />
                        {open && (
                            <span className="font-display font-extrabold text-lg tracking-wide text-archaeology-text leading-none">
                                NeuroGit
                            </span>
                        )}
                </div>
            <SidebarContent className="sidebar-scroll">
                {navGroups.map((group) => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel className="font-mono text-[9px] tracking-widest text-archaeology-textDim">
                            {group.label}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                            {group.items.map(item => {
                                const active = pathname === item.url
                                return (
                                    <SidebarMenuItem key = {item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href = {item.url} className = {cn(
                                                'list-none text-archaeology-textSecondary',
                                                active && '!bg-archaeology-orangeDim !text-archaeology-orange border-l-2 border-archaeology-orange'
                                            )}>
                                                <item.icon className={cn(active && 'text-archaeology-orange')} />
                                                <span>{item.title}</span>
                                            </Link>

                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                            </SidebarMenu>

                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
                <SidebarGroup>
                    <SidebarGroupLabel className="font-mono text-[9px] tracking-widest text-archaeology-textDim">
                        YOUR PROJECTS
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                       <SidebarMenu>
                        {projects?.map(project => {
                            return (
                                <SidebarMenuItem key = {project.id}>
                                    <SidebarMenuButton asChild>
                                            <div onClick = {()=>{
                                                setProjectId(project.id)
                                            }} className="text-archaeology-textSecondary">
                                                <div className = {cn(
                                                    'rounded-sm border border-archaeology-border size-6 flex items-center justify-center text-sm bg-archaeology-card text-archaeology-text',
                                                    {
                                                        'bg-archaeology-orange text-white border-archaeology-orange' : project.id === projectId
                                                    }
                                                )}>
                                                    {project.name[0]}

                                                </div>
                                                <span>{project.name}</span>
                                            </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                        <div className = "h-2"></div>
                        {open &&(
                            <SidebarMenuItem>
                            <Link href = '/create'>
                                     <Button size = 'sm' variant = {'outline'} className = "w-fit border-archaeology-border text-archaeology-text hover:bg-archaeology-cardHover">

                                     <Plus/>
                                     New Project
                                     </Button>
                            </Link>

                         </SidebarMenuItem>
                        )}


                       </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            {open && (
                <div className="border-t border-archaeology-borderSubtle p-3 flex items-center gap-2">
                    <UserButton />
                    <div className="flex flex-col min-w-0">
                        <span className="font-mono text-[10px] text-archaeology-textDim">
                            {creditsData?.credits ?? 0} credits
                        </span>
                    </div>
                </div>
            )}
        </Sidebar>
    )
}
