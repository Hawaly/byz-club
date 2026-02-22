import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireRole } from '@/lib/authz';

export async function GET(request: NextRequest) {
  try {
    // Vérifier que l'utilisateur est admin
    const session = await requireRole(request, [1]);
    if (session instanceof NextResponse) return session;

    const { data: users, error } = await supabaseAdmin
      .from('app_user')
      .select(`
        id,
        email,
        is_active,
        client_id,
        auth_user_id,
        role:role_id (
          id,
          code,
          name
        ),
        client:client_id (
          id,
          name
        )
      `)
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 🔒 SÉCURITÉ: Vérifier que l'utilisateur est admin
    const session = await requireRole(request, [1]);
    if (session instanceof NextResponse) return session;

    const body = await request.json();
    const { email, password, role_id, client_id, is_active } = body;

    if (!email || !password || !role_id) {
      return NextResponse.json(
        { error: 'Email, password, and role_id are required' },
        { status: 400 }
      );
    }

    // 1. Create Supabase Auth user with app_metadata
    // Le trigger DB (handle_new_user) créera automatiquement l'entrée app_user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: {
        role_id: parseInt(role_id),
        client_id: client_id ? parseInt(client_id) : null,
      },
    });

    if (authError || !authData.user) {
      console.error('Error creating Supabase auth user:', authError);
      return NextResponse.json(
        { error: authError?.message || 'Failed to create auth user' },
        { status: 400 }
      );
    }

    // 2. Le trigger a créé app_user automatiquement
    // Attendre un court instant pour la propagation
    await new Promise(resolve => setTimeout(resolve, 200));

    // 3. Vérifier que app_user a bien été créé par le trigger
    const { data: userData, error: userError } = await supabaseAdmin
      .from('app_user')
      .select(`
        id,
        email,
        is_active,
        client_id,
        auth_user_id,
        role:role_id (
          id,
          code,
          name
        ),
        client:client_id (
          id,
          name
        )
      `)
      .eq('auth_user_id', authData.user.id)
      .single();

    if (userError || !userData) {
      console.error('Error: app_user not created by trigger:', userError);
      
      // Rollback: delete auth user if app_user was not created
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return NextResponse.json(
        { error: 'Failed to create user record (trigger not applied?)' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      user: userData 
    });

  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
