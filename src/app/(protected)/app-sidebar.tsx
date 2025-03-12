'use client'

import { Sidebar, SidebarHeader, SidebarContent, SidebarGroupLabel, SidebarGroup, SidebarGroupContent, SidebarMenuItem, SidebarMenuButton , SidebarMenu} from "@/components/ui/sidebar"
import { Bot, CreditCard, Plus, Presentation } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useSidebar } from "@/components/ui/sidebar"
import useProject from "@/hooks/use-project"

const items = [
    {   
        title : "Dashboard",
        url : "/dashboard",
        icon : "LayoutDashboard",    
    },
    {
        title : "Q&A",
        url : "/qa",
        icon : Bot,

    },
    {   
        title : "Meetings",
        url : "/meetings",
        icon : Presentation,    
    },
    {   
        title : "Billing",
        url : "/billing",
        icon : CreditCard,    
    }

    
]


export function AppSidebar()
{
    const pathname = usePathname()
    const {open} = useSidebar()
    const {projects, projectId, setProjectId} = useProject()
    return(
        <Sidebar collapsible = "icon" variant = "floating">
            <SidebarHeader>
                
            </SidebarHeader>
                <div className = "flex items-center gap-2">
                        <Image src = '/logo.png' alt = 'logo' width = {300} height = {140}/>
                        {/* {open && (
                            <h1 className = "text-xl font-bold text-primary/80">
                                NeuroGit
                            </h1>
                        )} */}
                </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                        {items.map(item => {
                            return (
                                <SidebarMenuItem key = {item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href = {item.url} className = {cn({
                                            '!bg-primary !text-white':pathname === item.url
                                        }, 'list-none')}>
                                            <item.icon/>
                                            <span>{item.title}</span>
                                        </Link>
                                        
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                        </SidebarMenu>
                        
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Your Projects 
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                       <SidebarMenu>
                        {projects?.map(project => {
                            return (
                                <SidebarMenuItem key = {project.id}> 
                                    <SidebarMenuButton asChild>
                                            <div onClick = {()=>{
                                                setProjectId(project.id)
                                            }}>
                                                <div className = {cn(
                                                    'rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary',
                                                    {
                                                        'bg-primary text-white' : project.id === projectId
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
                                     <Button size = 'sm' variant = {'outline'} className = "w-fit">
                                             
                                     <Plus/>
                                     Create Project
                                     </Button>
                            </Link>
                             
                         </SidebarMenuItem>
                        )}
                        
                        
                       </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}