'use client'

import { useRouter } from 'next/navigation'
import { Edit3, Clock } from 'lucide-react'

export interface ModelType {
  id: string
  space_name: string
  description: string
  file_url: string
  pos_x: number
  pos_y: number
  pos_z: number
  created_at: string
}

export function ModelCard({ model }: { model: ModelType }) {
  const router = useRouter()

  const formattedDate = new Date(model.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-zinc-100 line-clamp-1" title={model.space_name}>
            {model.space_name}
          </h3>
          <span className="flex items-center gap-1 text-xs text-zinc-500">
            <Clock className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>
        
        <p className="text-sm text-zinc-400 line-clamp-2 mb-6 min-h-[40px]">
          {model.description || 'Sin descripción'}
        </p>
        
        <div className="flex justify-between items-center border-t border-zinc-800/50 pt-4">
          <div className="text-xs text-zinc-500 font-mono">
            {model.file_url.split('/').pop()?.substring(0, 15)}...
          </div>
          
          <button
            onClick={() => router.push(`/dashboard/model/${model.id}`)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar 3D</span>
          </button>
        </div>
      </div>
    </div>
  )
}
