import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;
    const filePath = pathArray.join('/');
    const fullPath = path.join(process.cwd(), 'public', 'uploads', filePath);

    // Vérifier que le fichier existe
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Lire le fichier
    const fileBuffer = fs.readFileSync(fullPath);

    // Déterminer le type de contenu
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = ext === '.pdf' 
      ? 'application/pdf' 
      : ext.match(/\.(jpg|jpeg|png|gif|webp)$/) 
        ? `image/${ext.slice(1)}` 
        : 'application/octet-stream';

    // Retourner le fichier
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${path.basename(fullPath)}"`,
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
