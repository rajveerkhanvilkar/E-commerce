'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Star, Share2, Heart, Check, ChevronRight, ShieldCheck, Box, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { products } from '@/lib/data';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { addToCart, itemCount } = useCart();
    const [activeTab, setActiveTab] = useState('description');
    const [added, setAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    // Find product
    const product = products.find(p => p.id === id);
    const relatedProducts = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 3);

    // Parallax Image
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

    useEffect(() => {
        if (!product && !loading) {
            // Redirect if not found
            router.push('/products');
        }
        setLoading(false);
    }, [product, loading, router]);

    if (!product) return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
    );

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 selection:bg-rose-500 selection:text-white">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
                    <Link href="/products" className="flex items-center gap-2 text-zinc-900 dark:text-white hover:opacity-80 transition-opacity group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">All Products</span>
                    </Link>
                    <Link href="/cart" className="flex items-center gap-2 group">
                        <div className="relative p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30 transition-colors">
                            <ShoppingBag size={20} className="group-hover:text-rose-600 transition-colors" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-zinc-900">
                                    {itemCount}
                                </span>
                            )}
                        </div>
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left: Product Image */}
                    <div className="relative h-[500px] lg:h-[700px] rounded-[3rem] overflow-hidden group">
                        <motion.div style={{ y }} className="absolute inset-0">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </motion.div>
                        <div className="absolute top-6 left-6 z-10">
                            <span className="bg-white/90 dark:bg-black/90 backdrop-blur-md text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider text-rose-500 shadow-xl">
                                {product.category}
                            </span>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 bg-yellow-400/10 text-yellow-500 px-3 py-1 rounded-full w-fit">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-sm font-bold">{product.rating} ({product.reviews} reviews)</span>
                                </div>
                                <div className="flex gap-4">
                                    <button className="p-3 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-rose-500">
                                        <Heart size={20} />
                                    </button>
                                    <button className="p-3 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-blue-500">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight">{product.name}</h1>
                            <p className="text-3xl md:text-4xl font-bold text-rose-500 mb-8">{formatPrice(product.price)}</p>

                            <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed mb-10">
                                {product.description}
                            </p>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                {product.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-4 sm:w-40 border border-zinc-200 dark:border-zinc-700">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-700 rounded-lg shadow-sm hover:scale-110 transition-transform"
                                    >
                                        -
                                    </button>
                                    <span className="font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-700 rounded-lg shadow-sm hover:scale-110 transition-transform"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden relative shadow-xl ${added
                                            ? 'bg-emerald-500 text-white shadow-emerald-500/30 ring-4 ring-emerald-500/20'
                                            : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white shadow-rose-500/20'
                                        }`}
                                >
                                    <AnimatePresence mode='wait'>
                                        {added ? (
                                            <motion.div
                                                key="added"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -20, opacity: 0 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Check size={24} /> Added to Cart
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="add"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -20, opacity: 0 }}
                                                className="flex items-center gap-2"
                                            >
                                                <ShoppingBag size={24} /> Add to Cart - {formatPrice(product.price * quantity)}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex justify-between border-t border-zinc-200 dark:border-zinc-800 pt-8 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    <Truck className="text-zinc-400" size={24} />
                                    <span className="text-xs font-bold uppercase text-zinc-500">Free Ship</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <ShieldCheck className="text-zinc-400" size={24} />
                                    <span className="text-xs font-bold uppercase text-zinc-500">2 Yr Warranty</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <Box className="text-zinc-400" size={24} />
                                    <span className="text-xs font-bold uppercase text-zinc-500">Free Return</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-20 lg:mt-32">
                    <div className="flex justify-center mb-12 border-b border-zinc-200 dark:border-zinc-800">
                        {['description', 'specs', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-4 text-sm font-bold uppercase tracking-widest relative transition-colors ${activeTab === tab ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-500"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <AnimatePresence mode='wait'>
                            {activeTab === 'specs' && (
                                <motion.div
                                    key="specs"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-8 lg:p-12 border border-zinc-200 dark:border-zinc-800"
                                >
                                    <h3 className="text-2xl font-bold mb-8">Technical Specifications</h3>
                                    <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
                                        {Object.entries(product.specs).map(([key, value]) => (
                                            <div key={key} className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
                                                <span className="font-medium text-zinc-500">{key}</span>
                                                <span className="font-bold text-zinc-900 dark:text-white">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            {activeTab === 'description' && (
                                <motion.div
                                    key="description"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-center max-w-2xl mx-auto"
                                >
                                    <h3 className="text-2xl font-bold mb-6">Designed for Excellence</h3>
                                    <p className="text-zinc-500 dark:text-zinc-400 leading-loose text-lg">
                                        {product.description} Crafted with precision engineering and premium materials, the {product.name} stands as a testament to our commitment to quality. Whether you're using it for professional work or daily leisure, it delivers uncompromising performance.
                                    </p>
                                </motion.div>
                            )}
                            {activeTab === 'reviews' && (
                                <motion.div
                                    key="reviews"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-center gap-4 mb-12">
                                        <div className="text-6xl font-black text-rose-500">{product.rating}</div>
                                        <div>
                                            <div className="flex text-yellow-500 mb-1">
                                                {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={20} />)}
                                            </div>
                                            <p className="text-zinc-500 font-bold">{product.reviews} Verified Reviews</p>
                                        </div>
                                    </div>

                                    {/* Mock Reviews */}
                                    {[1, 2].map((i) => (
                                        <div key={i} className="bg-white dark:bg-zinc-900/50 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                            <div className="flex justify-between mb-4">
                                                <div className="font-bold">Verified User</div>
                                                <div className="text-zinc-400 text-sm">2 days ago</div>
                                            </div>
                                            <p className="text-zinc-600 dark:text-zinc-400 italic">"Absolutely amazing product. The quality is unmatched and shipping was incredibly fast. Highly recommended!"</p>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-32">
                    <h2 className="text-3xl font-black mb-12">You Might Also Like</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {relatedProducts.map((p) => (
                            <Link href={`/products/${p.id}`} key={p.id} className="group block">
                                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden mb-4 relative bg-zinc-100 dark:bg-zinc-800">
                                    <img src={p.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={p.name} />
                                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                        <div className="flex justify-between items-end text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                                            <span className="font-bold">View Details</span>
                                            <ArrowLeft className="rotate-180" />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                                <p className="text-zinc-500 font-medium">{formatPrice(p.price)}</p>
                            </Link>
                        ))}
                    </div>
                </div>

            </main>
        </div>
    );
}
