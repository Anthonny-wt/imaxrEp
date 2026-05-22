import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

function mapToUnityFormat(model: any) {
  return {
    idmodel: model.id,
    iduser: model.user_id,
    spacename: model.space_name,
    description: model.description || "",
    urlModel: model.file_url,
    urlTexture: "", 
    datetimeCreated: model.created_at,
    state: model.is_active,
    pos_x: model.pos_x,
    pos_y: model.pos_y,
    pos_z: model.pos_z
  };
}

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
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Model not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(mapToUnityFormat(model), { status: 200 });
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
    const { spacename, description, urlModel, pos_x, pos_y, pos_z } = body;

    if (!spacename || !urlModel || pos_x === undefined || pos_y === undefined || pos_z === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: spacename, urlModel, pos_x, pos_y, pos_z' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Mapeamos a Supabase
    const { data: updatedModel, error } = await supabase
      .from('models')
      .update({
        space_name: spacename,
        description: description || null,
        file_url: urlModel,
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

    // Retorna true indicando éxito
    return NextResponse.json(true, { status: 200 });
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

    const { data: existingModel, error: findError } = await supabase
      .from('models')
      .select('id')
      .eq('id', id)
      .single();

    if (findError || !existingModel) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    // Soft delete: actualizar is_active a false
    const { data: softDeletedModel, error: deleteError } = await supabase
      .from('models')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json(
      { idmodel: softDeletedModel.id, state: softDeletedModel.is_active }, 
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
