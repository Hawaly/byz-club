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
  const contentLines = doc.splitTextToSize(scriptData.content, 170);
  
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
