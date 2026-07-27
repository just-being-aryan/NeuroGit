import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '../(protected)/app-sidebar'

export default function ShellPreview() {
  return (
    <SidebarProvider className="bg-archaeology-bg">
      <AppSidebar/>
      <main className="relative w-full flex flex-col ml-3 my-3 mr-3 h-[calc(100vh-1.5rem)] rounded-r-2xl overflow-hidden border-y border-r border-sidebar-border bg-archaeology-bg">
        <div className="absolute top-14 left-0 w-4 h-4 pointer-events-none z-10 bg-archaeology-bg">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M 16 0 A 16 16 0 0 1 0 16" fill="none" stroke="hsl(var(--sidebar-border))" strokeWidth="1" />
          </svg>
        </div>
        <div className="flex items-center gap-2 h-14 shrink-0 px-4 bg-sidebar border-b border-sidebar-border">
          <div className="ml-auto text-archaeology-textDim text-sm">User</div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 text-archaeology-text">
          Preview content area
        </div>
      </main>
    </SidebarProvider>
  )
}
