/**
 * API Route pour exécuter le billing engine
 * POST /api/billing/run
 * 
 * Cette route doit être appelée par un cron job quotidien
 * pour générer automatiquement les factures dues
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/authz';
import { generateDueInvoices } from '@/lib/billingEngine';

export async function POST(request: NextRequest) {
  const authResult = await requireRole(request, [1]); // Admin only
  if (authResult instanceof NextResponse) return authResult;

  try {
    console.log('[API] Starting billing run...');
    
    const result = await generateDueInvoices(new Date());

    if (!result.success) {
      console.error('[API] Billing run completed with errors:', result.errors);
      return NextResponse.json(
        {
          success: false,
          message: 'Billing run completed with errors',
          invoices_generated: result.invoices_generated,
          errors: result.errors,
          run_date: result.run_date,
        },
        { status: 207 } // Multi-Status
      );
    }

    console.log(`[API] Billing run completed successfully: ${result.invoices_generated} invoices generated`);

    return NextResponse.json({
      success: true,
      message: 'Billing run completed successfully',
      invoices_generated: result.invoices_generated,
      invoices: result.invoices,
      run_date: result.run_date,
    });
  } catch (error) {
    console.error('[API] Fatal error during billing run:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET pour vérifier le statut (optionnel)
export async function GET(request: NextRequest) {
  const authResult = await requireRole(request, [1]); // Admin only
  if (authResult instanceof NextResponse) return authResult;

  return NextResponse.json({
    message: 'Billing engine ready',
    endpoint: 'POST /api/billing/run',
    description: 'Generates invoices for all due schedules',
  });
}
