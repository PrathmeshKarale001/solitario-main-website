'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Star, Check, Package, Truck, RotateCcw, Facebook, Instagram, Twitter, Mail, X, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { Section, Container } from '@/components/ui';
import { useCart } from '@/lib/cart-context';
import { NearestStore } from '@/components/stores';

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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const { addToCart: addToCartContext } = useCart();

  // Fetch related products from Shopify
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setIsLoadingRelated(true);
      try {
        const params = new URLSearchParams();
        params.set('category', product.category);
        params.set('exclude', product.id);
        params.set('limit', '6');

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setRelatedProducts(Array.isArray(data?.products) ? data.products : []);
      } catch (error) {
        console.error('Error fetching related products:', error);
        setRelatedProducts([]);
      } finally {
        setIsLoadingRelated(false);
      }
    };

    if (product.category && product.id) {
      fetchRelatedProducts();
    }
  }, [product.category, product.id]);

  // Use real images from Shopify, fallback to single image repeated
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const handleAddToCart = () => {
    addToCartContext(product, quantity);
  };

  const handleBuyNow = () => {
    addToCartContext(product, quantity);
    // Use shop-checkout for the temporary email-based flow
    window.location.href = '/shop-checkout';
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

  // Navigation handlers
  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev + 1) % productImages.length);
    handleResetZoom();
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
    handleResetZoom();
  };

  // Keyboard shortcuts for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
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
  }, [isLightboxOpen, productImages.length]);

  // Real stock availability from Shopify
  const inStock = product.inStock ?? true;
  const sku = product.sku || product.id.toUpperCase();
  
  // Get current page URL for sharing
  const [currentUrl, setCurrentUrl] = useState('');
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);
  
  const shareText = `Check out ${product.name} from Solitario!`;
  
  // Parse Shopify HTML description format
  const parseDescription = (html: string) => {
    if (!html) return { mainText: '', specifications: [] };
    
    // Extract main paragraph text (before Specifications)
    const mainTextMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const mainText = mainTextMatch 
      ? mainTextMatch[1].replace(/<[^>]*>/g, '').trim() 
      : html.replace(/<[^>]*>/g, '').split('Specifications')[0].trim();
    
    // Extract specifications from <li> tags - more robust regex
    const specMatches = html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    const specifications = specMatches.map(li => 
      li.replace(/<\/?[^>]+(>|$)/g, '').trim()
    ).filter(spec => spec.length > 0);
    
    return { mainText, specifications };
  };
  
  const { mainText: descriptionText, specifications } = parseDescription(product.description || '');

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
      {/* Hero Section - Compact with brand pattern */}
      <section className="relative h-[20vh] min-h-[180px] flex items-end overflow-hidden bg-classic-green">
        {/* Brand Pattern Background */}
        <div className="absolute inset-0 z-0">
          {/* Diamond pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30L30 0z' fill='%23ffffff' fill-opacity='0.4'/%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px',
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-classic-green via-classic-green/95 to-teal/90" />
        </div>

        {/* Content */}
        <Container className="relative z-10 w-full pb-6 md:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-white/70 font-montserrat mb-3">
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

            {/* Product Title - 10% smaller */}
            <h1 className="font-playfair text-xl md:text-2xl lg:text-3xl text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
              {product.name.toUpperCase()}
            </h1>
          </motion.div>
        </Container>
      </section>

      {/* Product Main Section */}
      <Section variant="light" padding="lg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-16">
            {/* Product Images */}
            <div className="space-y-3 md:space-y-4">
              {/* Main Image with Hover Zoom */}
              <div
                ref={imageRef}
                className="relative aspect-square bg-gradient-to-br from-brand-50 via-white to-brand-50 rounded-xl md:rounded-brand-xl overflow-hidden border border-brand-200/50 shadow-brand group cursor-zoom-in max-w-full"
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
                    className="object-contain p-4 md:p-8 select-none"
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
                  className="absolute top-2 right-2 md:top-4 md:right-4 w-10 h-10 md:w-12 md:h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-brand hover:scale-110 transition-all duration-300 z-10"
                  aria-label="Add to wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-bronze-gold text-bronze-gold' : 'text-brand-600'}`} />
                </button>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square w-16 h-16 md:w-auto md:h-auto md:flex-1 flex-shrink-0 rounded-lg md:rounded-brand overflow-hidden border-2 transition-all duration-300 ${
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
              <h1 className="font-playfair text-2xl md:text-3xl text-brand-800 leading-tight" style={{ letterSpacing: '-0.02em' }}>
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="font-gotham text-2xl md:text-3xl font-semibold text-classic-green">
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

                {/* Description Text with Read More */}
                {descriptionText && (
                  <div>
                    <p className={`text-brand-700 leading-relaxed font-montserrat text-sm md:text-base ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                      {descriptionText}
                    </p>
                    {descriptionText.length > 150 && (
                      <button
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="text-bronze-gold text-sm font-montserrat mt-1 hover:underline"
                      >
                        {isDescriptionExpanded ? 'Show Less' : 'Read More'}
                      </button>
                    )}
                  </div>
                )}
                
                {/* Specifications - Highlighted */}
                {specifications.length > 0 && (
                  <div className="mt-4 bg-brand-50 border border-bronze-gold/20 rounded-xl p-4">
                    <h4 className="font-gotham text-sm uppercase tracking-wider text-bronze-gold mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-bronze-gold rounded-full"></span>
                      Specifications
                    </h4>
                    <ul className="space-y-2 text-brand-800 font-montserrat text-sm">
                      {specifications.map((spec, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-classic-green mt-0.5">✓</span>
                          <span className="font-medium">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 md:gap-3 bg-bronze-gold hover:bg-soft-bronze text-white px-6 md:px-8 py-3 md:py-4 font-gotham text-xs md:text-ui uppercase tracking-wider md:tracking-luxury rounded-lg md:rounded-brand shadow-brand hover:shadow-gold-glow transition-all duration-500 group"
                  >
                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 flex items-center justify-center gap-2 md:gap-3 bg-classic-green hover:bg-classic-green/90 text-white px-6 md:px-8 py-3 md:py-4 font-gotham text-xs md:text-ui uppercase tracking-wider md:tracking-luxury rounded-lg md:rounded-brand shadow-brand transition-all duration-500"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Nearest Store CTA */}
                <NearestStore compact={true} />

                {/* Social Share - Working Links */}
                <div className="flex items-center gap-3 md:gap-4 pt-4 border-t border-brand-200">
                  <span className="text-body-sm text-brand-600 font-montserrat">Share:</span>
                  <div className="flex items-center gap-3">
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-brand-100 hover:bg-bronze-gold hover:text-white flex items-center justify-center transition-all duration-300 text-brand-600"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a 
                      href={`https://www.instagram.com/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-brand-100 hover:bg-bronze-gold hover:text-white flex items-center justify-center transition-all duration-300 text-brand-600"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-brand-100 hover:bg-bronze-gold hover:text-white flex items-center justify-center transition-all duration-300 text-brand-600"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a 
                      href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`Check out this beautiful piece: ${currentUrl}`)}`}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-brand-100 hover:bg-bronze-gold hover:text-white flex items-center justify-center transition-all duration-300 text-brand-600"
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

      {/* Product Details Tabs - Reduced gap */}
      <Section variant="light" padding="sm" className="bg-brand-50 pt-0">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex border-b border-brand-300 mb-6 md:mb-8 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {[
                { id: 'description', label: 'Description' },
                { id: 'information', label: 'Additional Information' },
                { id: 'reviews', label: 'Reviews' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 md:px-8 py-3 md:py-4 font-gotham text-[10px] md:text-ui uppercase tracking-wider md:tracking-luxury border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
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
                  <h3 className="font-playfair text-heading-lg text-brand-800 mb-4">Description</h3>
                  <p className="text-brand-700 leading-relaxed font-montserrat text-sm md:text-base mb-4">
                    {descriptionText}
                  </p>
                  <p className="text-brand-700 leading-relaxed font-montserrat text-sm md:text-base mb-6">
                    Elevate your style with our exquisite {product.name} crafted from high-quality materials. 
                    This piece effortlessly combines timeless elegance with modern sophistication, making it a versatile 
                    accessory for any occasion. Each piece is meticulously handcrafted to ensure exceptional quality and 
                    lasting beauty.
                  </p>
                  
                  {/* Specifications - Highlighted in Description Tab */}
                  {specifications.length > 0 && (
                    <div className="mb-6 bg-brand-50 border border-bronze-gold/20 rounded-xl p-5">
                      <h4 className="font-gotham text-sm uppercase tracking-wider text-bronze-gold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-bronze-gold rounded-full"></span>
                        Specifications
                      </h4>
                      <ul className="space-y-2 text-brand-800 font-montserrat text-sm md:text-base">
                        {specifications.map((spec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-classic-green mt-0.5">✓</span>
                            <span className="font-medium">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Buy Now CTA in Description */}
                  <div className="mt-6 pt-6 border-t border-brand-200">
                    <button
                      onClick={handleBuyNow}
                      className="w-full sm:w-auto flex items-center justify-center gap-3 bg-classic-green hover:bg-classic-green/90 text-white px-8 py-4 font-gotham text-ui uppercase tracking-luxury rounded-brand shadow-brand transition-all duration-500"
                    >
                      Buy Now
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'information' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="font-playfair text-heading-xl text-brand-800 mb-6">Additional Information</h3>
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
                  <h3 className="font-playfair text-heading-xl text-brand-800 mb-6">Customer Reviews</h3>
                  
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
      <Section variant="light" padding="lg" className="bg-white">
        <Container>
          <h2 className="font-playfair text-display-sm md:text-display-md text-brand-800 mb-12 text-center" style={{ letterSpacing: '-0.02em' }}>
            Featured Collection
          </h2>
          
          {isLoadingRelated ? (
            // Loading skeleton
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="relative aspect-square bg-gray-200 rounded-brand mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
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
                    <h3 className="font-playfair text-body-sm md:text-body-md text-brand-800 group-hover:text-bronze-gold transition-colors mb-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="font-gotham text-body-sm font-semibold text-classic-green">
                      {formatPrice(relatedProduct.price, relatedProduct.currency)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // No related products found
            <div className="text-center py-12">
              <p className="text-brand-600 font-montserrat">No related products found.</p>
            </div>
          )}
        </Container>
      </Section>

      {/* Features Section - Horizontal Scroll Loop */}
      <Section variant="light" padding="sm" className="bg-brand-50 py-6 sm:py-8 overflow-hidden">
        <Container className="relative">
          <div 
            className="overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            }}
          >
            <div className="flex gap-6 animate-scroll-features">
              {/* Duplicate items for seamless loop */}
              {[...Array(2)].map((_, setIndex) => (
                [
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
                  <div 
                    key={`${setIndex}-${index}`} 
                    className="flex-shrink-0 w-64 bg-white rounded-xl p-5 border border-brand-200 shadow-sm text-center"
                  >
                    <div className="w-12 h-12 bg-bronze-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <feature.icon className="w-6 h-6 text-bronze-gold" />
                    </div>
                    <h3 className="font-playfair text-base text-brand-800 mb-1">{feature.title}</h3>
                    <p className="text-brand-600 font-montserrat text-xs">{feature.description}</p>
                  </div>
                ))
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Lightbox Modal - Redesigned */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-xl flex items-center justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeLightbox();
              }
            }}
          >
            {/* Top Bar - Controls */}
            <div className="absolute top-0 left-0 right-0 p-3 md:p-6 flex justify-between items-center z-50 pointer-events-none">
               <div className="pointer-events-auto bg-white/80 backdrop-blur-md rounded-full px-3 md:px-4 py-1.5 md:py-2 shadow-sm border border-brand-100 flex items-center gap-2 md:gap-4">
                 <span className="text-brand-500 font-gotham text-xs md:text-sm tracking-widest">
                   {selectedImage + 1} / {productImages.length}
                 </span>
               </div>
               
               <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
                 {/* Zoom controls - hidden on mobile */}
                 <div className="hidden md:flex bg-white/80 backdrop-blur-md rounded-full p-1.5 shadow-sm border border-brand-100 items-center gap-1">
                    <button
                      onClick={handleZoomIn}
                      className="p-2.5 hover:bg-brand-50 rounded-full text-brand-600 transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 1}
                      className="p-2.5 hover:bg-brand-50 rounded-full text-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-brand-200 mx-1" />
                    <button
                      onClick={handleResetZoom}
                      className="p-2.5 hover:bg-brand-50 rounded-full text-brand-600 transition-colors"
                      title="Reset View"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                 </div>

                 <button
                   onClick={closeLightbox}
                   className="w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-md hover:bg-brand-50 rounded-full flex items-center justify-center text-brand-800 transition-all duration-300 border border-brand-100 shadow-sm"
                   title="Close"
                 >
                   <X className="w-5 h-5 md:w-6 md:h-6" />
                 </button>
               </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-white/80 backdrop-blur-md hover:bg-white text-brand-800 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border border-brand-100 z-40 group"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={handleNextImage}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 bg-white/80 backdrop-blur-md hover:bg-white text-brand-800 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border border-brand-100 z-40 group"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Main Image Container */}
            <div
              ref={lightboxRef}
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              onMouseMove={handleLightboxMouseMove}
              onMouseDown={handleLightboxMouseDown}
              onMouseUp={handleLightboxMouseUp}
              onMouseLeave={handleLightboxMouseUp}
              style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative max-w-[85vw] max-h-[85vh]"
                style={{
                  transform: `translate(${lightboxPosition.x}px, ${lightboxPosition.y}px) scale(${zoomLevel})`,
                  transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)',
                }}
              >
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name}
                  width={1600}
                  height={1600}
                  className="object-contain w-auto h-auto max-w-[85vw] max-h-[85vh] drop-shadow-2xl"
                  priority
                  draggable={false}
                />
              </motion.div>
            </div>

            {/* Bottom Strip - Thumbnails */}
            <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] md:max-w-[90vw]">
              <div className="bg-white/80 backdrop-blur-md rounded-xl md:rounded-2xl p-1.5 md:p-2 shadow-lg border border-brand-100 flex gap-1.5 md:gap-2 overflow-x-auto no-scrollbar">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(index);
                      handleResetZoom();
                    }}
                    className={`relative w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden transition-all duration-300 flex-shrink-0 ${
                      selectedImage === index
                        ? 'ring-2 ring-bronze-gold ring-offset-2 opacity-100 scale-105'
                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover bg-white"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

