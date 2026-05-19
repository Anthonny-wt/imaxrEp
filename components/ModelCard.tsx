'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Edit3, Clock, Trash2, Power, PowerOff, Loader2 } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import { createClient } from '@/utils/supabase/client'

// Componente interno para cargar el modelo 3D en la tarjeta
function ModelPreview({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1.5} position={[0, -0.5, 0]} />
}

export interface ModelType {
  id: string
  space_name: string
  description: string
  file_url: string
  pos_x: number
  pos_z: number
  created_at: string
  is_active?: boolean // Opcional por compatibilidad con modelos antiguos
}

export function ModelCard({ model }: { model: ModelType }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [isActive, setIsActive] = useState(model.is_active !== false) // Por defecto true si no existe

  const formattedDate = new Date(model.created_at).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${model.space_name}"? Esta acción no se puede deshacer.`)) return

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
      const { error } = await supabase.from('models').update({ is_active: newStatus }).eq('id', model.id)
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
    <div className={`group relative bg-zinc-900 border ${isActive ? 'border-zinc-800 hover:border-indigo-500/50' : 'border-red-900/30 opacity-75'} rounded-xl overflow-hidden transition-all duration-300 shadow-lg`}>
      
      {/* Contenedor del Visor 3D */}
      <div className="h-48 w-full bg-zinc-950 relative border-b border-zinc-800/50 cursor-move">
        {!isActive && (
          <div className="absolute inset-0 bg-red-950/20 z-10 flex items-center justify-center pointer-events-none">
            <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              Inactivo
            </span>
          </div>
        )}
        <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            <ModelPreview url={model.file_url} />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

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
        
        <div className="flex justify-between items-center border-t border-zinc-800/50 pt-4 gap-2">
          
          {/* Botones de Acción Izquierda (CRUD) */}
          <div className="flex gap-2">
            <button
              onClick={handleToggleActive}
              disabled={isToggling}
              title={isActive ? "Desactivar Modelo" : "Activar Modelo"}
              className={`p-2 rounded-lg transition-colors ${isActive ? 'text-green-400 hover:bg-green-400/10' : 'text-red-400 hover:bg-red-400/10'}`}
            >
              {isToggling ? <Loader2 className="w-4 h-4 animate-spin" /> : (isActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />)}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Eliminar Modelo"
              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Botón Editar Derecha */}
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
