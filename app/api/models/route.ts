import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

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

    return NextResponse.json(models, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { space_name, description, file_url, pos_x, pos_y, pos_z } = body;

    // Validación básica
    if (!space_name || !file_url || pos_x === undefined || pos_y === undefined || pos_z === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: space_name, file_url, pos_x, pos_y, pos_z' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verificar usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Debes iniciar sesión.' }, { status: 401 });
    }

    // Crear el nuevo modelo
    const { data: newModel, error } = await supabase
      .from('models')
      .insert([
        {
          user_id: user.id,
          space_name,
          description: description || null,
          file_url,
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

    return NextResponse.json(newModel, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error or Invalid JSON' }, { status: 500 });
  }
}
