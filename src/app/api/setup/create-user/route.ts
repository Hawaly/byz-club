import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, full_name, role_id } = body;

    // Validation basique
    if (!email || !password || !full_name || !role_id) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Créer l'utilisateur dans Supabase Auth avec app_metadata
    // Le trigger DB (handle_new_user) créera automatiquement l'entrée app_user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
      },
      app_metadata: {
        role_id: parseInt(role_id), // Passé au trigger via app_metadata
      },
    });

    if (authError) {
      console.error('Erreur création auth user:', authError);
      return NextResponse.json(
        { error: `Erreur Auth: ${authError.message}` },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Utilisateur auth non créé' },
        { status: 500 }
      );
    }

    // Le trigger a créé app_user automatiquement
    // Attendre un court instant pour la propagation
    await new Promise(resolve => setTimeout(resolve, 100));

    // Vérifier que app_user a bien été créé par le trigger
    const { data: appUser, error: checkError } = await supabaseAdmin
      .from('app_user')
      .select('user_id, role_id, is_active')
      .eq('user_id', authData.user.id)
      .single();

    if (checkError || !appUser) {
      console.warn('app_user non trouvé après création (trigger non activé?):', checkError);
      // Ne pas bloquer si le trigger n'est pas encore appliqué
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name,
        role_id: appUser?.role_id || parseInt(role_id),
      },
      trigger_status: appUser ? 'active' : 'pending_migration',
    });
  } catch (error: any) {
    console.error('Erreur générale:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
