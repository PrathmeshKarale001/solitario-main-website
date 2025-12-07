'use client';

import { FlowingMenu } from '@/components/ui';

interface MenuItem {
  link: string;
  text: string;
  image: string;
}

export default function FlowingMenuClient({ items }: { items: MenuItem[] }) {
  return <FlowingMenu items={items} />;
}
