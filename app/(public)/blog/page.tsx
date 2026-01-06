'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Sparkles, Star, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import BlurText from '@/components/ui/BlurText';


// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

const BLOG_POSTS = [
  {
    id: 'celebrities-lab-grown',
    title: 'Why Celebrities Are Opting for Lab-Grown Diamonds',
    excerpt: 'Celebrities like Zendaya, Alia Bhatt, and Leonardo DiCaprio opt for lab-grown diamonds for their ethical, eco-friendly, and customizable luxury appeal.',
    image: '/solitario/blog/celebrities.jpg',
    date: 'December 2024',
    readTime: '5 min read',
    featured: true,
    content: {
      intro: 'Celebrities are increasingly turning to lab-grown diamonds because they align with their values and lifestyle choices. One of the primary reasons is the ethical aspect.',
      celebrities: [
        { name: 'Meghan Markle', note: 'Prominent supporter of ethical and sustainable choices' },
        { name: 'Leonardo DiCaprio', note: 'Major investor in lab-grown diamond brand' },
        { name: 'Emma Watson', note: 'Known for commitment to sustainable fashion' },
        { name: 'Billie Eilish', note: 'Spotted wearing lab-grown diamonds at 2023 Grammys' },
        { name: 'Zendaya', note: 'Wore lab-grown diamond ring at Met Gala' },
        { name: 'Ananya Pandey', note: 'Spotted wearing lab-grown diamond necklace' },
        { name: 'Alia Bhatt', note: 'Spotted wearing lab-grown diamond earrings at Lakme Fashion Week' },
      ],
      highlight: 'PM Narendra Modi gifted a 7.5-carat lab-grown diamond to Jill Biden during his 2023 US state visit.',
    },
  },
  {
    id: 'myths-lab-grown',
    title: 'Bursting These 5 Myths About Lab Grown Diamonds',
    excerpt: 'For centuries, we\'ve been given to believe that diamonds are found only deep underground. Let\'s debunk five common myths about lab-grown diamonds.',
    image: '/solitario/blog/myths.jpg',
    date: 'November 2024',
    readTime: '4 min read',
    featured: false,
  },
  {
    id: 'lab-vs-mined',
    title: 'Lab Grown Diamonds vs Mined Diamonds: The Complete Guide',
    excerpt: 'They say everything natural has an incomparable charm. While we don\'t deny that, it may not apply to diamonds. Here\'s why lab-grown diamonds are the future.',
    image: '/solitario/blog/lab-vs-mined.jpg',
    date: 'October 2024',
    readTime: '6 min read',
    featured: false,
  },
  {
    id: 'engagement-ring-guide',
    title: 'How to Choose the Perfect Lab-Grown Diamond Engagement Ring',
    excerpt: 'Your complete guide to selecting the ideal lab-grown diamond engagement ring. From the 4Cs to settings, we cover everything you need to know.',
    image: '/solitario/blog/celebrities.jpg',
    date: 'October 2024',
    readTime: '7 min read',
    featured: false,
  },
  {
    id: 'sustainability-diamonds',
    title: 'The Environmental Impact: Why Lab-Grown Diamonds Are Sustainable',
    excerpt: 'Discover how lab-grown diamonds are revolutionizing the jewelry industry with their minimal environmental footprint and ethical production.',
    image: '/solitario/blog/myths.jpg',
    date: 'September 2024',
    readTime: '5 min read',
    featured: false,
  },
  {
    id: 'diamond-certification',
    title: 'Understanding Diamond Certification: IGI vs GIA for Lab-Grown',
    excerpt: 'Learn about diamond certification standards and why IGI certification is the gold standard for lab-grown diamonds worldwide.',
    image: '/solitario/blog/lab-vs-mined.jpg',
    date: 'September 2024',
    readTime: '4 min read',
    featured: false,
  },
  {
    id: 'investment-value',
    title: 'Are Lab-Grown Diamonds a Good Investment in 2024?',
    excerpt: 'Exploring the value proposition of lab-grown diamonds and why they offer exceptional quality at accessible prices.',
    image: '/solitario/blog/celebrities.jpg',
    date: 'August 2024',
    readTime: '6 min read',
    featured: false,
  },
  {
    id: 'wedding-trends',
    title: 'Lab-Grown Diamond Wedding Trends for Modern Couples',
    excerpt: 'From solitaires to halo settings, discover the latest wedding jewelry trends featuring stunning lab-grown diamonds.',
    image: '/solitario/blog/myths.jpg',
    date: 'August 2024',
    readTime: '5 min read',
    featured: false,
  },
  {
    id: 'care-maintenance',
    title: 'How to Care for Your Lab-Grown Diamond Jewelry',
    excerpt: 'Expert tips on cleaning, storing, and maintaining your lab-grown diamond pieces to keep them sparkling for generations.',
    image: '/solitario/blog/lab-vs-mined.jpg',
    date: 'July 2024',
    readTime: '4 min read',
    featured: false,
  },
  {
    id: 'technology-creation',
    title: 'The Science Behind Lab-Grown Diamonds: CVD vs HPHT',
    excerpt: 'A deep dive into the cutting-edge technology used to create lab-grown diamonds that are identical to mined diamonds.',
    image: '/solitario/blog/celebrities.jpg',
    date: 'July 2024',
    readTime: '8 min read',
    featured: false,
  },
];

const CELEBRITY_HIGHLIGHTS = [
  { name: 'Meghan Markle', image: '/solitario/featured/overlay1.jpg' },
  { name: 'Leonardo DiCaprio', image: '/solitario/featured/overlay2.jpg' },
  { name: 'Zendaya', image: '/solitario/featured/overlay3.jpg' },
];

export default function BlogPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const featuredPost = BLOG_POSTS.find(post => post.featured);

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Hero Section */}
      <section ref={sectionRef} className="relative min-h-[80vh] md:min-h-[91vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-gray-900/60 to-black/80 z-10" />
          <Image
            src="/solitario/blog/celebrities.jpg"
            alt="Bling Blogs"
            fill
            className="object-cover object-center"
            priority
            quality={85}
            sizes="100vw"
          />
        </motion.div>

        <motion.div
          className="relative z-10 text-center px-4 pt-24 md:pt-32"
          style={{ y: textY }}
        >
          <div className="max-w-5xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block text-bronze-gold text-xs md:text-sm uppercase tracking-[0.3em] font-gotham mb-4"
            >
              Bling Blogs
            </motion.span>

            <h1
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-playfair text-white leading-[1.1] tracking-tight px-4"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              }}
            >
              <span className="inline-block">
                <BlurText
                  text="Stories"
                  className="font-playfair"
                  animateBy="characters"
                  direction="top"
                  delay={50}
                  stepDuration={0.3}
                />
                {" "}
                <BlurText
                  text="That"
                  className="font-playfair"
                  animateBy="characters"
                  direction="top"
                  delay={200}
                  stepDuration={0.5}
                />
                {" "}
                <BlurText
                  text="Sparkle"
                  className="font-playfair"
                  animateBy="characters"
                  direction="top"
                  delay={350}
                  stepDuration={0.7}
                />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-6 text-sm md:text-base lg:text-lg text-white/80 font-montserrat max-w-2xl mx-auto"
            >
              Discover the world of lab-grown diamonds through our curated stories, celebrity spotlights, and industry insights.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative aspect-[4/3] md:aspect-auto">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-bronze-gold text-white text-xs font-gotham uppercase tracking-wider rounded-full">
                      <Star className="w-3 h-3" /> Featured
                    </span>
                  </div>
                </div>
                <div className="bg-classic-green p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-white/70 text-sm font-montserrat mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-playfair text-white mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-white/80 font-montserrat mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  {/* Celebrity Highlight */}
                  {featuredPost.content && (
                    <div className="bg-white/10 border border-white/20 rounded-xl p-4 mb-6">
                      <p className="text-bronze-gold text-sm font-montserrat font-medium">
                        <Sparkles className="w-4 h-4 inline mr-2" />
                        {featuredPost.content.highlight}
                      </p>
                    </div>
                  )}

                  <Link
                    href={`/blog/${featuredPost.id}`}
                    className="inline-flex items-center gap-2 text-bronze-gold hover:text-white font-gotham uppercase tracking-wider text-sm transition-colors group"
                  >
                    Read Full Story
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Celebrity Spotlights */}
      <section className="py-16 px-4 bg-brand-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-classic-green text-xs uppercase tracking-[0.3em] font-gotham mb-4">
              Celebrity Spotlight
            </span>
            <h2 className="text-3xl md:text-4xl font-playfair text-brand-800">
              Stars Who <span className="text-classic-green">Shine</span> With Us
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {featuredPost?.content?.celebrities.map((celeb, idx) => (
              <motion.div
                key={celeb.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center group"
              >
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-classic-green/10 border-2 border-classic-green/30 flex items-center justify-center group-hover:border-classic-green/60 transition-colors">
                  <Users className="w-8 h-8 text-classic-green/60" />
                </div>
                <h4 className="text-brand-800 text-sm font-playfair mb-1">{celeb.name}</h4>
                <p className="text-brand-500 text-xs font-montserrat leading-tight">{celeb.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Blog Posts */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-brand-800">
              Latest <span className="text-classic-green">Articles</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group rounded-2xl overflow-hidden bg-brand-50 border border-brand-200 hover:border-classic-green/30 hover:shadow-brand-lg transition-all duration-500"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-brand-500 text-xs font-montserrat mb-3">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-playfair text-brand-800 mb-3 group-hover:text-classic-green transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-brand-600 text-sm font-montserrat mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-classic-green text-sm font-gotham uppercase tracking-wider group-hover:gap-3 transition-all"
                  >
                    Read More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-classic-green">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-playfair text-white mb-6">
              Stay <span className="text-bronze-gold">Updated</span>
            </h2>
            <p className="text-white/80 font-montserrat mb-8">
              Subscribe to receive our latest stories, exclusive offers, and diamond insights.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 text-classic-green font-gotham uppercase tracking-[0.25em] text-sm rounded-lg bg-white hover:bg-ivory-pearl transition-all duration-500 hover:scale-105"
            >
              Subscribe Now <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
