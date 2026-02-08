'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle, Smartphone, Globe, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Card State
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                clearCart();
                router.push('/');
            }, 3000);
        }, 2000);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center font-sans text-white p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950"></div>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-12 text-center relative z-10"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                    >
                        <CheckCircle size={48} className="text-white" />
                    </motion.div>
                    <h2 className="text-4xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-emerald-400">Payment <br />Successful</h2>
                    <p className="text-zinc-400 mb-8 text-lg">
                        Your order is on its way. <br />Redirecting you home...
                    </p>
                    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3 }}
                            className="h-full bg-emerald-500"
                        />
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 selection:bg-rose-500 selection:text-white">
            <header className="fixed top-0 w-full z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
                    <Link href="/cart" className="flex items-center gap-2 text-zinc-900 dark:text-white hover:opacity-80 transition-opacity group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Cart</span>
                    </Link>
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                        <ShieldCheck size={16} />
                        <span>Secure SSL</span>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 container mx-auto max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Left Column: Virtual Card & Summary */}
                    <div className="space-y-8 lg:sticky lg:top-32">
                        <div className="perspective-1000 w-full h-64 md:h-72">
                            <motion.div
                                className="relative w-full h-full preserve-3d transition-transform duration-700"
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {/* Front of Card */}
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black rounded-[2rem] p-8 text-white shadow-2xl shadow-zinc-900/30 overflow-hidden backface-hidden border border-white/10">
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[60px] -translate-x-1/2 translate-y-1/2"></div>

                                    <div className="relative z-10 flex flex-col justify-between h-full">
                                        <div className="flex justify-between items-start">
                                            <Globe size={32} className="text-white/50" />
                                            <span className="font-mono text-xl italic font-bold tracking-widest text-white/80">VISA</span>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-1">
                                                <span className="text-xs uppercase text-white/40 tracking-widest">Card Number</span>
                                                <p className="font-mono text-2xl md:text-3xl tracking-widest drop-shadow-md">
                                                    {cardNumber || "0000 0000 0000 0000"}
                                                </p>
                                            </div>
                                            <div className="flex justify-between">
                                                <div>
                                                    <span className="text-xs uppercase text-white/40 tracking-widest">Card Holder</span>
                                                    <p className="font-medium uppercase tracking-wider">{cardName || "YOUR NAME"}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs uppercase text-white/40 tracking-widest">Expires</span>
                                                    <p className="font-mono">{cardExpiry || "MM/YY"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Back of Card */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black rounded-[2rem] overflow-hidden backface-hidden border border-white/10 shadow-2xl"
                                    style={{ transform: "rotateY(180deg)" }}
                                >
                                    <div className="w-full h-16 bg-black mt-8"></div>
                                    <div className="p-8">
                                        <div className="bg-white h-12 rounded flex items-center justify-end px-4">
                                            <span className="font-mono text-zinc-900 font-bold text-xl tracking-widest">{cardCvc || "123"}</span>
                                        </div>
                                        <p className="text-white/40 text-xs mt-4">
                                            This is a secure 256-bit SSL encrypted payment. Your data is safe.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Order Total */}
                        <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-zinc-500">Total to pay</span>
                                <span className="text-4xl font-black">{formatPrice(cartTotal)}</span>
                            </div>
                            <div className="flex gap-2 text-sm text-zinc-400">
                                <Lock size={14} /> Guaranteed safe checkout
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div>
                        <div className="mb-8">
                            <h1 className="text-3xl font-black mb-2">Payment Details</h1>
                            <p className="text-zinc-500 dark:text-zinc-400">Complete your purchase by providing your payment details.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">Cardholder Name</label>
                                    <input
                                        type="text"
                                        maxLength={24}
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        onFocus={() => setIsFlipped(false)}
                                        required
                                        className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-0 rounded-xl px-6 py-4 font-medium focus:ring-2 focus:ring-rose-500 transition-all placeholder:text-zinc-400"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold ml-1">Card Number</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                                        <input
                                            type="text"
                                            maxLength={19}
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                                            onFocus={() => setIsFlipped(false)}
                                            required
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-0 rounded-xl pl-14 pr-6 py-4 font-mono text-lg focus:ring-2 focus:ring-rose-500 transition-all placeholder:text-zinc-400"
                                            placeholder="0000 0000 0000 0000"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">Expiry Date</label>
                                        <input
                                            type="text"
                                            maxLength={5}
                                            value={cardExpiry}
                                            onChange={(e) => setCardExpiry(e.target.value)}
                                            onFocus={() => setIsFlipped(false)}
                                            required
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-0 rounded-xl px-6 py-4 font-mono text-lg focus:ring-2 focus:ring-rose-500 transition-all placeholder:text-zinc-400"
                                            placeholder="MM/YY"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1">CVC / CVV</label>
                                        <input
                                            type="text"
                                            maxLength={3}
                                            value={cardCvc}
                                            onChange={(e) => setCardCvc(e.target.value)}
                                            onFocus={() => setIsFlipped(true)}
                                            required
                                            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border-0 rounded-xl px-6 py-4 font-mono text-lg focus:ring-2 focus:ring-rose-500 transition-all placeholder:text-zinc-400"
                                            placeholder="123"
                                        />
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-rose-500/20 transition-all disabled:opacity-70 flex items-center justify-center gap-3 relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {loading ? (
                                        "Processing Secure Payment..."
                                    ) : (
                                        <>Pay <span className="opacity-50 mx-1">|</span> {formatPrice(cartTotal)}</>
                                    )}
                                </span>
                                {loading && (
                                    <motion.div
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-white/20 skew-x-12"
                                    />
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-8 flex justify-center gap-4 text-zinc-300 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Mock Logos */}
                            <div className="h-8 w-12 bg-zinc-700 rounded"></div>
                            <div className="h-8 w-12 bg-zinc-700 rounded"></div>
                            <div className="h-8 w-12 bg-zinc-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
