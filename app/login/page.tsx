'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Box, Lock, Mail, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error('Credenciales incorrectas. Inténtalo de nuevo.')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -z-10 animate-pulse delay-1000" />

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl mb-6">
            <Box className="w-8 h-8 text-indigo-500" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-2 tracking-tight">EduXR CMS</h1>
          <p className="text-zinc-400">Panel de control de Realidad Mixta</p>
        </div>

        <form onSubmit={handleLogin} className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-semibold text-zinc-100 mb-6">Iniciar Sesión</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                  placeholder="admin@eduxr.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-indigo-500/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Conectando...
                </>
              ) : (
                'Acceder al Panel'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
