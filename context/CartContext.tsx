'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of a cart item
type CartItem = {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
};

// Define the functionality for the cart
type CartContextType = {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart data');
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage whenever items change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    // Calculate total price
    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Calculate total items count
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === product.id);

            if (existingItem) {
                return currentItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...currentItems, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setItems(currentItems => currentItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return;
        setItems(currentItems =>
            currentItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    // Prevent hydration mismatch by returning empty cart until loaded
    // Or better, just render children but with empty context initially if needed
    // But strictly speaking, for Cart count to match server, we usually need to wait
    // However, for UX speed, we can render immediately.
    // The issue is hydration mismatch if server renders 0 and client renders N from localStorage.
    // So we typically wait for mount.

    if (!isLoaded) {
        return (
            <CartContext.Provider value={{
                items: [],
                addToCart: () => { },
                removeFromCart: () => { },
                updateQuantity: () => { },
                clearCart: () => { },
                cartTotal: 0,
                itemCount: 0
            }}>
                {children}
            </CartContext.Provider>
        );
    }

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            itemCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
