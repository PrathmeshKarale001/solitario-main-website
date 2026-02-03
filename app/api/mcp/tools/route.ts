/**
 * MCP Tools API Route
 * 
 * Provides an endpoint for listing available MCP tools
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

  try {
    const mcpClient = getShopifyMCPClient();
    const results = await mcpClient.listTools();
    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Tools list error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list tools',
      },
      { status: 500 }
    );
  }
}
