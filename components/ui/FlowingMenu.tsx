'use client';

import React from 'react';

interface MenuItem {
  link: string;
  text: string;
  image: string;
}

interface FlowingMenuProps {
  items?: MenuItem[];
}

function MenuItem({ link, text }: MenuItem) {
  return (
    <div className="py-4 border-b border-brand-300">
      <a 
        className="block text-2xl md:text-3xl lg:text-4xl font-playfair text-brand-800 hover:text-bronze-gold transition-colors duration-300"
        href={link}
      >
        {text}
      </a>
    </div>
  );
}

export default function FlowingMenu({ items = [] }: FlowingMenuProps) {
  return (
    <div className="py-12 px-8" style={{ backgroundColor: '#FAF5EF' }}>
      <nav className="max-w-4xl mx-auto">
        {items.map((item, idx) => (
          <MenuItem key={idx} {...item} />
        ))}
      </nav>
    </div>
  );
}

