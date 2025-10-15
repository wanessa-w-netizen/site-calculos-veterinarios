"use client";

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, authService, type AuthUser } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  resendVerification: (email: string) => Promise<any>
  isEmailConfirmed: boolean
  isSupabaseConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se Supabase está configurado
    if (!authService.isConfigured()) {
      setLoading(false)
      return
    }

    // Verificar usuário atual
    const getUser = async () => {
      const { user } = await authService.getCurrentUser()
      setUser(user as AuthUser)
      setLoading(false)
    }

    getUser()

    // Escutar mudanças de autenticação apenas se Supabase estiver configurado
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user as AuthUser)
          } else {
            setUser(null)
          }
          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, fullName: string) => {
    const result = await authService.signUp(email, password, fullName)
    return result
  }

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password)
    return result
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
  }

  const resendVerification = async (email: string) => {
    const result = await authService.resendVerification(email)
    return result
  }

  const isEmailConfirmed = authService.isEmailConfirmed(user)
  const isSupabaseConfigured = authService.isConfigured()

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resendVerification,
    isEmailConfirmed,
    isSupabaseConfigured
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}