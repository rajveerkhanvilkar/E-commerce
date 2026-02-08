'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { ArrowLeft, Mail, Lock, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    // 3D Tilt Logic
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

    const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
    const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
    const bgGradient = useMotionTemplate`radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      rgba(255,255,255,0.1),
      transparent 80%
  )`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/');
                router.refresh(); // Refresh to update auth state if using cookies in server components
            }, 1500);

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden font-sans text-white">
            {/* Animated Deep Space Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-zinc-950 to-zinc-950 z-0"></div>
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px]"
            ></motion.div>
            <motion.div
                animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
                transition={{ duration: 15, repeat: Infinity }}
                className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"
            ></motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ perspective: 1000 }}
                className="w-full max-w-md relative z-10"
            >
                <motion.div
                    ref={ref}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative group"
                >
                    {/* Mouse Glow */}
                    <motion.div
                        style={{ background: bgGradient }}
                        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    />

                    <motion.div style={{ translateZ: 20 }}>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 text-sm group/link"
                        >
                            <ArrowLeft size={16} className="group-hover/link:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>

                        <div className="mb-10 text-center">
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
                            >
                                Welcome Back
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-zinc-400"
                            >
                                Sign in to continue your journey
                            </motion.p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 text-sm"
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}

                        {success ? (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-10"
                            >
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-emerald-500" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Signed In!</h3>
                                <p className="text-zinc-400">Redirecting to dashboard...</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300 ml-1">Email Address</label>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within/input:text-rose-500 transition-colors" size={20} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-transparent transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
                                    <div className="relative group/input">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within/input:text-rose-500 transition-colors" size={20} />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-transparent transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-white transition-colors">
                                        <input type="checkbox" className="rounded border-zinc-700 bg-zinc-800 text-rose-500 focus:ring-rose-500/50" />
                                        Remember me
                                    </label>
                                    <a href="#" className="text-rose-400 hover:text-rose-300 transition-colors">Forgot Password?</a>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        "Sign In"
                                    )}
                                </motion.button>
                            </form>
                        )}

                        <div className="mt-8 text-center text-sm text-zinc-400">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-white font-semibold hover:underline">
                                Create one now
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
