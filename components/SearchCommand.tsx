'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Package, Home, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { products } from '@/lib/data';

export default function SearchCommand() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    const handleSelect = (path: string) => {
        setIsOpen(false);
        router.push(path);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: -20 }}
                        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative z-10"
                    >
                        <div className="flex items-center px-4 py-4 border-b border-zinc-800">
                            <Search className="text-zinc-500 w-5 h-5 mr-3" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search products, categories..."
                                className="flex-1 bg-transparent border-0 outline-none text-white placeholder:text-zinc-500 h-8"
                                autoFocus
                            />
                            <div className="flex items-center gap-1">
                                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">ESC</span>
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-2">
                            {!query && (
                                <div className="p-2">
                                    <div className="text-xs font-bold text-zinc-500 mb-2 px-2">Suggestions</div>
                                    <button onClick={() => handleSelect('/')} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors text-left group">
                                        <Home size={18} />
                                        <span>Home</span>
                                        <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100" />
                                    </button>
                                    <button onClick={() => handleSelect('/products')} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-colors text-left group">
                                        <ShoppingBag size={18} />
                                        <span>All Products</span>
                                        <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100" />
                                    </button>
                                </div>
                            )}

                            {filteredProducts.length > 0 && (
                                <div className="p-2">
                                    <div className="text-xs font-bold text-zinc-500 mb-2 px-2">Products</div>
                                    {filteredProducts.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => handleSelect(`/products/${p.id}`)}
                                            className="w-full flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-zinc-800/50 text-zinc-300 hover:text-white transition-colors text-left group"
                                        >
                                            <img src={p.image} className="w-8 h-8 rounded object-cover bg-zinc-800" />
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{p.name}</div>
                                                <div className="text-xs text-zinc-500">{p.category}</div>
                                            </div>
                                            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {query && filteredProducts.length === 0 && (
                                <div className="py-12 text-center text-zinc-500">
                                    No results found.
                                </div>
                            )}
                        </div>

                        <div className="bg-zinc-950/50 p-2 text-xs text-zinc-500 text-center border-t border-zinc-800">
                            Search powered by Luxe Intelligence
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
