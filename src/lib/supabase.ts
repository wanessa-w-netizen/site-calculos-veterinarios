import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variáveis do Supabase não configuradas. Funcionalidades de autenticação não estarão disponíveis.')
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Tipos para autenticação
export type AuthUser = {
  id: string
  email: string
  email_confirmed_at: string | null
  user_metadata: {
    full_name?: string
  }
}

// Funções de autenticação
export const authService = {
  // Verificar se Supabase está configurado
  isConfigured() {
    return supabase !== null
  },

  // Cadastro com verificação de email
  async signUp(email: string, password: string, fullName: string) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase não configurado' } }
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // Login
  async signIn(email: string, password: string) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase não configurado' } }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Logout
  async signOut() {
    if (!supabase) {
      return { error: { message: 'Supabase não configurado' } }
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Reenviar email de verificação
  async resendVerification(email: string) {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase não configurado' } }
    }
    
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  // Obter usuário atual
  async getCurrentUser() {
    if (!supabase) {
      return { user: null, error: { message: 'Supabase não configurado' } }
    }
    
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Verificar se email foi confirmado
  isEmailConfirmed(user: AuthUser | null) {
    return user?.email_confirmed_at !== null
  }
}