'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowRight, ShoppingBag, Shield, Zap, Star, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// 3D Tilt Card for Categories
function TiltCategory({ title, image, link }: { title: string, image: string, link: string }) {
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

  const rotateX = useTransform(mouseY, [-200, 200], [15, -15]);
  const rotateY = useTransform(mouseX, [-200, 200], [-15, 15]);

  return (
    <Link href={link}>
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />

        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <motion.div style={{ translateZ: 40 }} className="flex justify-between items-end">
            <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              <ArrowRight size={20} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), { stiffness: 100, damping: 30 });
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 overflow-x-hidden selection:bg-rose-500 selection:text-white">
      {/* Animated Background Mesh */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),rgba(255,255,255,0))] blur-3xl opacity-60 animate-pulse-slow pointer-events-none"></div>

      {/* Premium Glass Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 w-full z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-1.5 rounded-lg shadow-lg group-hover:shadow-rose-500/20 transition-all"
            >
              <ShoppingBag size={20} strokeWidth={2.5} />
            </motion.div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">Luxe</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {['Products', 'Categories', 'About'].map((link) => (
              <Link key={link} href={`/${link.toLowerCase()}`} className="relative text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors group">
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors hover:scale-105 active:scale-95 transform duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2 text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full shadow-lg hover:shadow-xl hover:shadow-rose-500/20 transition-all hover:scale-105 active:scale-95 transform duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Dynamic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-b from-rose-200/30 to-purple-200/30 dark:from-rose-900/10 dark:to-purple-900/10 rounded-full blur-3xl opacity-50 pointer-events-none"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-t from-blue-200/30 to-emerald-200/30 dark:from-blue-900/10 dark:to-emerald-900/10 rounded-full blur-3xl opacity-50 pointer-events-none"
        />

        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <motion.div
            style={{ opacity, scale }}
            className="text-center max-w-5xl mx-auto space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md text-sm font-medium text-zinc-600 dark:text-zinc-300 shadow-sm hover:shadow-md transition-shadow cursor-default"
            >
              <Sparkles size={14} className="text-yellow-500 animate-pulse" />
              <span className="bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent font-bold">New Collection Live</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.9]"
            >
              Redefine <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 animate-color-cycle">
                Excellence
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light"
            >
              Discover a curated universe of premium essentials. Crafted for those who demand nothing but the extraordinary.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <Link
                href="/products"
                className="group relative w-full sm:w-auto px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold text-lg overflow-hidden shadow-2xl hover:shadow-rose-500/25 transition-all hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Shop Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Curated <br /><span className="text-zinc-400">Categories</span></h2>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-lg font-bold hover:gap-4 transition-all">
              View All <ArrowRight />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <TiltCategory
              title="Timepieces"
              image="https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80"
              link="/products"
            />
            <TiltCategory
              title="Audio"
              image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80"
              link="/products"
            />
            <TiltCategory
              title="Vision"
              image="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80"
              link="/products"
            />
          </div>
        </div>
      </section>

      {/* Feature Grid with Hover Tilt */}
      <section className="py-32 relative bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-3 gap-8 perspective-1000">
            {[
              { icon: Zap, title: "Instant Delivery", desc: "Experience the speed of our global logistics network.", color: "text-yellow-500", bg: "bg-yellow-500/10" },
              { icon: Shield, title: "Secure Checkout", desc: "Bank-grade encryption protecting your every purchase.", color: "text-blue-500", bg: "bg-blue-500/10" },
              { icon: Star, title: "Premium Verification", desc: "Every item is authenticated by our expert team.", color: "text-purple-500", bg: "bg-purple-500/10" }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.2, type: "spring", stiffness: 50 }}
                whileHover={{ y: -10, rotateX: 5, rotateY: 5, scale: 1.02 }}
                className="p-10 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group cursor-default shadow-sm hover:shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/50 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                  <feature.icon className={`${feature.color}`} size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Parallax */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            style={{ y }}
            className="relative rounded-[3rem] overflow-hidden bg-black text-white p-12 md:p-32 text-center shadow-2xl shadow-rose-900/20"
          >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-purple-600 to-blue-600 animate-gradient-xy opacity-80"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>

            <div className="relative z-10 space-y-10">
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-black tracking-tighter"
              >
                Ready to Upgrade?
              </motion.h2>
              <p className="text-2xl text-white/80 max-w-2xl mx-auto font-light">
                Join the exclusive community of tastemakers. Your new favorite item is waiting.
              </p>
              <div className="pt-8">
                <Link
                  href="/products"
                  className="inline-block px-12 py-6 bg-white text-black rounded-full font-bold text-xl hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-110 active:scale-95 transform duration-300"
                >
                  Start Shopping Now
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pt-20 pb-10">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
            <p>© {new Date().getFullYear()} Rajveer Khanvilkar. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
