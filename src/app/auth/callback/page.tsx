"use client";

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (!supabase) {
          console.error('Supabase não configurado')
          router.push('/?error=supabase_not_configured')
          return
        }
        
        const { data, error } = await supabase!.auth.getSession()
        
        if (error) {
          console.error('Erro na verificação:', error)
          router.push('/?error=verification_failed')
          return
        }

        if (data.session) {
          // Email verificado com sucesso
          router.push('/calculator?verified=true')
        } else {
          // Sem sessão válida
          router.push('/?error=no_session')
        }
      } catch (err) {
        console.error('Erro inesperado:', err)
        router.push('/?error=unexpected')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Verificando sua conta...
        </h2>
        <p className="text-gray-600">
          Aguarde enquanto confirmamos seu email.
        </p>
      </div>
    </div>
  )
}