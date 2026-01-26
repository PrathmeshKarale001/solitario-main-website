/**
 * MCP Policies API Route
 * 
 * Provides an endpoint for searching store policies using Shopify's MCP server
 */

import { NextRequest, NextResponse } from 'next/server';
import { getShopifyMCPClient } from '@/lib/shopify-mcp-client';
import { isMCPEnabled } from '@/lib/feature-flags';

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
    const { query, context } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required and must be a string' },
        { status: 400 }
      );
    }

    try {
      const mcpClient = getShopifyMCPClient();
      const results = await mcpClient.searchPolicies(query, context);
      return NextResponse.json({
        success: true,
        results,
      });
    } catch (mcpError) {
      return NextResponse.json(
        {
          success: false,
          error: mcpError instanceof Error ? mcpError.message : 'Failed to search policies',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Policies search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search policies',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Check if MCP feature is enabled
  if (!isMCPEnabled()) {
    return NextResponse.json(
      { error: 'MCP feature is disabled' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const context = searchParams.get('context');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const mcpClient = getShopifyMCPClient();
    const results = await mcpClient.searchPolicies(query, context || undefined);
    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Policies search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search policies',
      },
      { status: 500 }
    );
  }
}
