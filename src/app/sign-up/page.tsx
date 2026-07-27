'use client'

import { useSignUp, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { AuthShell } from '@/components/auth-shell'
import { GoogleButton } from '@/components/google-button'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SignUpPage() {
  const {isLoaded, signUp, setActive} = useSignUp()
  const {isSignedIn, isLoaded: authLoaded} = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authLoaded && isSignedIn && !pendingVerification) {
      router.replace('/dashboard')
    }
  }, [authLoaded, isSignedIn, pendingVerification, router])

  const handleGoogle = () => {
    if (!isLoaded || isSignedIn) return
    void signUp.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sign-up/sso-callback',
      redirectUrlComplete: '/sync-user',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || isSignedIn) return
    setError('')
    setLoading(true)
    try {
      await signUp.create({emailAddress: email, password})
      await signUp.prepareEmailAddressVerification({strategy: 'email_code'})
      setPendingVerification(true)
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? 'Failed to sign up. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setError('')
    setLoading(true)
    try {
      const result = await signUp.attemptEmailAddressVerification({code})
      if (result.status === 'complete') {
        await setActive({session: result.createdSessionId})
        router.push('/sync-user')
      } else {
        setError('Verification incomplete. Please check the code and try again.')
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? 'Invalid verification code.')
    } finally {
      setLoading(false)
    }
  }

  if (!authLoaded || (isSignedIn && !pendingVerification)) {
    return null
  }

  if (pendingVerification) {
    return (
      <AuthShell>
        <h1 className="font-display text-2xl font-bold text-archaeology-text mb-1">Verify your email</h1>
        <p className="text-sm text-archaeology-textSecondary mb-6">We sent a code to {email}</p>
        <form onSubmit={handleVerify} className="space-y-3">
          <Input
            required
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Enter verification code"
            className="bg-archaeology-surface border-archaeology-border text-archaeology-text placeholder:text-archaeology-textDim"
          />
          {error && <p className="text-xs text-archaeology-red">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-archaeology-orange hover:bg-archaeology-orangeLight text-white">
            {loading ? 'Verifying…' : 'Verify'}
          </Button>
        </form>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-bold text-archaeology-text mb-1">Create Account</h1>
      <p className="text-sm text-archaeology-textSecondary mb-6">Start reconstructing why your code exists.</p>

      <GoogleButton onClick={handleGoogle} disabled={!isLoaded} />

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-archaeology-border" />
        <span className="text-xs text-archaeology-textDim">Or</span>
        <div className="flex-1 h-px bg-archaeology-border" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-archaeology-textSecondary">Email</label>
          <Input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="bg-archaeology-surface border-archaeology-border text-archaeology-text placeholder:text-archaeology-textDim mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-archaeology-textSecondary">Password</label>
          <Input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Create a password"
            className="bg-archaeology-surface border-archaeology-border text-archaeology-text placeholder:text-archaeology-textDim mt-1"
          />
        </div>

        {error && <p className="text-xs text-archaeology-red">{error}</p>}

        <Button type="submit" disabled={!isLoaded || loading} className="w-full bg-archaeology-orange hover:bg-archaeology-orangeLight text-white">
          {loading ? 'Creating account…' : 'Sign up'}
        </Button>
      </form>

      <p className="text-center text-sm text-archaeology-textSecondary mt-6">
        Already have an account? <Link href="/sign-in" className="text-archaeology-orange hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  )
}
