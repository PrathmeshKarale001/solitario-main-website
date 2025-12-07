'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Star, Check, Package, Truck, RotateCcw, Facebook, Instagram, Twitter, Mail, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Product } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { Section, Container } from '@/components/ui';
import { PRODUCTS } from '@/lib/data';
import { useCart } from '@/lib/cart-context';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'information' | 'reviews'>('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lightboxPosition, setLightboxPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const { addToCart: addToCartContext } = useCart();

  // Get related products (same category, excluding current product)
  const relatedProducts = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 6);

  // Use real images from Shopify, fallback to single image repeated
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const handleAddToCart = () => {
    addToCartContext(product, quantity);
  };

  const handleBuyNow = () => {
    addToCartContext(product, quantity);
    window.location.href = '/checkout';
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  // Lightbox handlers
  const openLightbox = () => {
    setIsLightboxOpen(true);
    setZoomLevel(1);
    setLightboxPosition({ x: 0, y: 0 });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setZoomLevel(1);
    setLightboxPosition({ x: 0, y: 0 });
    document.body.style.overflow = 'unset';
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setLightboxPosition({ x: 0, y: 0 });
  };

  // Mouse move for lightbox pan
  const handleLightboxMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setLightboxPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleLightboxMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleLightboxMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse position for hover zoom
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  // Keyboard shortcuts for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  // Real stock availability from Shopify
  const inStock = product.inStock ?? true;
  const sku = product.sku || product.id.toUpperCase();
  
  // Get current page URL for sharing
  const [currentUrl, setCurrentUrl] = useState('');
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);
  
  const shareText = `Check out ${product.name} from Solitario!`;

  // Random jewelry background images from Unsplash
  const jewelryBackgrounds = [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1920&h=1080&fit=crop&q=80',
  ];

  // Get consistent random background based on product ID
  const getBackgroundImage = () => {
    // Simple hash function to get consistent index per product
    let hash = 0;
    for (let i = 0; i < product.id.length; i++) {
      hash = ((hash << 5) - hash) + product.id.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }
    const index = Math.abs(hash) % jewelryBackgrounds.length;
    return jewelryBackgrounds[index];
  };

  const heroBackgroundImage = getBackgroundImage();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[450px] flex items-end overflow-hidden">
        {/* Background Image with Blur */}
        <div className="absolute inset-0 z-0">
          {/* Random jewelry/diamond themed background from Unsplash */}
          <img
            src={heroBackgroundImage}
            alt="Luxury jewelry background"
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-40 transition-all duration-700"
            style={{ zIndex: 0 }}
            draggable={false}
            loading="eager"
            onError={(e) => {
              // Fallback to first image if error
              (e.target as HTMLImageElement).src = jewelryBackgrounds[0];
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/85 z-10" />
        </div>

        {/* Content */}
        <Container className="relative z-10 w-full pb-12 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/80 font-montserrat mb-6">
              <Link href="/" className="hover:text-bronze-gold transition-colors">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-bronze-gold transition-colors">Shop</Link>
              <span>/</span>
              <Link href={`/products?category=${product.category}`} className="hover:text-bronze-gold transition-colors capitalize">
                {product.category}
              </Link>
              <span>/</span>
              <span className="text-white">{product.name}</span>
            </nav>

            {/* Product Title */}
            <h1 className="font-didot text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
              {product.name.toUpperCase()}
            </h1>
          </motion.div>
        </Container>
      </section>

      {/* Product Main Section */}
      <Section variant="light" padding="lg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image with Hover Zoom */}
              <div
                ref={imageRef}
                className="relative aspect-square bg-gradient-to-br from-brand-50 via-white to-brand-50 rounded-brand-xl overflow-hidden border border-brand-200/50 shadow-brand group cursor-zoom-in"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onMouseMove={handleImageMouseMove}
                onClick={openLightbox}
              >
                <div
                  className="relative w-full h-full transition-transform duration-300 ease-out"
                  style={{
                    transform: isHovering ? 'scale(2.5)' : 'scale(1)',
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }}
                >
                  <Image
                    src={productImages[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-contain p-8 select-none"
                    priority
                    draggable={false}
                  />
                </div>
                {/* Zoom Indicator */}
                {isHovering && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-classic-green/80 text-white px-4 py-2 rounded-full text-xs font-gotham backdrop-blur-sm flex items-center gap-2 z-20">
                    <Maximize2 className="w-3 h-3" />
                    Click to zoom
                  </div>
                )}
                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist();
                  }}
                  className="absolute top-4 right-4 w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-brand hover:scale-110 transition-all duration-300 z-10"
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-bronze-gold text-bronze-gold' : 'text-brand-600'}`} />
                </button>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-3">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square flex-1 rounded-brand overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-bronze-gold shadow-brand'
                        : 'border-brand-200 hover:border-bronze-gold/50'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-contain p-2 bg-gradient-to-br from-brand-50 to-white"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category */}
              <div>
                <span className="text-xs uppercase tracking-[0.25em] font-gotham text-bronze-gold">
                  {product.category}
                </span>
              </div>

              {/* Product Name */}
              <h1 className="font-didot text-display-sm md:text-display-md text-brand-800 leading-tight" style={{ letterSpacing: '-0.02em' }}>
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="font-gotham text-3xl font-semibold text-classic-green">
                  {formatPrice(product.price, product.currency)}
                </span>
              </div>

              {/* SKU & Stock */}
              <div className="flex flex-wrap items-center gap-6 text-body-sm">
                <div>
                  <span className="text-brand-600 font-montserrat">SKU: </span>
                  <span className="font-gotham text-brand-800">{sku}</span>
                </div>
                <div className="flex items-center gap-2">
                  {inStock ? (
                    <>
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-success font-montserrat">Available In Stock</span>
                    </>
                  ) : (
                    <span className="text-error font-montserrat">Out of Stock</span>
                  )}
                </div>
              </div>


              {/* Quantity & Actions */}
              <div className="space-y-4">
                <div>
                  <label className="block text-body-sm font-gotham text-brand-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-brand-200 rounded-brand overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-brand-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center border-x border-brand-200 py-2 focus:outline-none focus:ring-2 focus:ring-bronze-gold/30 text-brand-800"
                        min="1"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-2 hover:bg-brand-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description Preview */}
                <p className="text-brand-700 leading-relaxed font-montserrat">
                  {product.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-3 bg-bronze-gold hover:bg-soft-bronze text-white px-8 py-4 font-gotham text-ui uppercase tracking-luxury rounded-brand shadow-brand hover:shadow-gold-glow transition-all duration-500 group"
                  >
                    <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center gap-3 bg-classic-green hover:bg-classic-green/90 text-white px-8 py-4 font-gotham text-ui uppercase tracking-luxury rounded-brand shadow-brand transition-all duration-500"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Social Share - Working Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-brand-200">
                  <span className="text-body-sm text-brand-600 font-montserrat">Share:</span>
                  <div className="flex items-center gap-3">
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-brand-100 hover:bg-bronze-gold hover:text-white flex items-center justify-center transition-all duration-300 text-brand-600"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a 
                      href={`https://www.instagram.com/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-brand-100 hover:bg-bronze-gold hover:text-white flex items-center justify-center transition-all duration-300 text-brand-600"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-brand-100 hover:bg-bronze-gold hover:text-white flex items-center justify-center transition-all duration-300 text-brand-600"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a 
                      href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`Check out this beautiful piece: ${currentUrl}`)}`}
                      className="w-10 h-10 rounded-full bg-brand-100 hover:bg-bronze-gold hover:text-white flex items-center justify-center transition-all duration-300 text-brand-600"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Product Details Tabs */}
      <Section variant="light" padding="lg" className="bg-brand-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex border-b border-brand-300 mb-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'information', label: 'Additional Information' },
                { id: 'reviews', label: 'Reviews' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-4 font-gotham text-ui uppercase tracking-luxury border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-bronze-gold text-bronze-gold'
                      : 'border-transparent text-brand-600 hover:text-brand-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === 'description' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose max-w-none"
                >
                  <h3 className="font-didot text-heading-xl text-brand-800 mb-4">Description</h3>
                  <p className="text-brand-700 leading-relaxed font-montserrat mb-4">
                    {product.description}
                  </p>
                  <p className="text-brand-700 leading-relaxed font-montserrat">
                    Elevate your style with our exquisite {product.name} crafted from high-quality materials. 
                    This piece effortlessly combines timeless elegance with modern sophistication, making it a versatile 
                    accessory for any occasion. Each piece is meticulously handcrafted to ensure exceptional quality and 
                    lasting beauty.
                  </p>
                </motion.div>
              )}

              {activeTab === 'information' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="font-didot text-heading-xl text-brand-800 mb-6">Additional Information</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-bronze-gold mt-0.5 flex-shrink-0" />
                      <span className="text-brand-700 font-montserrat">Crafted from premium lab-grown diamonds, known for their exceptional brilliance and ethical sourcing.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-bronze-gold mt-0.5 flex-shrink-0" />
                      <span className="text-brand-700 font-montserrat">IGI Certified for authenticity and quality assurance.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-bronze-gold mt-0.5 flex-shrink-0" />
                      <span className="text-brand-700 font-montserrat">Hallmarked gold ensuring purity and durability.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-bronze-gold mt-0.5 flex-shrink-0" />
                      <span className="text-brand-700 font-montserrat">Secure clasp ensures a snug fit and easy wear.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-bronze-gold mt-0.5 flex-shrink-0" />
                      <span className="text-brand-700 font-montserrat">Hand-polished to achieve a mirror-like shine that catches the light beautifully.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-bronze-gold mt-0.5 flex-shrink-0" />
                      <span className="text-brand-700 font-montserrat">Lifetime buyback guarantee for your peace of mind.</span>
                    </li>
                  </ul>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h3 className="font-didot text-heading-xl text-brand-800 mb-6">Customer Reviews</h3>
                  
                  {/* No reviews yet message */}
                  <div className="text-center py-12">
                    <p className="text-brand-600 font-montserrat mb-4">No reviews yet for this product.</p>
                    <p className="text-brand-500 font-montserrat text-sm">Be the first to share your experience!</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Featured Collection */}
      {relatedProducts.length > 0 && (
        <Section variant="light" padding="lg" className="bg-white">
          <Container>
            <h2 className="font-didot text-display-sm md:text-display-md text-brand-800 mb-12 text-center" style={{ letterSpacing: '-0.02em' }}>
              Featured Collection
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="relative aspect-square bg-gradient-to-br from-brand-50 via-white to-brand-50 rounded-brand overflow-hidden border border-brand-200/50 shadow-brand hover:shadow-brand-lg transition-all duration-500 mb-4">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                    />
                    <button className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-brand-lg hover:bg-bronze-gold hover:text-white">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-didot text-body-sm md:text-body-md text-brand-800 group-hover:text-bronze-gold transition-colors mb-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="font-gotham text-body-sm font-semibold text-classic-green">
                      {formatPrice(relatedProduct.price, relatedProduct.currency)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Features Section */}
      <Section variant="light" padding="lg" className="bg-brand-50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: 'Quality Products',
                description: 'Presented in an elegant jewelry box, perfect for gifting.',
              },
              {
                icon: RotateCcw,
                title: 'Safe Return Process',
                description: 'Smooth, secure and hassle-free return process.',
              },
              {
                icon: Truck,
                title: 'Fast Delivery',
                description: 'Receive your order faster than ever before!',
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-bronze-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-bronze-gold" />
                </div>
                <h3 className="font-didot text-heading-md text-brand-800 mb-2">{feature.title}</h3>
                <p className="text-brand-600 font-montserrat">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-classic-green/95 backdrop-blur-md flex items-center justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeLightbox();
              }
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 z-30"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 z-30">
              <button
                onClick={handleZoomIn}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center text-white transition-all duration-300"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center text-white transition-all duration-300"
                aria-label="Reset zoom"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <span className="text-white text-sm font-gotham px-2">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>

            {/* Image Container */}
            <div
              ref={lightboxRef}
              className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-move"
              onMouseMove={handleLightboxMouseMove}
              onMouseDown={handleLightboxMouseDown}
              onMouseUp={handleLightboxMouseUp}
              onMouseLeave={handleLightboxMouseUp}
              style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-[90vw] max-h-[90vh]"
                style={{
                  transform: `translate(${lightboxPosition.x}px, ${lightboxPosition.y}px) scale(${zoomLevel})`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                }}
              >
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name}
                  width={1200}
                  height={1200}
                  className="object-contain w-auto h-auto max-w-[90vw] max-h-[90vh]"
                  priority
                />
              </motion.div>
            </div>

            {/* Thumbnail Navigation in Lightbox */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setZoomLevel(1);
                    setLightboxPosition({ x: 0, y: 0 });
                  }}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index
                      ? 'border-bronze-gold shadow-luxury scale-110'
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-contain p-1 bg-white/10"
                  />
                </button>
              ))}
            </div>

            {/* Instructions */}
            {zoomLevel > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-gotham z-30">
                Drag to pan • Press ESC to close
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

