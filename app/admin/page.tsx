'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Package, DollarSign, Users, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    stock: number;
    category: string;
}

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
    });

    useEffect(() => {
        fetchProducts();
        fetchStats();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
                alert('Product deleted successfully!');
            }
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('Failed to delete product');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Header */}
            <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <Link
                            href="/"
                            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        >
                            ← Back to Store
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={<Package />}
                        title="Total Products"
                        value={stats.totalProducts}
                        color="blue"
                    />
                    <StatCard
                        icon={<ShoppingCart />}
                        title="Total Orders"
                        value={stats.totalOrders}
                        color="green"
                    />
                    <StatCard
                        icon={<DollarSign />}
                        title="Revenue"
                        value={`$${stats.totalRevenue.toLocaleString()}`}
                        color="purple"
                    />
                    <StatCard
                        icon={<Users />}
                        title="Total Users"
                        value={stats.totalUsers}
                        color="orange"
                    />
                </div>

                {/* Products Section */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Products</h2>
                        <Link
                            href="/admin/products/new"
                            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl hover:opacity-80 transition-opacity"
                        >
                            <Plus size={20} />
                            Add Product
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-zinc-500">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12 text-zinc-500">
                            No products yet. Click "Add Product" to create your first product.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b border-zinc-200 dark:border-zinc-800">
                                    <tr className="text-left text-sm text-zinc-600 dark:text-zinc-400">
                                        <th className="pb-3">Product</th>
                                        <th className="pb-3">Price</th>
                                        <th className="pb-3">Stock</th>
                                        <th className="pb-3">Category</th>
                                        <th className="pb-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <motion.tr
                                            key={product.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                                        >
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    {product.images[0] && (
                                                        <img
                                                            src={product.images[0]}
                                                            alt={product.name}
                                                            className="w-12 h-12 object-cover rounded-lg"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="font-medium">{product.name}</div>
                                                        <div className="text-sm text-zinc-500 line-clamp-1">
                                                            {product.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">${product.price}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${product.stock > 10
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                                    }`}>
                                                    {product.stock} units
                                                </span>
                                            </td>
                                            <td className="py-4">{product.category}</td>
                                            <td className="py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/admin/products/${product.id}`}
                                                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteProduct(product.id)}
                                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, color }: any) {
    const colorClasses = {
        blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        green: 'bg-green-500/10 text-green-600 dark:text-green-400',
        purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
        orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6"
        >
            <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">{title}</div>
            <div className="text-2xl font-bold">{value}</div>
        </motion.div>
    );
}
