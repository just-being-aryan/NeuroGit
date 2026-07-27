import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

export default function SignInSSOCallback() {
  return <AuthenticateWithRedirectCallback signUpForceRedirectUrl="/sync-user" signInForceRedirectUrl="/dashboard" />
}
