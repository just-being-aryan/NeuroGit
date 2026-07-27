import { NeuroGitIcon } from '@/components/neurogit-icon'
import { WhyDemoCard } from '@/components/why-demo-card'
import type { ReactNode } from 'react'

export function AuthShell({children}: {children: ReactNode}) {
  return (
    <div className="min-h-screen w-full flex bg-archaeology-bg p-6 gap-6">
      <div
        className="hidden md:flex md:w-1/2 relative flex-col items-center justify-center p-10 overflow-hidden rounded-3xl border border-archaeology-border"
        style={{
          background: 'linear-gradient(160deg, #1a0a00 0%, #080808 45%, #080808 55%, #3d1400 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{background: 'radial-gradient(circle at 30% 20%, rgba(247,85,0,0.35), transparent 55%)'}}
        />

        <div className="absolute top-6 left-6 flex items-center gap-2">
          <NeuroGitIcon size={32} />
          <span className="font-display font-extrabold text-lg tracking-wide text-white">NeuroGit</span>
        </div>

        <div className="relative w-full max-w-sm">
          <WhyDemoCard />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
