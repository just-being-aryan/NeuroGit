import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { UserButton } from '@clerk/nextjs'
import { AppSidebar } from './app-sidebar'

type Props = {
    children : React.ReactNode
}

const SidebarLayout = ({children}: Props) => {
  return (
    <SidebarProvider className="bg-archaeology-bg">
        <AppSidebar/>
        <main className = "relative w-full flex flex-col ml-3 my-3 mr-3 h-[calc(100vh-1.5rem)] rounded-r-2xl overflow-hidden border-y border-r border-sidebar-border bg-archaeology-bg">
            {/* concave corner: a single stroked SVG arc joining the sidebar's vertical border to the topbar's horizontal border */}
            <div className="absolute top-14 left-0 w-4 h-4 pointer-events-none z-10 bg-archaeology-bg">
                <svg width="16" height="16" viewBox="0 0 16 16">
                    <path d="M 16 0 A 16 16 0 0 1 0 16" fill="none" stroke="hsl(var(--sidebar-border))" strokeWidth="1" />
                </svg>
            </div>
            <div className = "flex items-center gap-2 h-14 shrink-0 px-4 bg-sidebar border-b border-sidebar-border">
                <div className = "ml-auto">
                    <UserButton/>
                </div>
            </div>
            {/* main Content */}
            <div className = "flex-1 overflow-y-auto">
                {children}
            </div>
        </main>

    </SidebarProvider>
  )
}

export default SidebarLayout
