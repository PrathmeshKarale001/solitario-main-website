import { NextRequest, NextResponse } from 'next/server';

// Use Edge Runtime to avoid bundling the entire public/ directory
// into a serverless function (which caused the 300MB+ size limit error)
export const runtime = 'edge';

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

    try {
        // Construct the public URL and fetch the file
        const origin = request.nextUrl.origin;
        const publicUrl = `${origin}/${encodeURI(decodedPath)}`;
        const response = await fetch(publicUrl);

        if (!response.ok) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const fileBuffer = await response.arrayBuffer();

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline',
                'Content-Length': fileBuffer.byteLength.toString(),
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
}
