'use client'

import React, { useState } from 'react'
import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #F75500, #FF7A29)',
  'linear-gradient(135deg, #7C3AED, #A78BFA)',
  'linear-gradient(135deg, #0F766E, #2DD4BF)',
  'linear-gradient(135deg, #B45309, #FCD34D)',
  'linear-gradient(135deg, #BE185D, #F472B6)',
]

const TeamPage = () => {
  const {projectId} = useProject()
  const {data: members} = api.project.getTeamMembers.useQuery({projectId}, {enabled: !!projectId})
  const [copied, setCopied] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}/join/${projectId}` : ''

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const sendInvite = (e: React.FormEvent) => {
    e.preventDefault()
    toast.info('Email invites are coming soon — share the invite link instead for now.')
    setInviteEmail('')
  }

  return (
    <div className="p-8 bg-archaeology-bg min-h-full">
      <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-2">TEAM</div>
      <h1 className="font-display text-3xl font-extrabold text-archaeology-text mb-6">Team</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-archaeology-card border border-archaeology-border rounded-md overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_120px] gap-2 px-4 py-2 border-b border-archaeology-borderSubtle font-mono text-[10px] tracking-widest text-archaeology-textDim">
            <span>MEMBER</span><span>ROLE</span><span>JOINED</span>
          </div>
          {members?.map((member, i) => (
            <div key={member.id} className="grid grid-cols-[1fr_100px_120px] gap-2 px-4 py-3 border-b border-archaeology-borderSubtle last:border-0 items-center">
              <div className="flex items-center gap-3 min-w-0">
                {member.user.imageUrl ? (
                  <img src={member.user.imageUrl} alt={member.user.firstName ?? ''} className="rounded-full size-8 shrink-0" />
                ) : (
                  <div
                    className="rounded-full size-8 shrink-0 flex items-center justify-center text-white text-xs font-medium"
                    style={{background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]}}
                  >
                    {(member.user.firstName?.[0] ?? member.user.emailAddress[0])?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm text-archaeology-text truncate">{member.user.firstName} {member.user.lastName}</p>
                  <p className="text-xs text-archaeology-textDim truncate">{member.user.emailAddress}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-archaeology-orange">Member</span>
              <span className="text-xs text-archaeology-textSecondary">{member.createdAt.toLocaleDateString()}</span>
            </div>
          ))}
          {(!members || members.length === 0) && (
            <div className="p-6 text-sm text-archaeology-textDim text-center">No team members yet.</div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4">
            <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-2">INVITE LINK</div>
            <div className="flex items-center gap-2">
              <input readOnly value={inviteLink} className="bg-archaeology-surface border border-archaeology-border rounded px-2 py-1.5 text-xs text-archaeology-textSecondary flex-1 min-w-0" />
              <button onClick={copyLink} className="shrink-0 p-1.5 rounded border border-archaeology-border text-archaeology-text hover:bg-archaeology-cardHover">
                <Copy className="size-4" />
              </button>
            </div>
            {copied && <p className="text-xs text-archaeology-green mt-2">Copied!</p>}
            <p className="text-xs text-archaeology-textDim mt-2">Anyone with this link can request access to this project.</p>
          </div>

          <form onSubmit={sendInvite} className="bg-archaeology-card border border-archaeology-border rounded-md p-4">
            <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-2">INVITE BY EMAIL</div>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full bg-archaeology-surface border border-archaeology-border rounded px-2 py-1.5 text-xs text-archaeology-text placeholder:text-archaeology-textDim mb-2"
            />
            <button type="submit" className="w-full text-xs px-3 py-1.5 rounded-md border border-archaeology-border text-archaeology-text hover:bg-archaeology-cardHover">
              Send Invite →
            </button>
          </form>

          <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4">
            <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-2">ACCESS</div>
            <p className="text-xs text-archaeology-textSecondary">
              Every member on this project can browse commits, ask why questions, and view Decision Records. Per-role permissions aren&apos;t split out yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamPage
