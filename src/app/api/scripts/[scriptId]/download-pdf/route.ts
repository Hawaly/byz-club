import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireSession } from '@/lib/authz';
import { jsPDF } from 'jspdf';

// Helper function to generate a simple PDF for a script
async function generateScriptPDF(scriptData: any) {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Set font
  doc.setFont('helvetica', 'normal');
  
  // Add title
  doc.setFontSize(24);
  doc.text(`Script: ${scriptData.title}`, 20, 20);
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Date: ${new Date(scriptData.created_at).toLocaleDateString('fr-FR')}`, 20, 30);
  
  // Add separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 35, 190, 35);
  
  // Add content
  doc.setFontSize(12);
  
  // Process content by splitting it into lines and applying word wrapping
  const contentLines = doc.splitTextToSize(scriptData.content || '', 170);
  
  // Check if content exceeds one page
  const linesPerPage = 45; // approximate lines per page
  let y = 45;
  
  for (let i = 0; i < contentLines.length; i++) {
    // Add new page if needed
    if (i > 0 && i % linesPerPage === 0) {
      doc.addPage();
      y = 20;
    }
    
    doc.text(contentLines[i], 20, y);
    y += 6;
  }
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} / ${pageCount}`, 20, 287);
    doc.text('UrStory - Document confidentiel', 100, 287, { align: 'center' });
  }
  
  return doc.output('arraybuffer');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ scriptId: string }> }
) {
  try {
    // Vérifier l'authentification
    const session = await requireSession(request);
    if (session instanceof NextResponse) return session;

    const { scriptId: scriptIdStr } = await params;
    const scriptId = parseInt(scriptIdStr);
    
    if (isNaN(scriptId)) {
      return NextResponse.json(
        { error: 'ID de script invalide' },
        { status: 400 }
      );
    }

    // Récupérer le script
    const { data: script, error: scriptError } = await supabaseAdmin
      .from('script')
      .select('*')
      .eq('id', scriptId)
      .single();

    if (scriptError || !script) {
      console.error('Script error:', scriptError);
      return NextResponse.json(
        { error: 'Script non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que le client a accès à ce script
    if (session.roleId !== 1 && session.clientId) { // Si c'est un client
      // Vérifier si le script est associé à un mandat du client
      const { data: relatedMandat, error: mandatError } = await supabaseAdmin
        .from('mandat')
        .select('*')
        .eq('client_id', session.clientId)
        .eq('id', script.mandat_id)
        .maybeSingle();
      
      if (mandatError || !relatedMandat) {
        return NextResponse.json(
          { error: "Vous n'avez pas accès à ce script" },
          { status: 403 }
        );
      }
    }

    // Générer le PDF
    const pdfBytes = await generateScriptPDF(script);

    // Retourner le PDF
    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=script-${script.id}.pdf`,
      },
    });

  } catch (error: unknown) {
    console.error('PDF generation error:', error);
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la génération du PDF du script' },
      { status: 500 }
    );
  }
}
