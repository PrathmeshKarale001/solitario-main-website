import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/auth/',
                    '/api/payments/',
                    '/api/razorpay/',
                    '/api/webhooks/',
                    '/api/debug/',
                    '/api/admin/',
                    '/api/test-orders/',
                    '/api/mcp/',
                    '/admin/',
                    '/checkout/',
                    '/ai-search/',
                    '/shop-checkout/',
                    '/sign-in/',
                    '/sign-up/',
                    '/auth/',
                    '/account/',
                ],
            },
            // Block AI scrapers from indexing content
            { userAgent: 'GPTBot', disallow: ['/'] },
            { userAgent: 'ChatGPT-User', disallow: ['/'] },
            { userAgent: 'CCBot', disallow: ['/'] },
            { userAgent: 'anthropic-ai', disallow: ['/'] },
            { userAgent: 'Claude-Web', disallow: ['/'] },
            { userAgent: 'Google-Extended', disallow: ['/'] },
            { userAgent: 'FacebookBot', disallow: ['/'] },
            { userAgent: 'Bytespider', disallow: ['/'] },
        ],
        sitemap: 'https://thesolitario.com/sitemap.xml',
    };
}
