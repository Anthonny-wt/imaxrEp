'use client'

import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import { swaggerSpec } from '@/lib/swagger-spec'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-zinc-950 text-zinc-50 p-4 border-b border-zinc-800 flex items-center gap-4">
        <Link 
          href="/"
          className="flex items-center gap-2 hover:text-indigo-400 transition-colors bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
        <h1 className="font-bold text-lg">Documentación API para Unity</h1>
      </div>
      <div className="max-w-5xl mx-auto py-8">
        <SwaggerUI spec={swaggerSpec} />
      </div>
    </div>
  )
}
