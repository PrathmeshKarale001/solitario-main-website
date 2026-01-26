/**
 * MCP Cart API Route
 * 
 * Provides an endpoint for cart operations using Shopify's MCP server
 */

import { NextRequest, NextResponse } from 'next/server';
import { getShopifyMCPClient } from '@/lib/shopify-mcp-client';
import { isMCPEnabled } from '@/lib/feature-flags';

export async function GET(request: NextRequest) {
  // Check if MCP feature is enabled
  if (!isMCPEnabled()) {
    return NextResponse.json(
      { error: 'MCP feature is disabled' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get('cart_id');

  if (!cartId) {
    return NextResponse.json(
      { error: 'cart_id parameter is required' },
      { status: 400 }
    );
  }

  try {
    const mcpClient = getShopifyMCPClient();
    const results = await mcpClient.getCart(cartId);
    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get cart',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Check if MCP feature is enabled
  if (!isMCPEnabled()) {
    return NextResponse.json(
      { error: 'MCP feature is disabled' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { cart_id, lines } = body;

    if (!lines || !Array.isArray(lines)) {
      return NextResponse.json(
        { error: 'lines parameter is required and must be an array' },
        { status: 400 }
      );
    }

    try {
      const mcpClient = getShopifyMCPClient();
      const results = await mcpClient.updateCart(cart_id || null, lines);
      return NextResponse.json({
        success: true,
        results,
      });
    } catch (mcpError) {
      return NextResponse.json(
        {
          success: false,
          error: mcpError instanceof Error ? mcpError.message : 'Failed to update cart',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update cart',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return POST(request); // PUT uses same logic as POST
}

export async function DELETE(request: NextRequest) {
  // Check if MCP feature is enabled
  if (!isMCPEnabled()) {
    return NextResponse.json(
      { error: 'MCP feature is disabled' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { cart_id, line_item_id } = body;

    if (!cart_id || !line_item_id) {
      return NextResponse.json(
        { error: 'cart_id and line_item_id parameters are required' },
        { status: 400 }
      );
    }

    try {
      const mcpClient = getShopifyMCPClient();
      // Remove item by setting quantity to 0
      const results = await mcpClient.updateCart(cart_id, [
        { merchandise_id: line_item_id, quantity: 0 },
      ]);
      return NextResponse.json({
        success: true,
        results,
      });
    } catch (mcpError) {
      return NextResponse.json(
        {
          success: false,
          error: mcpError instanceof Error ? mcpError.message : 'Failed to remove from cart',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove from cart',
      },
      { status: 500 }
    );
  }
}
