import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: model, error } = await supabase
      .from('models')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Supabase devuelve PGRST116 si no encuentra el registro (single)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Model not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(model, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const { data: updatedModel, error } = await supabase
      .from('models')
      .update({
        space_name,
        description: description || null,
        file_url,
        pos_x,
        pos_y,
        pos_z
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!updatedModel) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    return NextResponse.json(updatedModel, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error or Invalid JSON' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Primero verificamos si existe
    const { data: existingModel, error: findError } = await supabase
      .from('models')
      .select('id')
      .eq('id', id)
      .single();

    if (findError || !existingModel) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    const { error: deleteError } = await supabase
      .from('models')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Model deleted successfully' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
