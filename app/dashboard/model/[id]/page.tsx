import { createClient } from '@/utils/supabase/server'
import { SpatialEditor } from '@/components/SpatialEditor'
import { notFound } from 'next/navigation'

export const revalidate = 0 // Disable cache

export default async function ModelEditorPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // params.id es asíncrono en las nuevas versiones de Next.js pero vamos a resolverlo para estar seguros
  // Usaremos el id directamente
  const id = params.id

  const { data: model, error } = await supabase
    .from('models')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !model) {
    notFound()
  }

  return (
    <div>
      <SpatialEditor modelId={model.id} initialData={model} />
    </div>
  )
}
