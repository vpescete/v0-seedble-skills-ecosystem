"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase"
import { getUserProfile } from "@/lib/data-service"
import type { User as ProfileUser } from "@/lib/types"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{
    data?: { user: User; session: Session }
    error: Error | null
  }>
  signUp: (email: string, password: string, fullName: string) => Promise<{
    error: Error | null
  }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...")
        const { data: { session: initialSession }, error } = await getSupabaseClient().auth.getSession()
        
        if (error) {
          console.error("Error getting initial session:", error)
          if (mounted.current) {
            setIsLoading(false)
          }
          return
        }

        console.log("Initial session state:", {
          hasSession: !!initialSession,
          hasUser: !!initialSession?.user,
          sessionId: initialSession?.user?.id
        })

        if (mounted.current) {
          setSession(initialSession)
          setUser(initialSession?.user ?? null)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Unexpected error during auth initialization:", error)
        if (mounted.current) {
          setIsLoading(false)
        }
      }
    }

    initializeAuth()

    const { data: { subscription } } = getSupabaseClient().auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", { 
          event, 
          hasSession: !!newSession,
          userId: newSession?.user?.id
        })
        
        if (mounted.current) {
          setSession(newSession)
          setUser(newSession?.user ?? null)
          setIsLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const { data, error } = await getSupabaseClient().auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
        return { error }
      }

      console.log("Sign in successful:", {
        hasSession: !!data.session,
        hasUser: !!data.user,
        userId: data.user?.id
      })

      return { data, error: null }
    } catch (error) {
      console.error("Unexpected error during sign in:", error)
      return { error: new Error("An unexpected error occurred") }
    } finally {
      if (mounted.current) {
        setIsLoading(false)
      }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await getSupabaseClient().auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      return { error }
    } catch (error) {
      console.error("Unexpected error during sign up:", error)
      return { error: new Error("An unexpected error occurred") }
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await getSupabaseClient().auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      if (mounted.current) {
        setIsLoading(false)
      }
    }
  }

  // Log state changes for debugging
  useEffect(() => {
    console.log("Auth state updated:", {
      isLoading,
      hasUser: !!user,
      hasSession: !!session,
      userId: user?.id
    })
  }, [isLoading, user, session])

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
