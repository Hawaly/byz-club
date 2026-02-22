/**
 * API Route pour activer un contrat
 * POST /api/contracts/[id]/activate
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/authz';
import { activateContract } from '@/lib/billingEngine';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireRole(request, [1]); // Admin only
  if (authResult instanceof NextResponse) return authResult;

  const { id } = await params;
  const contractId = parseInt(id);

  if (isNaN(contractId)) {
    return NextResponse.json(
      { error: 'Invalid contract ID' },
      { status: 400 }
    );
  }

  try {
    const result = await activateContract(contractId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to activate contract' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contract activated successfully',
      schedules_count: result.schedules?.length || 0,
      schedules: result.schedules,
    });
  } catch (error) {
    console.error('[API] Error activating contract:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
