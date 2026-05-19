'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Grid, Html } from '@react-three/drei'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2, ArrowLeft, Move3d } from 'lucide-react'

// Componente para cargar el modelo GLB
function Model({ url, position }: { url: string, position: [number, number, number] }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} position={position} />
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-zinc-400 bg-zinc-950/80 p-4 rounded-xl backdrop-blur-sm border border-zinc-800">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="text-sm font-medium">Cargando Modelo...</span>
      </div>
    </Html>
  )
}

export function SpatialEditor({ modelId, initialData }: { modelId: string, initialData: any }) {
  const router = useRouter()
  const supabase = createClient()

  const [position, setPosition] = useState({
    x: initialData.pos_x || 0,
    y: initialData.pos_y || 0,
    z: initialData.pos_z || 0
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' })

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage({ type: '', text: '' })

    try {
      const { error } = await supabase
        .from('models')
        .update({
          pos_x: position.x,
          pos_y: position.y,
          pos_z: position.z
        })
        .eq('id', modelId)

      if (error) throw error

      setSaveMessage({ type: 'success', text: 'Coordenadas actualizadas correctamente' })
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000)
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: err.message || 'Error al guardar' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setPosition({ x: 0, y: 0, z: 0 })
  }

  // Deshabilitar scroll en el body cuando estamos en el editor para evitar conflicto con el canvas
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] gap-6">
      
      {/* Panel Izquierdo: Visor 3D */}
      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative shadow-inner">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 p-2 rounded-lg backdrop-blur-md transition-colors border border-zinc-800/50 flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        </div>
        
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-zinc-950/80 text-zinc-300 px-3 py-1.5 rounded-lg backdrop-blur-md border border-zinc-800/50 text-xs font-mono">
            {initialData.space_name}
          </div>
        </div>

        <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
          <color attach="background" args={['#09090b']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Suspense fallback={<Loader />}>
            <Model 
              url={initialData.file_url} 
              position={[position.x, position.y, position.z]} 
            />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls makeDefault />
          <Grid 
            infiniteGrid 
            fadeDistance={30} 
            sectionColor="#3f3f46" 
            cellColor="#27272a" 
            position={[0, 0, 0]} 
          />
        </Canvas>
      </div>

      {/* Panel Derecho: Controles */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 text-zinc-100 mb-6">
            <Move3d className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-lg">Controles de Posición</h3>
          </div>

          <div className="space-y-6">
            {/* Eje X */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-red-400">Eje X (Ancho)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={position.x}
                  onChange={(e) => setPosition({...position, x: parseFloat(e.target.value) || 0})}
                  className="w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-right text-sm text-zinc-200 focus:outline-none focus:border-red-500/50"
                />
              </div>
              <input 
                type="range" 
                min="-10" max="10" step="0.1" 
                value={position.x}
                onChange={(e) => setPosition({...position, x: parseFloat(e.target.value)})}
                className="w-full accent-red-500"
              />
            </div>

            {/* Eje Y */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-green-400">Eje Y (Altura)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={position.y}
                  onChange={(e) => setPosition({...position, y: parseFloat(e.target.value) || 0})}
                  className="w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-right text-sm text-zinc-200 focus:outline-none focus:border-green-500/50"
                />
              </div>
              <input 
                type="range" 
                min="-10" max="10" step="0.1" 
                value={position.y}
                onChange={(e) => setPosition({...position, y: parseFloat(e.target.value)})}
                className="w-full accent-green-500"
              />
            </div>

            {/* Eje Z */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-blue-400">Eje Z (Profundidad)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={position.z}
                  onChange={(e) => setPosition({...position, z: parseFloat(e.target.value) || 0})}
                  className="w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-right text-sm text-zinc-200 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <input 
                type="range" 
                min="-10" max="10" step="0.1" 
                value={position.z}
                onChange={(e) => setPosition({...position, z: parseFloat(e.target.value)})}
                className="w-full accent-blue-500"
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800/50 flex justify-between">
             <button
              onClick={handleReset}
              className="text-sm text-zinc-400 hover:text-zinc-200 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Resetear a 0
            </button>
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-lg">
          {saveMessage.text && (
            <div className={`mb-3 p-2 text-xs text-center rounded-lg ${saveMessage.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
              {saveMessage.text}
            </div>
          )}
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSaving ? 'Guardando...' : 'Guardar Coordenadas'}
          </button>
        </div>
      </div>
    </div>
  )
}
