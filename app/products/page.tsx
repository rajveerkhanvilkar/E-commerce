'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Check, Sparkles, Filter, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { products as initialProducts } from '@/lib/data';
import Link from 'next/link';

// 3D Card Component
function ProductCard({ product, handleAddToCart, addedItems, formatPrice }: any) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left - width / 2);
        y.set(clientY - top - height / 2);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-200, 200], [10, -10]);
    const rotateY = useTransform(mouseX, [-200, 200], [-10, 10]);
    const sheenGradient = useMotionTemplate`radial-gradient(
        800px circle at ${mouseX}px ${mouseY}px,
        rgba(255,255,255,0.15),
        transparent 40%
    )`;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            style={{ perspective: 1000 }}
            className="group relative"
        >
            <motion.div
                ref={ref}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative h-full bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-zinc-900/50 hover:shadow-2xl hover:shadow-rose-500/10 transition-shadow duration-500"
            >
                {/* Mouse Sheen Effect */}
                <motion.div
                    style={{ background: sheenGradient }}
                    className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />

                <Link href={`/products/${product.id}`} className="block h-80 overflow-hidden relative cursor-pointer">
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        style={{ translateZ: 50 }}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                            e.preventDefault(); // Prevent navigation
                            handleAddToCart(product);
                        }}
                        style={{ translateZ: 80 }}
                        className="absolute bottom-6 right-6 w-14 h-14 bg-white text-rose-600 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-colors duration-300 z-30"
                    >
                        <ShoppingBag size={24} fill="currentColor" />
                    </motion.button>

                    <motion.div
                        style={{ translateZ: 60 }}
                        className="absolute top-6 left-6"
                    >
                        <span className="bg-white/90 dark:bg-black/90 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-rose-500">
                            {product.category}
                        </span>
                    </motion.div>
                </Link>

                <div className="p-8 relative z-10 bg-white dark:bg-zinc-900 pointer-events-none">
                    <div className="flex justify-between items-start mb-4 pointer-events-auto">
                        <Link href={`/products/${product.id}`}>
                            <motion.h3 style={{ translateZ: 20 }} className="text-xl font-bold text-zinc-900 dark:text-white leading-tight hover:text-rose-500 transition-colors">
                                {product.name}
                            </motion.h3>
                        </Link>
                        <motion.span style={{ translateZ: 20 }} className="text-lg font-bold text-rose-600 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-lg">
                            {formatPrice(product.price)}
                        </motion.span>
                    </div>
                    <motion.p style={{ translateZ: 10 }} className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                        {product.description}
                    </motion.p>

                    <div className="pointer-events-auto">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAddToCart(product)}
                            className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden relative ${addedItems[product.id]
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                                    : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white shadow-lg'
                                }`}
                        >
                            <AnimatePresence mode='wait'>
                                {addedItems[product.id] ? (
                                    <motion.div
                                        key="added"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Check size={18} /> Added
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="add"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="flex items-center gap-2"
                                    >
                                        Add to Cart
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function ProductsPage() {
    const { scrollYProgress } = useScroll();

    // We use a local state for products to simulate loading, but initialize from centralized data
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const { addToCart, itemCount } = useCart();
    const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});

    const categories = ["All", "Accessories", "Electronics", "Fashion", "Home"];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    useEffect(() => {
        // Simulate network delay for premium feel
        setTimeout(() => {
            setProducts(initialProducts);
            setFilteredProducts(initialProducts);
            setLoading(false);
        }, 800);
    }, []);

    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === selectedCategory));
        }
    }, [selectedCategory, products]);

    const handleAddToCart = (product: any) => {
        addToCart(product);
        setAddedItems(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [product.id]: false }));
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 selection:bg-rose-500 selection:text-white">
            <header className="fixed top-0 w-full z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl transition-all duration-300">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
                    <Link href="/" className="flex items-center gap-2 text-zinc-900 dark:text-white hover:opacity-80 transition-opacity group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Home</span>
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
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">Collection</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-lg">
                            Explore our latest arrivals designed to elevate your everyday lifestyle with distinctive quality.
                        </p>
                    </motion.div>

                    {/* Category Filter */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-wrap gap-2"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${selectedCategory === cat
                                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg scale-105'
                                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-[500px] bg-zinc-200 dark:bg-zinc-800 rounded-[2rem] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatePresence mode='popLayout'>
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    handleAddToCart={handleAddToCart}
                                    addedItems={addedItems}
                                    formatPrice={formatPrice}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {filteredProducts.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <h3 className="text-2xl font-bold mb-2">No products found</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">Try selecting a different category.</p>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
