import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('file');

    if (!filePath) {
        return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 });
    }

    // Security: ensure the path stays within the Regulatory Disclosures directory
    const decodedPath = decodeURIComponent(filePath);
    if (decodedPath.includes('..') || !decodedPath.startsWith('Regulatory Disclosures/')) {
        return NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
    }

    const absolutePath = path.join(process.cwd(), 'public', decodedPath);

    try {
        const fileBuffer = await readFile(absolutePath);

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline',
                'Content-Length': fileBuffer.length.toString(),
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
}
