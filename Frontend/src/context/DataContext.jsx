// Central mock data store for the FarmConnect GH application
import { createContext, useContext, useState, useCallback } from 'react';

const DataContext = createContext(null);

import maizeImg from '../assets/maize.jpg';
import milletsImg from '../assets/millets.jpg';
import riceImg from '../assets/rice.jpg';
import groundnutsImg from '../assets/goundnuts.jpg';
import soybeansImg from '../assets/soybeans.jpg';
import sheaNutsImg from '../assets/sheabutter.jpg';
import vegImg from '../assets/vegetables.jpg';
import livestockImg from '../assets/livestock.jpg';
import fruitsImg from '../assets/fruit.jpg';
import yamsImg from '../assets/yam.jpg';

const CATEGORIES = [
  { id: 1, name: 'Maize', icon: '🌽', image: maizeImg },
  { id: 2, name: 'Millet', icon: '🌾', image: milletsImg },
  { id: 3, name: 'Rice', icon: '🍚', image: riceImg },
  { id: 4, name: 'Groundnuts', icon: '🥜', image: groundnutsImg },
  { id: 5, name: 'Soybeans', icon: '🫘', image: soybeansImg },
  { id: 6, name: 'Shea Nuts', icon: '🌰', image: sheaNutsImg },
  { id: 7, name: 'Vegetables', icon: '🥬', image: vegImg },
  { id: 8, name: 'Livestock', icon: '🐄', image: livestockImg },
  { id: 9, name: 'Fruits', icon: '🍋', image: fruitsImg },
  { id: 10, name: 'Yams', icon: '🍠', image: yamsImg },
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    farmerId: 1,
    farmerName: 'Issah Abubakari',
    farmName: 'Issah Farms',
    farmerVerified: true,
    farmerRating: 4.8,
    title: 'Premium Maize (Yellow Corn)',
    category: 'Maize',
    description: 'High-quality yellow maize harvested fresh from our 10-acre farm in Tumu. Well-dried and bagged in 100kg sacks. Good for both human consumption and animal feed.',
    quantity: 120,
    unit: 'bags (100kg)',
    price: 350,
    location: 'Tumu',
    district: 'Sissala East',
    region: 'Upper West',
    harvestDate: '2026-01-15',
    deliveryAvailable: true,
    status: 'available',
    premium: true,
    createdAt: '2026-02-01',
    images: [],
    views: 284,
  },
  {
    id: 2,
    farmerId: 1,
    farmerName: 'Issah Abubakari',
    farmName: 'Issah Farms',
    farmerVerified: true,
    farmerRating: 4.8,
    title: 'Shelled Groundnuts',
    category: 'Groundnuts',
    description: 'Freshly harvested groundnuts from Sissala East. Sun-dried and cleaned. Suitable for oil extraction, roasting, or direct sale to processors.',
    quantity: 80,
    unit: 'bags (50kg)',
    price: 280,
    location: 'Tumu',
    district: 'Sissala East',
    region: 'Upper West',
    harvestDate: '2026-01-20',
    deliveryAvailable: false,
    status: 'available',
    premium: true,
    createdAt: '2026-02-05',
    images: [],
    views: 156,
  },
  {
    id: 3,
    farmerId: 4,
    farmerName: 'Abass Mohammed',
    farmName: 'Abass Agro',
    farmerVerified: true,
    farmerRating: 4.5,
    title: 'Millet (Bulrush)',
    category: 'Millet',
    description: 'Organically grown millet from Lawra district. Ready for purchase. Excellent quality grain for TZ, porridge, and brewing.',
    quantity: 50,
    unit: 'bags (100kg)',
    price: 200,
    location: 'Lawra',
    district: 'Lawra',
    region: 'Upper West',
    harvestDate: '2025-12-10',
    deliveryAvailable: true,
    status: 'available',
    premium: false,
    createdAt: '2026-01-25',
    images: [],
    views: 98,
  },
  {
    id: 4,
    farmerId: 5,
    farmerName: 'Faustina Dery',
    farmName: 'Dery Farms',
    farmerVerified: false,
    farmerRating: 4.2,
    title: 'Soybeans (Grade A)',
    category: 'Soybeans',
    description: 'Grade A soybeans, well sun-dried. Suitable for oil extraction and animal feed production. Comes in 80kg bags.',
    quantity: 200,
    unit: 'bags (80kg)',
    price: 320,
    location: 'Wa',
    district: 'Wa Municipal',
    region: 'Upper West',
    harvestDate: '2026-01-05',
    deliveryAvailable: true,
    status: 'available',
    premium: false,
    createdAt: '2026-01-28',
    images: [],
    views: 72,
  },
  {
    id: 5,
    farmerId: 6,
    farmerName: 'Dramani Yakubu',
    farmName: 'Yakubu Cooperative',
    farmerVerified: true,
    farmerRating: 4.9,
    title: 'Shea Nuts (Raw)',
    category: 'Shea Nuts',
    description: 'Premium raw shea nuts from the Upper West. Wildly harvested by cooperative members. Perfect for shea butter extraction and cosmetics industry.',
    quantity: 500,
    unit: 'bags (50kg)',
    price: 180,
    location: 'Nandom',
    district: 'Nandom',
    region: 'Upper West',
    harvestDate: '2026-02-01',
    deliveryAvailable: false,
    status: 'available',
    premium: true,
    createdAt: '2026-02-10',
    images: [],
    views: 321,
  },
  {
    id: 6,
    farmerId: 7,
    farmerName: 'Perpetua Baawe',
    farmName: 'Baawe Fresh',
    farmerVerified: false,
    farmerRating: 4.0,
    title: 'Fresh Tomatoes',
    category: 'Vegetables',
    description: 'Fresh tomatoes harvested from our irrigated farm. Available in 10kg crates for local market and restaurants.',
    quantity: 300,
    unit: 'crates (10kg)',
    price: 45,
    location: 'Jirapa',
    district: 'Jirapa',
    region: 'Upper West',
    harvestDate: '2026-03-10',
    deliveryAvailable: true,
    status: 'available',
    premium: false,
    createdAt: '2026-03-12',
    images: [],
    views: 44,
  },
  {
    id: 7,
    farmerId: 8,
    farmerName: 'Alhassan Daari',
    farmName: 'Daari Rice Farm',
    farmerVerified: true,
    farmerRating: 4.6,
    title: 'Local Rice (Washed)',
    category: 'Rice',
    description: 'Locally grown and milled rice from Wa East. Clean, well-sorted 50kg bags. Popular with local traders and restaurants.',
    quantity: 150,
    unit: 'bags (50kg)',
    price: 420,
    location: 'Wa East',
    district: 'Wa East',
    region: 'Upper West',
    harvestDate: '2026-01-30',
    deliveryAvailable: true,
    status: 'available',
    premium: false,
    createdAt: '2026-02-15',
    images: [],
    views: 187,
  },
  {
    id: 8,
    farmerId: 4,
    farmerName: 'Abass Mohammed',
    farmName: 'Abass Agro',
    farmerVerified: true,
    farmerRating: 4.5,
    title: 'Cattle (Zebu Breed)',
    category: 'Livestock',
    description: 'Healthy Zebu cattle for sale. Suitable for beef production or dairy. Vaccinated and well-fed. Price per head.',
    quantity: 25,
    unit: 'heads',
    price: 2200,
    location: 'Lawra',
    district: 'Lawra',
    region: 'Upper West',
    harvestDate: null,
    deliveryAvailable: false,
    status: 'available',
    premium: false,
    createdAt: '2026-02-20',
    images: [],
    views: 63,
  },
];

const INITIAL_ORDERS = [
  {
    id: 1,
    buyerId: 2,
    buyerName: 'Amina Seidu',
    farmerId: 1,
    farmerName: 'Issah Abubakari',
    productId: 1,
    productTitle: 'Premium Maize (Yellow Corn)',
    quantity: 40,
    offerPrice: 330,
    status: 'accepted',
    createdAt: '2026-03-01',
    note: 'Looking for regular supply each month.',
  },
  {
    id: 2,
    buyerId: 2,
    buyerName: 'Amina Seidu',
    farmerId: 1,
    farmerName: 'Issah Abubakari',
    productId: 2,
    productTitle: 'Shelled Groundnuts',
    quantity: 20,
    offerPrice: 260,
    status: 'pending',
    createdAt: '2026-03-10',
    note: 'Can you consider 260 per bag?',
  },
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    conversationId: 1,
    senderId: 2,
    receiverId: 1,
    message: 'Hello Issah, can you supply 50 bags of maize this month?',
    timestamp: '2026-03-01T10:30:00',
    read: true,
  },
  {
    id: 2,
    conversationId: 1,
    senderId: 1,
    receiverId: 2,
    message: 'Hello Amina! Yes, I can supply 50 bags. Delivery can be done next week.',
    timestamp: '2026-03-01T11:00:00',
    read: true,
  },
  {
    id: 3,
    conversationId: 1,
    senderId: 2,
    receiverId: 1,
    message: 'Great! Can you do GHS 330 per bag instead of 350?',
    timestamp: '2026-03-01T11:15:00',
    read: true,
  },
  {
    id: 4,
    conversationId: 1,
    senderId: 1,
    receiverId: 2,
    message: 'I can do 340 per bag since you are buying in bulk. That is my best offer.',
    timestamp: '2026-03-01T11:45:00',
    read: false,
  },
];

const INITIAL_REVIEWS = [
  { id: 1, buyerId: 2, buyerName: 'Amina Seidu', farmerId: 1, rating: 5, comment: 'Excellent quality maize! Delivered on time and well-packaged.', createdAt: '2026-02-15' },
  { id: 2, buyerId: 9, buyerName: 'Bernard Asante', farmerId: 1, rating: 4, comment: 'Good product overall. Slightly underweight bags but otherwise great.', createdAt: '2026-01-28' },
  { id: 3, buyerId: 10, buyerName: 'Comfort Oduro', farmerId: 1, rating: 5, comment: 'Very honest farmer. Highly recommend for bulk purchases!', createdAt: '2026-01-10' },
];

export function DataProvider({ children }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [reviews] = useState(INITIAL_REVIEWS);

  const addProduct = useCallback((product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      views: 0,
      createdAt: new Date().toISOString().split('T')[0],
      images: [],
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addOrder = useCallback((order) => {
    const newOrder = { ...order, id: Date.now(), createdAt: new Date().toISOString().split('T')[0], status: 'pending' };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const updateOrder = useCallback((id, updates) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  }, []);

  const sendMessage = useCallback((msg) => {
    const newMsg = { ...msg, id: Date.now(), timestamp: new Date().toISOString(), read: false };
    setMessages(prev => [...prev, newMsg]);
    return newMsg;
  }, []);

  return (
    <DataContext.Provider value={{
      categories: CATEGORIES,
      products, addProduct, updateProduct, deleteProduct,
      orders, addOrder, updateOrder,
      messages, sendMessage,
      reviews,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
