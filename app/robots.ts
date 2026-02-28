import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/checkout/',
                    '/ai-search/',
                    '/shop-checkout/',
                    '/sign-in/',
                    '/sign-up/',
                    '/auth/',
                ],
            },
        ],
        sitemap: 'https://thesolitario.com/sitemap.xml',
    };
}
