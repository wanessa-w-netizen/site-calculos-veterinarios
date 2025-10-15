"use client";

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { LogOut, User, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function AuthNavigation() {
  const { user, signOut, isEmailConfirmed } = useAuth()

  if (!user) return null

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-800">
              {user.user_metadata?.full_name || user.email}
            </span>
          </div>
          
          {/* Status de verificação do email */}
          <div className="flex items-center gap-1">
            {isEmailConfirmed ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs">Verificado</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">Email não verificado</span>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={signOut}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>

      {/* Alerta para email não verificado */}
      {!isEmailConfirmed && (
        <div className="max-w-6xl mx-auto mt-3">
          <Alert className="border-orange-200 bg-orange-50">
            <Mail className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Email não verificado:</strong> Verifique sua caixa de entrada e clique no link de confirmação para ativar todas as funcionalidades.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}