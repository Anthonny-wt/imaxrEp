import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Función helper para mapear de Supabase a Unity
function mapToUnityFormat(model: any) {
  return {
    idmodel: model.id,
    iduser: model.user_id,
    spacename: model.space_name,
    description: model.description || "",
    urlModel: model.file_url,
    urlTexture: "", // No existe en Supabase, se devuelve vacío
    datetimeCreated: model.created_at,
    state: model.is_active,
    pos_x: model.pos_x,
    pos_y: model.pos_y,
    pos_z: model.pos_z
  };
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Obtener todos los modelos de la base de datos
    const { data: models, error } = await supabase
      .from('models')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Mapear al formato esperado por Unity
    const mappedModels = models ? models.map(mapToUnityFormat) : [];

    return NextResponse.json({ models: mappedModels }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // El body viene con las variables de Unity
    const { spacename, description, urlModel, pos_x, pos_y, pos_z } = body;

    // Validación básica basada en las variables de Unity
    if (!spacename || !urlModel || pos_x === undefined || pos_y === undefined || pos_z === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: spacename, urlModel, pos_x, pos_y, pos_z' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verificar usuario autenticado para asignar el user_id
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Debes enviar el token.' }, { status: 401 });
    }

    // Mapeamos las variables de Unity a Supabase para la inserción
    const { data: newModel, error } = await supabase
      .from('models')
      .insert([
        {
          user_id: user.id,
          space_name: spacename,
          description: description || null,
          file_url: urlModel,
          pos_x,
          pos_y,
          pos_z
        }
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Retornamos formato esperado: { "idmodel": "uuid-generado" }
    return NextResponse.json({ idmodel: newModel.id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error or Invalid JSON' }, { status: 500 });
  }
}
