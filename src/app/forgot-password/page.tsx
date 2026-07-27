'use client'

import { useSignIn, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { AuthShell } from '@/components/auth-shell'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ForgotPasswordPage() {
  const {isLoaded, signIn, setActive} = useSignIn()
  const {isSignedIn, isLoaded: authLoaded} = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'request' | 'reset'>('request')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      router.replace('/dashboard')
    }
  }, [authLoaded, isSignedIn, router])

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || isSignedIn) return
    setError('')
    setLoading(true)
    try {
      await signIn.create({strategy: 'reset_password_email_code', identifier: email})
      setStep('reset')
    } catch (err: any) {
      const code: string | undefined = err?.errors?.[0]?.code
      const message: string = err?.errors?.[0]?.message ?? ''
      if (code === 'form_identifier_not_found') {
        setError('No account found with that email.')
      } else if (code === 'strategy_for_user_invalid' || /oauth|external|social|google/i.test(message)) {
        setError('This account uses Google Sign-In — please continue with Google on the sign-in page instead.')
      } else {
        setError(message || 'Could not send a reset code for this account.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || isSignedIn) return
    setError('')
    setLoading(true)
    try {
      const result = await signIn.attemptFirstFactor({strategy: 'reset_password_email_code', code, password})
      if (result.status === 'complete') {
        await setActive({session: result.createdSessionId})
        router.push('/dashboard')
      } else {
        setError('Reset incomplete. Please check the code and try again.')
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? 'Invalid code or password.')
    } finally {
      setLoading(false)
    }
  }

  if (!authLoaded || isSignedIn) {
    return null
  }

  if (step === 'reset') {
    return (
      <AuthShell>
        <h1 className="font-display text-2xl font-bold text-archaeology-text mb-1">Reset Password</h1>
        <p className="text-sm text-archaeology-textSecondary mb-6">Enter the code we sent to {email} and choose a new password.</p>
        <form onSubmit={handleReset} className="space-y-3">
          <Input
            required
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Verification code"
            className="bg-archaeology-surface border-archaeology-border text-archaeology-text placeholder:text-archaeology-textDim"
          />
          <Input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="New password"
            className="bg-archaeology-surface border-archaeology-border text-archaeology-text placeholder:text-archaeology-textDim"
          />
          {error && <p className="text-xs text-archaeology-red">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-archaeology-orange hover:bg-archaeology-orangeLight text-white">
            {loading ? 'Resetting…' : 'Reset Password'}
          </Button>
        </form>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-bold text-archaeology-text mb-1">Forgot Password</h1>
      <p className="text-sm text-archaeology-textSecondary mb-6">Enter your email and we&apos;ll send you a reset code.</p>
      <form onSubmit={handleRequest} className="space-y-3">
        <Input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="bg-archaeology-surface border-archaeology-border text-archaeology-text placeholder:text-archaeology-textDim"
        />
        {error && <p className="text-xs text-archaeology-red">{error}</p>}
        <Button type="submit" disabled={!isLoaded || loading} className="w-full bg-archaeology-orange hover:bg-archaeology-orangeLight text-white">
          {loading ? 'Sending…' : 'Send reset code'}
        </Button>
      </form>
      <p className="text-center text-sm text-archaeology-textSecondary mt-6">
        <Link href="/sign-in" className="text-archaeology-orange hover:underline">Back to sign in</Link>
      </p>
    </AuthShell>
  )
}
