'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit3, Clock, Trash2, Power, PowerOff, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { ModelPreviewCanvas } from '@/components/model-viewer/ModelPreviewCanvas'

export interface ModelType {
  id: string
  space_name: string
  description: string
  file_url: string
  pos_x: number
  pos_z: number
  created_at: string
  is_active?: boolean
}

export function ModelCard({ model }: { model: ModelType }) {
  const router = useRouter()
  const supabase = createClient()

  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [isActive, setIsActive] = useState(model.is_active !== false)

  const formattedDate = new Date(model.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const handleDelete = async () => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar "${model.space_name}"? Esta acción no se puede deshacer.`
      )
    )
      return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from('models').delete().eq('id', model.id)
      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error('Error eliminando modelo:', err)
      alert('Hubo un error al eliminar el modelo.')
      setIsDeleting(false)
    }
  }

  const handleToggleActive = async () => {
    setIsToggling(true)
    const newStatus = !isActive
    try {
      const { error } = await supabase
        .from('models')
        .update({ is_active: newStatus })
        .eq('id', model.id)
      if (error) throw error
      setIsActive(newStatus)
      router.refresh()
    } catch (err) {
      console.error('Error actualizando estado:', err)
      alert('Hubo un error al cambiar el estado del modelo.')
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-zinc-900/80 shadow-xl transition-all duration-300 ${
        isActive
          ? 'border-zinc-800 hover:border-indigo-500/40 hover:shadow-[0_8px_40px_-12px_rgba(99,102,241,0.35)]'
          : 'border-red-900/30 opacity-80'
      }`}
    >
      <div className="relative h-56 w-full cursor-grab active:cursor-grabbing">
        {!isActive && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-red-950/25 backdrop-blur-[2px]">
            <span className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-300">
              Inactivo
            </span>
          </div>
        )}
        <ModelPreviewCanvas url={model.file_url} autoRotate={isActive} />
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3
            className="line-clamp-1 text-lg font-bold text-zinc-100 transition-colors group-hover:text-indigo-100"
            title={model.space_name}
          >
            {model.space_name}
          </h3>
          <span className="flex shrink-0 items-center gap-1 rounded-md bg-zinc-800/80 px-2 py-1 text-xs text-zinc-500">
            <Clock className="h-3 w-3" />
            {formattedDate}
          </span>
        </div>

        <p className="mb-5 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-zinc-400">
          {model.description || 'Sin descripción'}
        </p>

        <div className="flex items-center justify-between gap-2 border-t border-zinc-800/60 pt-4">
          <div className="flex gap-1.5">
            <button
              onClick={handleToggleActive}
              disabled={isToggling}
              title={isActive ? 'Desactivar modelo' : 'Activar modelo'}
              className={`rounded-xl p-2.5 transition-colors ${
                isActive
                  ? 'text-emerald-400 hover:bg-emerald-400/10'
                  : 'text-red-400 hover:bg-red-400/10'
              }`}
            >
              {isToggling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isActive ? (
                <Power className="h-4 w-4" />
              ) : (
                <PowerOff className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Eliminar modelo"
              className="rounded-xl p-2.5 text-zinc-500 transition-colors hover:bg-red-400/10 hover:text-red-400"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            onClick={() => router.push(`/dashboard/model/${model.id}`)}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40"
          >
            <Edit3 className="h-4 w-4" />
            <span>Editar 3D</span>
          </button>
        </div>
      </div>
    </div>
  )
}
