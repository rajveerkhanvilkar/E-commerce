'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, ShieldCheck, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, cartTotal } = useCart();
    const router = useRouter();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 selection:bg-rose-500 selection:text-white">
            <header className="fixed top-0 w-full z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
                    <Link href="/products" className="flex items-center gap-2 text-zinc-900 dark:text-white hover:opacity-80 transition-opacity group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Continue Shopping</span>
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 container mx-auto max-w-5xl">
                <div className="flex items-end justify-between mb-10">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">Shopping <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">Cart</span></h1>
                    <span className="text-zinc-500 font-medium">{items.length} Items</span>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-6">
                        <AnimatePresence mode='popLayout'>
                            {items.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center py-20 bg-white dark:bg-zinc-900/50 rounded-[2rem] border border-dashed border-zinc-200 dark:border-zinc-800"
                                >
                                    <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-400">
                                        <ShoppingBag size={32} />
                                    </div>
                                    <p className="text-xl text-zinc-500 mb-6 font-medium">Your cart is currently empty.</p>
                                    <Link href="/products" className="inline-block px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all">
                                        Browse Collection
                                    </Link>
                                </motion.div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className="flex gap-6 p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-zinc-200 dark:hover:border-zinc-700 transition-all group"
                                    >
                                        <div className="w-28 h-28 rounded-2xl overflow-hidden bg-zinc-100 relative shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-xl leading-tight mb-1">{item.name}</h3>
                                                    <p className="text-sm text-zinc-500">Premium Selection</p>
                                                </div>
                                                <p className="font-bold text-xl">{formatPrice(item.price * item.quantity)}</p>
                                            </div>

                                            <div className="flex justify-between items-end mt-4">
                                                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl p-1.5 border border-zinc-100 dark:border-zinc-700">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-700 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-700 rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>

                    {items.length > 0 && (
                        <div className="md:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="sticky top-32 p-8 bg-black dark:bg-white text-white dark:text-zinc-900 rounded-[2.5rem] shadow-2xl shadow-zinc-900/20 dark:shadow-white/5 overflow-hidden relative"
                            >
                                {/* Background Gradient */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                                <h3 className="text-2xl font-black mb-8 relative z-10">Summary</h3>

                                <div className="space-y-4 mb-8 relative z-10 text-white/80 dark:text-zinc-600">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-white dark:text-zinc-900">{formatPrice(cartTotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-emerald-400 dark:text-emerald-500 font-bold">Free</span>
                                    </div>
                                    <div className="pt-6 border-t border-white/10 dark:border-zinc-200 flex justify-between text-xl font-bold text-white dark:text-zinc-900">
                                        <span>Total</span>
                                        <span>{formatPrice(cartTotal)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push('/checkout')}
                                    className="relative z-10 w-full py-4 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-xl font-bold hover:shadow-lg hover:shadow-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Proceed to Checkout
                                    <ArrowLeft size={18} className="rotate-180" />
                                </button>

                                <div className="flex items-center justify-center gap-2 text-xs text-white/40 dark:text-zinc-400 mt-6 relative z-10">
                                    <ShieldCheck size={14} />
                                    <span>Encrypted & Secure</span>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
