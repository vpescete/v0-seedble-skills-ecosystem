"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn, isLoading: authLoading, user, session } = useAuth()
  const router = useRouter()
  const hasRedirected = useRef(false)

  // Log auth state changes
  useEffect(() => {
    console.log("SignInForm - Auth state:", {
      isLoading: authLoading,
      hasUser: !!user,
      hasSession: !!session,
      userId: user?.id
    })
  }, [authLoading, user, session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading || authLoading) return

    setIsLoading(true)
    setError(null)

    try {
      console.log("Attempting sign in...")
      const { error } = await signIn(email, password)

      if (error) {
        console.error("Sign in error:", error)
        setError(error.message)
        setIsLoading(false)
        return
      }

      console.log("Sign in successful, redirecting...")
      // Use router.push instead of window.location for smoother navigation
      router.push("/")
    } catch (err) {
      console.error("Unexpected error during sign in:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  // If we have a session, redirect to home
  useEffect(() => {
    if (session && !hasRedirected.current) {
      console.log("Session detected, redirecting to home...")
      hasRedirected.current = true
      router.push("/")
    }
  }, [session, router])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || authLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading || authLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" className="w-full" disabled={isLoading || authLoading}>
            {(isLoading || authLoading) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <Button 
            variant="link" 
            type="button" 
            onClick={() => router.push("/auth/sign-up")} 
            className="w-full"
            disabled={isLoading || authLoading}
          >
            Don't have an account? Sign up
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
