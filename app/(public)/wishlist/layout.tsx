import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Wishlist',
    description: 'Your saved favourites from The Solitario. Sign in to view and manage your diamond jewellery wishlist.',
    alternates: { canonical: '/wishlist' },
    robots: { index: false, follow: true },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
    return children;
}
