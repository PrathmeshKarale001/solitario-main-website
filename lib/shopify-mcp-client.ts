/**
 * Shopify MCP Client
 * 
 * TypeScript client for interacting with Shopify's Model Context Protocol (MCP) server
 * Documentation: https://shopify.dev/docs/apps/build/storefront-mcp
 */

interface MCPRequest {
  jsonrpc: '2.0';
  method: string;
  id: number;
  params?: Record<string, any>;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export class ShopifyMCPClient {
  private storeDomain: string;
  private mcpEndpoint: string;
  private requestId: number = 1;

  constructor() {
    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    if (!domain) {
      throw new Error('SHOPIFY_STORE_DOMAIN environment variable is required');
    }
    this.storeDomain = domain.includes('.myshopify.com') 
      ? domain.replace('.myshopify.com', '') 
      : domain;
    this.mcpEndpoint = `https://${this.storeDomain}.myshopify.com/api/mcp`;
  }

  private async sendRequest(method: string, params?: Record<string, any>): Promise<any> {
    const request: MCPRequest = {
      jsonrpc: '2.0',
      method,
      id: this.requestId++,
      params,
    };

    try {
      const response = await fetch(this.mcpEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('MCP endpoint returned non-JSON:', text.substring(0, 500));
        throw new Error(
          `Shopify MCP endpoint returned HTML instead of JSON. ` +
          `This usually means the MCP endpoint is not available for your store. ` +
          `Please verify: 1) Your store domain is correct, 2) MCP is enabled for your Shopify store, ` +
          `3) The endpoint ${this.mcpEndpoint} is accessible.`
        );
      }

      if (!response.ok) {
        throw new Error(`MCP request failed: ${response.status} ${response.statusText}`);
      }

      const data: MCPResponse = await response.json();

      if (data.error) {
        throw new Error(`MCP error: ${data.error.message} (code: ${data.error.code})`);
      }

      return data.result;
    } catch (error) {
      if (error instanceof Error && error.message.includes('HTML instead of JSON')) {
        throw error;
      }
      console.error('MCP request error:', error);
      throw new Error(`MCP request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search the product catalog
   */
  async searchCatalog(query: string, context?: string): Promise<any> {
    return this.sendRequest('tools/call', {
      name: 'search_shop_catalog',
      arguments: {
        query,
        context: context || undefined,
      },
    });
  }

  /**
   * Search store policies and FAQs
   */
  async searchPolicies(query: string, context?: string): Promise<any> {
    return this.sendRequest('tools/call', {
      name: 'search_shop_policies_and_faqs',
      arguments: {
        query,
        context: context || undefined,
      },
    });
  }

  /**
   * Get cart contents
   */
  async getCart(cartId: string): Promise<any> {
    return this.sendRequest('tools/call', {
      name: 'get_cart',
      arguments: {
        cart_id: cartId,
      },
    });
  }

  /**
   * Update cart (add, update, or remove items)
   */
  async updateCart(cartId: string | null, lines: Array<{ merchandise_id: string; quantity: number }>): Promise<any> {
    return this.sendRequest('tools/call', {
      name: 'update_cart',
      arguments: {
        cart_id: cartId || undefined,
        lines,
      },
    });
  }

  /**
   * List available MCP tools
   */
  async listTools(): Promise<any> {
    return this.sendRequest('tools/list');
  }
}

// Singleton instance
let mcpClientInstance: ShopifyMCPClient | null = null;

export function getShopifyMCPClient(): ShopifyMCPClient {
  if (!mcpClientInstance) {
    mcpClientInstance = new ShopifyMCPClient();
  }
  return mcpClientInstance;
}
