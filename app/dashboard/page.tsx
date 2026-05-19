import { createClient } from '@/utils/supabase/server'
import { ModelCard, ModelType } from '@/components/ModelCard'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const revalidate = 0 // Disable cache to always fetch latest models

export default async function DashboardPage() {
  const supabase = await createClient()

  // Obtener modelos de la base de datos, ordenados por los más recientes
  const { data: models, error } = await supabase
    .from('models')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Modelos 3D</h1>
          <p className="text-zinc-400 mt-1">Gestiona los entornos de la aplicación Unity</p>
        </div>
        
        <Link 
          href="/dashboard/upload"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-5 h-5" />
          <span>Subir Nuevo Modelo</span>
        </Link>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl text-red-400">
          <p className="font-medium">Error al cargar los modelos:</p>
          <p className="text-sm opacity-80 mt-1">{error.message}</p>
        </div>
      ) : !models || models.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-zinc-500" />
          </div>
          <h3 className="text-xl font-medium text-zinc-200 mb-2">No hay modelos disponibles</h3>
          <p className="text-zinc-400 mb-6 max-w-sm mx-auto">
            Aún no has subido ningún modelo .glb. Sube el primer entorno para empezar a configurar las coordenadas.
          </p>
          <Link 
            href="/dashboard/upload"
            className="inline-flex items-center gap-2 bg-zinc-100 text-zinc-900 hover:bg-white px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            Subir Modelo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model: ModelType) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      )}
    </div>
  )
}
