'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/utils/supabase/client'
import { UploadCloud, File, X, Loader2 } from 'lucide-react'

export function UploadForm() {
  const router = useRouter()
  const supabase = createClient()
  
  const [file, setFile] = useState<File | null>(null)
  const [spaceName, setSpaceName] = useState('')
  const [description, setDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setError('')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/gltf-binary': ['.glb']
    },
    maxFiles: 1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Por favor selecciona un archivo .glb')
      return
    }
    if (!spaceName.trim()) {
      setError('El nombre del espacio es obligatorio')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      // 1. Upload to Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `models/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('glb_models')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('glb_models')
        .getPublicUrl(filePath)

      // 3. Insert into Database
      const { error: dbError } = await supabase
        .from('models')
        .insert([
          {
            space_name: spaceName,
            description,
            file_url: publicUrl,
            pos_x: 0,
            pos_y: 0,
            pos_z: 0
          }
        ])

      if (dbError) throw dbError

      // Success
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      console.error('Error uploading:', err)
      setError(err.message || 'Error al subir el modelo')
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto shadow-xl">
      <h2 className="text-2xl font-bold text-zinc-100 mb-6">Subir Nuevo Modelo 3D</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Nombre del Espacio
          </label>
          <input
            type="text"
            value={spaceName}
            onChange={(e) => setSpaceName(e.target.value)}
            placeholder="Ej. Sala de Conferencias A"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            disabled={isUploading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Descripción (opcional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Breve descripción del entorno o modelo..."
            rows={3}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
            disabled={isUploading}
          />
        </div>

        <div className="pt-2">
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            Archivo .glb
          </label>
          
          {!file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50'
              } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="w-10 h-10 text-zinc-400 mb-3" />
              <p className="text-zinc-300 font-medium mb-1">
                {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra un archivo .glb'}
              </p>
              <p className="text-zinc-500 text-sm">o haz clic para seleccionar</p>
            </div>
          ) : (
            <div className="bg-zinc-950 border border-indigo-500/30 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/10 p-2 rounded-lg">
                  <File className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">{file.name}</p>
                  <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                disabled={isUploading}
                className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          disabled={isUploading}
          className="flex-1 py-2.5 px-4 rounded-lg font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 border border-zinc-800"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isUploading || !file}
          className="flex-1 py-2.5 px-4 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Subiendo...
            </>
          ) : (
            'Guardar y Subir'
          )}
        </button>
      </div>
    </form>
  )
}
