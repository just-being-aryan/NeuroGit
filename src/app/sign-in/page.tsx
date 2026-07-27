'use client'

import { useSignIn, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { AuthShell } from '@/components/auth-shell'
import { GoogleButton } from '@/components/google-button'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SignInPage() {
  const {isLoaded, signIn, setActive} = useSignIn()
  const {isSignedIn, isLoaded: authLoaded} = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      router.replace('/dashboard')
    }
  }, [authLoaded, isSignedIn, router])

  const handleGoogle = () => {
    if (!isLoaded || isSignedIn) return
    void signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sign-in/sso-callback',
      redirectUrlComplete: '/dashboard',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || isSignedIn) return
    setError('')
    setLoading(true)
    try {
      const result = await signIn.create({identifier: email, password})
      if (result.status === 'complete') {
        await setActive({session: result.createdSessionId})
        router.push('/dashboard')
      } else {
        setError('Additional verification required. Please try again.')
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? 'Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  if (!authLoaded || isSignedIn) {
    return null
  }

  return (
    <AuthShell>
      <h1 className="font-display text-2xl font-bold text-archaeology-text mb-1">Sign In Account</h1>
      <p className="text-sm text-archaeology-textSecondary mb-6">Stay connected with your engineering knowledge base.</p>

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
            placeholder="Enter your password"
            className="bg-archaeology-surface border-archaeology-border text-archaeology-text placeholder:text-archaeology-textDim mt-1"
          />
          <div className="text-right mt-1">
            <Link href="/forgot-password" className="text-xs text-archaeology-orange hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>

        {error && <p className="text-xs text-archaeology-red">{error}</p>}

        <Button type="submit" disabled={!isLoaded || loading} className="w-full bg-archaeology-orange hover:bg-archaeology-orangeLight text-white">
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center text-sm text-archaeology-textSecondary mt-6">
        Not on NeuroGit yet? <Link href="/sign-up" className="text-archaeology-orange hover:underline">Join now</Link>
      </p>
    </AuthShell>
  )
}
