'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { LogOut, Box } from 'lucide-react'

export function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/dashboard')}
          >
            <Box className="w-6 h-6 text-indigo-500" />
            <span className="font-bold text-xl tracking-tight">EduXR CMS</span>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors rounded-md hover:bg-zinc-800"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
    </div>
  )
}
