import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/shopify-data';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ 
      products: [],
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
