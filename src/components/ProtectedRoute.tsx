"use client";

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireEmailVerification?: boolean
}

export default function ProtectedRoute({ 
  children, 
  requireEmailVerification = false 
}: ProtectedRouteProps) {
  const { user, loading, isEmailConfirmed } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Usuário não autenticado - redirecionar para página inicial
        router.push('/')
        return
      }

      if (requireEmailVerification && !isEmailConfirmed) {
        // Email não verificado e verificação é obrigatória
        router.push('/')
        return
      }
    }
  }, [user, loading, isEmailConfirmed, requireEmailVerification, router])

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Se não há usuário, não renderizar nada (redirecionamento em andamento)
  if (!user) {
    return null
  }

  // Se requer verificação de email e não está verificado
  if (requireEmailVerification && !isEmailConfirmed) {
    return null
  }

  // Usuário autenticado e verificado (se necessário)
  return <>{children}</>
}