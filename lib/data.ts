export type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    description: string;
    features: string[];
    specs: { [key: string]: string };
    rating: number;
    reviews: number;
};

export const products: Product[] = [
    {
        id: '1',
        name: 'Premium Watch',
        category: 'Accessories',
        price: 24999,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80',
        description: 'An elegant timepiece designed for the modern connoisseur. Featuring a sapphire crystal face and Swiss movement, this watch combines durability with timeless style.',
        features: ['Swiss Movement', 'Sapphire Crystal', 'Water Resistant 50m', 'Genuine Leather Strap'],
        specs: { 'Case Material': 'Stainless Steel', 'Dial Color': 'Black', 'Movement': 'Quartz', 'Warranty': '2 Years' },
        rating: 4.8,
        reviews: 124
    },
    {
        id: '2',
        name: 'Leather Bag',
        category: 'Fashion',
        price: 12999,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80',
        description: 'Handcrafted from full-grain leather, this bag ages beautifully over time. Spacious enough for your daily essentials yet sleek enough for any occasion.',
        features: ['Full-Grain Leather', 'Brass Hardware', 'Laptop Compartment', 'Adjustable Strap'],
        specs: { 'Material': 'Leather', 'Dimensions': '15" x 11" x 4"', 'Weight': '1.2 kg', 'Color': 'Tan' },
        rating: 4.7,
        reviews: 89
    },
    {
        id: '3',
        name: 'Wireless Headphones',
        category: 'Electronics',
        price: 16999,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80',
        description: 'Immerse yourself in pure audio bliss with active noise cancellation and high-fidelity drivers. Designed for comfort during long listening sessions.',
        features: ['Active Noise Cancellation', '30h Battery Life', 'Bluetooth 5.0', 'Comfort Fit'],
        specs: { 'Type': 'Over-Ear', 'Driver Size': '40mm', 'Connectivity': 'Wireless', 'Weight': '250g' },
        rating: 4.9,
        reviews: 256
    },
    {
        id: '4',
        name: 'Smart Sunglasses',
        category: 'Accessories',
        price: 11999,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80',
        description: 'Protect your eyes and stay connected. These smart sunglasses feature built-in speakers and voice assistant integration in a lightweight frame.',
        features: ['UV Protection', 'Built-in Speakers', 'Voice Concierge', 'Touch Controls'],
        specs: { 'Frame Material': 'Acetate', 'Lens': 'Polarized', 'Battery': '4 Hours', 'Bluetooth': 'V5.0' },
        rating: 4.5,
        reviews: 50
    },
    {
        id: '5',
        name: 'Minimalist Chair',
        category: 'Home',
        price: 34999,
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80',
        description: 'A masterpiece of modern design. This chair blends ergonomic support with minimalist aesthetics to elevate any living space.',
        features: ['Ergonomic Design', 'Solid Wood Legs', 'Premium Fabric', 'Hand Assembled'],
        specs: { 'Material': 'Oak & Linen', 'Height': '85cm', 'Width': '60cm', 'Assembly': 'Minimal' },
        rating: 4.8,
        reviews: 76
    },
    {
        id: '6',
        name: 'Ceramic Vase',
        category: 'Home',
        price: 6999,
        image: 'https://images.unsplash.com/photo-1578500494198-246f612d3e3d?auto=format&fit=crop&q=80',
        description: 'Add a touch of artisanal charm to your home. Each vase is hand-thrown and glazed, ensuring a unique piece of art for your flowers.',
        features: ['Hand-Thrown', 'Unique Glaze', 'Waterproof', 'Durable Format'],
        specs: { 'Material': 'Ceramic', 'Height': '30cm', 'Diameter': '15cm', 'Weight': '800g' },
        rating: 4.6,
        reviews: 42
    },
    {
        id: '7',
        name: 'Pro Camera',
        category: 'Electronics',
        price: 89999,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80',
        description: 'Professional grade photography in a compact body. Capture stunning 8K video and 45MP stills with incredible dynamic range.',
        features: ['45MP Sensor', '8K Video', 'Dual Slot', 'Weather Sealed'],
        specs: { 'Sensor': 'Full Frame', 'ISO Range': '100-51200', 'Weight': '650g', 'Resolution': '45MP' },
        rating: 5.0,
        reviews: 12
    },
    {
        id: '8',
        name: 'Silk Scarf',
        category: 'Fashion',
        price: 4999,
        image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&q=80',
        description: 'Wrap yourself in luxury with this 100% pure silk scarf. The vibrant patterns are printed using eco-friendly dyes for a truly premium feel.',
        features: ['100% Mulberry Silk', 'Hand-Rolled Edges', 'Vibrant Print', 'Eco Dyes'],
        specs: { 'Material': 'Silk', 'Size': '90x90cm', 'Care': 'Dry Clean', 'Origin': 'Italy' },
        rating: 4.9,
        reviews: 200
    },
    {
        id: '9',
        name: 'Smart Speaker',
        category: 'Electronics',
        price: 7999,
        image: 'https://images.unsplash.com/photo-1589003077983-20cb75686cb2?auto=format&fit=crop&q=80',
        description: 'Small size, huge sound. This smart speaker fills the room with rich audio and connects seamlessly to your smart home ecosystem.',
        features: ['360° Sound', 'Voice Assistant', 'Multi-Room Audio', 'Adaptive EQ'],
        specs: { 'Power': '15W', 'Connectivity': 'WiFi & BT', 'Dimensions': '10x10cm', 'Weight': '400g' },
        rating: 4.7,
        reviews: 310
    },
];
