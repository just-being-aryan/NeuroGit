'use client'
import { Slider } from '@/components/ui/slider'
import { createCheckoutSession } from '@/lib/stripe'
import { api } from '@/trpc/react'
import { Info, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

const TOP_UP_PRESETS = [100, 250, 500, 1000]

const BillingPage = () => {
    const {data:user} = api.project.getMyCredits.useQuery()
    const {data: transactions} = api.project.getTransactions.useQuery()
    const [creditsToBuy, setCreditsToBuy] = React.useState<number[]>([100])
    const creditsToBuyAmount = creditsToBuy[0]!
    const price = (creditsToBuyAmount/50).toFixed(2)

  return (
    <div className='p-8 bg-archaeology-bg min-h-full'>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-2">BILLING</div>
            <h1 className='font-display text-3xl font-extrabold text-archaeology-text'>Credits & Billing</h1>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-archaeology-border text-archaeology-text hover:bg-archaeology-cardHover"
          >
            <Plus className="size-3.5" /> Create Project
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4">
              <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-1">CURRENT BALANCE</div>
              <div className="font-display text-3xl font-bold text-archaeology-text">{user?.credits ?? 0} <span className="text-base font-sans text-archaeology-textSecondary">credits</span></div>
            </div>

            <div className="bg-archaeology-orangeDim px-4 py-3 rounded-md border border-archaeology-orange text-archaeology-orangeLight">
              <div className='flex items-center gap-2'>
                  <Info className='size-4'/>
                  <p className='text-sm'>Each credit lets you ask NeuroGit one question.</p>
              </div>
              <p className='text-sm'>Repository indexing is free, no matter how large the repo is.</p>
            </div>

            <div className="bg-archaeology-card border border-archaeology-border rounded-md overflow-hidden">
              <div className="px-4 py-3 border-b border-archaeology-borderSubtle font-mono text-[10px] tracking-widest text-archaeology-textDim">
                TRANSACTION HISTORY
              </div>
              {transactions?.map(tx => (
                <div key={tx.id} className="flex items-center justify-between px-4 py-3 border-b border-archaeology-borderSubtle last:border-0">
                  <div>
                    <p className="text-sm text-archaeology-text">Credit top-up</p>
                    <p className="text-xs text-archaeology-textDim font-mono">{tx.createdAt.toLocaleDateString()}</p>
                  </div>
                  <span className="font-mono text-sm text-archaeology-green">+{tx.credits}</span>
                </div>
              ))}
              {(!transactions || transactions.length === 0) && (
                <div className="p-6 text-sm text-archaeology-textDim text-center">No transactions yet.</div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4 h-fit">
              <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-3">TOP UP CREDITS</div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {TOP_UP_PRESETS.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setCreditsToBuy([amount])}
                    className={cn(
                      'rounded-md border py-2 text-xs font-mono',
                      creditsToBuyAmount === amount
                        ? 'bg-archaeology-orangeDim border-archaeology-orange text-archaeology-orange'
                        : 'border-archaeology-border text-archaeology-textSecondary hover:bg-archaeology-cardHover'
                    )}
                  >
                    {amount}
                  </button>
                ))}
              </div>
              <Slider defaultValue={[100]} max = {1000} min = {10} step = {10} onValueChange={value => setCreditsToBuy(value)} value = {creditsToBuy}/>
              <div className='h-4'></div>
              <button
                onClick={() => createCheckoutSession(creditsToBuyAmount)}
                className="w-full bg-archaeology-orange hover:bg-archaeology-orangeLight text-white rounded-md py-2 text-sm font-medium"
              >
                Buy {creditsToBuyAmount} credits for ${price}
              </button>
            </div>

            <div className="bg-archaeology-card border border-archaeology-border rounded-md p-4">
              <div className="font-mono text-[10px] tracking-widest text-archaeology-textDim mb-2">CREDIT COSTS</div>
              <p className="text-xs text-archaeology-textSecondary">Asking a question (Ask Why or code Q&amp;A): 1 credit.</p>
              <p className="text-xs text-archaeology-textDim mt-1">Repository indexing, meeting transcription, and Decision Records are free.</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default BillingPage
