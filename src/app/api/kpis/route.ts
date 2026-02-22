/**
 * API Route pour les KPIs financiers
 * GET /api/kpis - Récupère tous les KPIs (Expected/Invoiced/Collected)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/authz';
import { getFinancialKPIs } from '@/lib/kpis';

export async function GET(request: NextRequest) {
  const session = await requireSession(request);
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('start_date') || undefined;
  const endDate = searchParams.get('end_date') || undefined;

  try {
    const kpis = await getFinancialKPIs(startDate, endDate);
    return NextResponse.json(kpis);
  } catch (error) {
    console.error('[API] Error fetching KPIs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KPIs' },
      { status: 500 }
    );
  }
}
