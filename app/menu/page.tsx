import FlowingMenu from '@/components/ui/FlowingMenu';

const menuItems = [
  { 
    link: '/products', 
    text: 'Products', 
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&q=80'
  },
  { 
    link: '/about', 
    text: 'About Us', 
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop&q=80'
  },
  { 
    link: '/contact', 
    text: 'Contact', 
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=300&fit=crop&q=80'
  },
];

export default function MenuPage() {
  return (
    <div style={{ height: 'calc(100vh - 80px)', position: 'relative', marginTop: '80px' }}>
      <FlowingMenu items={menuItems} />
    </div>
  );
}


