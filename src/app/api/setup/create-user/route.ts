import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

// GET - Lister tous les users (auth + app_user)
export async function GET() {
  try {
    const { data: appUsers, error } = await supabaseAdmin
      .from('app_user')
      .select(`
        id, email, role_id, client_id, is_active, auth_user_id, created_at,
        role:role_id (id, code, name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, users: appUsers || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Créer un user dans Auth + app_user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name, role_id, client_id } = body;

    if (!email || !password || !role_id) {
      return NextResponse.json(
        { error: 'Champs requis: email, password, role_id' },
        { status: 400 }
      );
    }

    // 1. Créer dans Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name || email },
      app_metadata: { role_id: parseInt(role_id) },
    });

    if (authError) {
      return NextResponse.json({ error: `Auth: ${authError.message}` }, { status: 500 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'User auth non créé' }, { status: 500 });
    }

    // 2. Attendre propagation trigger
    await new Promise(resolve => setTimeout(resolve, 300));

    // 3. Vérifier si le trigger a créé app_user
    const { data: existing } = await supabaseAdmin
      .from('app_user')
      .select('id, role_id, auth_user_id')
      .eq('auth_user_id', authData.user.id)
      .single();

    if (existing) {
      // Trigger a fonctionné - mettre à jour role_id et client_id si besoin
      await supabaseAdmin
        .from('app_user')
        .update({
          role_id: parseInt(role_id),
          client_id: client_id || null,
          updated_at: new Date().toISOString(),
        })
        .eq('auth_user_id', authData.user.id);

      return NextResponse.json({
        success: true,
        trigger_status: 'active',
        user: { id: existing.id, email, role_id: parseInt(role_id) },
      });
    }

    // 4. Trigger absent → fallback manuel
    const { data: newAppUser, error: insertError } = await supabaseAdmin
      .from('app_user')
      .insert({
        email,
        auth_user_id: authData.user.id,
        role_id: parseInt(role_id),
        client_id: client_id || null,
        is_active: true,
      })
      .select('id')
      .single();

    if (insertError) {
      return NextResponse.json({ error: `app_user insert: ${insertError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      trigger_status: 'fallback_manual',
      user: { id: newAppUser.id, email, role_id: parseInt(role_id) },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Supprimer un user (auth + app_user)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { auth_user_id, app_user_id } = body;

    if (!auth_user_id && !app_user_id) {
      return NextResponse.json({ error: 'auth_user_id ou app_user_id requis' }, { status: 400 });
    }

    const errors: string[] = [];

    // 1. Supprimer dans Supabase Auth EN PREMIER
    // (évite les conflits de trigger si handle_new_user est actif)
    if (auth_user_id) {
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(auth_user_id);
      if (authDeleteError) errors.push(`Auth: ${authDeleteError.message}`);
    }

    // 2. Supprimer dans app_user
    if (app_user_id) {
      const { error: appDeleteError } = await supabaseAdmin
        .from('app_user')
        .delete()
        .eq('id', app_user_id);
      if (appDeleteError) errors.push(`app_user: ${appDeleteError.message}`);
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(' | ') }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
