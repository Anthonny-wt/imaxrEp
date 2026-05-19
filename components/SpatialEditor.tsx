'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ModelEditorCanvas } from '@/components/model-viewer/ModelEditorCanvas'
import { Save, Loader2, ArrowLeft, Move3d, RotateCcw } from 'lucide-react'

type AxisKey = 'x' | 'y' | 'z'

const AXES: {
  key: AxisKey
  label: string
  hint: string
  color: string
  track: string
  accent: string
}[] = [
  {
    key: 'x',
    label: 'Eje X',
    hint: 'Ancho',
    color: 'text-red-400',
    track: 'axis-track-x',
    accent: 'accent-red-500',
  },
  {
    key: 'y',
    label: 'Eje Y',
    hint: 'Altura',
    color: 'text-emerald-400',
    track: 'axis-track-y',
    accent: 'accent-emerald-500',
  },
  {
    key: 'z',
    label: 'Eje Z',
    hint: 'Profundidad',
    color: 'text-sky-400',
    track: 'axis-track-z',
    accent: 'accent-sky-500',
  },
]

function AxisControl({
  axis,
  value,
  onChange,
}: {
  axis: (typeof AXES)[number]
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className={`rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-4 ${axis.track}`}>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <span className={`text-sm font-semibold ${axis.color}`}>{axis.label}</span>
          <span className="ml-2 text-xs text-zinc-500">{axis.hint}</span>
        </div>
        <input
          type="number"
          step={0.1}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-[4.5rem] rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-right font-mono text-sm text-zinc-100 focus:border-indigo-500/50 focus:outline-none"
        />
      </div>
      <input
        type="range"
        min={-10}
        max={10}
        step={0.1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`axis-slider w-full ${axis.accent}`}
      />
    </div>
  )
}

export function SpatialEditor({
  modelId,
  initialData,
}: {
  modelId: string
  initialData: {
    space_name: string
    file_url: string
    pos_x?: number
    pos_y?: number
    pos_z?: number
  }
}) {
  const router = useRouter()
  const supabase = createClient()

  const [position, setPosition] = useState({
    x: initialData.pos_x ?? 0,
    y: initialData.pos_y ?? 0,
    z: initialData.pos_z ?? 0,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' })

  const positionVec: [number, number, number] = [
    position.x,
    position.y,
    position.z,
  ]

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage({ type: '', text: '' })

    try {
      const { error } = await supabase
        .from('models')
        .update({
          pos_x: position.x,
          pos_y: position.y,
          pos_z: position.z,
        })
        .eq('id', modelId)

      if (error) throw error

      setSaveMessage({ type: 'success', text: 'Coordenadas guardadas correctamente' })
      setTimeout(() => setSaveMessage({ type: '', text: '' }), 3000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar'
      setSaveMessage({ type: 'error', text: message })
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-5 lg:flex-row">
      {/* Visor 3D */}
      <div className="relative min-h-[380px] flex-1 overflow-hidden rounded-2xl border border-zinc-800 shadow-[inset_0_0_60px_-20px_rgba(99,102,241,0.15)] lg:min-h-0">
        <div className="absolute left-4 top-4 z-20">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 rounded-xl border border-zinc-700/60 bg-zinc-950/85 px-3 py-2 text-sm font-medium text-zinc-200 backdrop-blur-md transition-colors hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
        </div>
        <ModelEditorCanvas
          url={initialData.file_url}
          position={positionVec}
          spaceName={initialData.space_name}
        />
      </div>

      {/* Panel de controles */}
      <div className="flex w-full flex-col gap-4 lg:w-[22rem] lg:shrink-0">
        <div className="flex-1 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-xl backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15">
              <Move3d className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-100">Posición en escena</h3>
              <p className="text-xs text-zinc-500">Ajusta dónde aparece el modelo en Unity</p>
            </div>
          </div>

          <div className="space-y-4">
            {AXES.map((axis) => (
              <AxisControl
                key={axis.key}
                axis={axis}
                value={position[axis.key]}
                onChange={(v) => setPosition((p) => ({ ...p, [axis.key]: v }))}
              />
            ))}
          </div>

          <button
            onClick={() => setPosition({ x: 0, y: 0, z: 0 })}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 py-2.5 text-sm text-zinc-400 transition-colors hover:border-zinc-600 hover:bg-zinc-800/50 hover:text-zinc-200"
          >
            <RotateCcw className="h-4 w-4" />
            Resetear a origen (0, 0, 0)
          </button>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-xl backdrop-blur-sm">
          {saveMessage.text && (
            <div
              className={`mb-3 rounded-xl px-3 py-2 text-center text-xs font-medium ${
                saveMessage.type === 'error'
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              {saveMessage.text}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            {isSaving ? 'Guardando…' : 'Guardar coordenadas'}
          </button>
        </div>
      </div>
    </div>
  )
}
