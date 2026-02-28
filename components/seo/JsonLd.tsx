// JSON-LD Schema Components for SEO

const BRAND_NAME = 'The Solitario';
const CANONICAL_URL = 'https://thesolitario.com';
const PHONE = '+91 98765 43210';

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  sku?: string;
  brand?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  url?: string;
  reviewCount?: number;
  ratingValue?: number;
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  currency = 'INR',
  sku,
  brand = BRAND_NAME,
  availability = 'InStock',
  url,
  reviewCount,
  ratingValue,
}: ProductSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    sku,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url,
      seller: {
        '@type': 'Organization',
        name: BRAND_NAME,
      },
    },
    ...(reviewCount && ratingValue && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: ratingValue.toFixed(1),
        reviewCount,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  socialLinks?: string[];
}

export function OrganizationSchema({
  name = BRAND_NAME,
  url = CANONICAL_URL,
  logo = `${CANONICAL_URL}/logo.svg`,
  description = 'Premium Lab Grown Diamond Jewellery - Rings, Necklaces, Earrings & More',
  email = 'contact@thesolitario.com',
  phone = PHONE,
  address,
  socialLinks = [
    'https://www.instagram.com/solitariodiamonds/',
    'https://www.facebook.com/profile.php?id=61586760412779',
    'https://in.linkedin.com/company/solitario-lab-grown-diamonds',
  ],
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description,
    email,
    telephone: phone,
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.street,
        addressLocality: address.city,
        addressRegion: address.state,
        postalCode: address.postalCode,
        addressCountry: address.country,
      },
    }),
    sameAs: socialLinks,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface LocalBusinessSchemaProps {
  name?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  openingHours?: string[];
  priceRange?: string;
  url?: string;
  image?: string;
  areaServed?: string;
  paymentAccepted?: string[];
}

export function LocalBusinessSchema({
  name = BRAND_NAME,
  address,
  geo,
  phone = PHONE,
  openingHours = ['Mo-Sa 10:00-20:00'],
  priceRange = '₹₹₹',
  url,
  image,
  areaServed,
  paymentAccepted = ['Cash', 'Credit Card', 'Debit Card', 'UPI'],
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name,
    ...(url && { url }),
    ...(image && { image }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    ...(geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
    telephone: phone,
    openingHoursSpecification: openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.split(' ')[0],
      opens: hours.split(' ')[1]?.split('-')[0],
      closes: hours.split(' ')[1]?.split('-')[1],
    })),
    priceRange,
    ...(areaServed && { areaServed }),
    paymentAccepted: paymentAccepted.join(', '),
    currenciesAccepted: 'INR',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
