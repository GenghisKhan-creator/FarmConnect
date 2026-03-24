import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { io } from 'socket.io-client';

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

import mockTomatoesImg from '../assets/mock_tomatoes.png';
import mockMaizeImg from '../assets/mock_maize.png';
import mockRiceImg from '../assets/mock_rice.png';
import mockYamsImg from '../assets/mock_yams.png';

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
    images: [mockMaizeImg],
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
    images: [mockTomatoesImg],
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
    images: [mockRiceImg],
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
  {
    id: 9,
    farmerId: 5,
    farmerName: 'Faustina Dery',
    farmName: 'Dery Farms',
    farmerVerified: false,
    farmerRating: 4.2,
    title: 'Freshly Harvested Puna Yams',
    category: 'Yams',
    description: 'Large, fresh puna yams freshly dug out. Big sizes. Excellent for cooking, pounding and roasting.',
    quantity: 150,
    unit: 'tubers',
    price: 35,
    location: 'Wa',
    district: 'Wa Municipal',
    region: 'Upper West',
    harvestDate: '2026-03-24',
    deliveryAvailable: true,
    status: 'available',
    premium: true,
    createdAt: '2026-03-24',
    images: [mockYamsImg],
    views: 450,
  },
];

export function DataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reports, setReports] = useState([]);
  const [strikes, setStrikes] = useState({});
  const [banned, setBanned] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  const [socket, setSocket] = useState(null);

  const fetchLiveAuthData = useCallback(async () => {
    const token = localStorage.getItem('farmconnect_token');
    if (!token) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      axios.get('http://localhost:5000/api/data/orders', config).then(res => setOrders(res.data)).catch(() => {});
      axios.get('http://localhost:5000/api/data/reports', config).then(res => setReports(res.data)).catch(() => {});
      axios.get('http://localhost:5000/api/data/messages', config).then(res => {
        const decryptedMsgs = res.data.map(m => {
          try {
            const bytes = CryptoJS.AES.decrypt(m.message, m.conversationId + "_fckey_v1");
            const plainText = bytes.toString(CryptoJS.enc.Utf8);
            return { ...m, message: plainText || m.message };
          } catch(e) { return m; } // Fallback for plain unencrypted records
        });
        setMessages(decryptedMsgs);
      }).catch(() => {});
      axios.get('http://localhost:5000/api/data/notifications', config).then(res => setNotifications(res.data)).catch(() => {});
    } catch(err) {}
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('farmconnect_token');
    let userId = null;
    if (token) {
      try { userId = JSON.parse(atob(token.split('.')[1])).id; } catch(e){}
    }
    const newSocket = io('http://localhost:5000');
    if (userId) newSocket.emit('register', userId);
    setSocket(newSocket);

    newSocket.on('receive_message', (msg) => {
      let plainText = msg.message;
      try {
        const bytes = CryptoJS.AES.decrypt(msg.message, msg.conversationId + "_fckey_v1");
        plainText = bytes.toString(CryptoJS.enc.Utf8) || msg.message;
      } catch(e) {}
      
      setMessages(prev => {
        if (prev.find(m => m.id === msg.id)) return prev;
        return [...prev, { ...msg, message: plainText }];
      });
    });

    newSocket.on('messages_read', (messageIds) => {
      setMessages(prev => prev.map(m => messageIds.includes(m.id) ? { ...m, read: true } : m));
    });

    return () => newSocket.close();
  }, []);

  const markMessagesAsRead = useCallback((messageIds, senderId) => {
    if (messageIds.length === 0) return;
    setMessages(prev => prev.map(m => messageIds.includes(m.id) ? { ...m, read: true } : m));
    if (socket) {
      socket.emit('mark_read', { messageIds, senderId });
    }
  }, [socket]);

  useEffect(() => {
    async function fetchLiveProducts() {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        const hydratedData = data.map(p => ({
            ...p,
            images: p.category === 'Maize' ? [mockMaizeImg] : [],
        }));
        setProducts(hydratedData);
      } catch (err) { }
    }
    
    async function fetchLiveReviews() {
        try {
            const { data } = await axios.get('http://localhost:5000/api/data/reviews');
            setReviews(data);
        } catch(err) {}
    }

    fetchLiveProducts();
    fetchLiveReviews();
    fetchLiveAuthData();
    
    // Poll personal data periodically to fake real-time interactions
    const interval = setInterval(fetchLiveAuthData, 5000);
    return () => clearInterval(interval);
  }, [fetchLiveAuthData]);

  const addProduct = useCallback(async (product) => {
    try {
      const token = localStorage.getItem('farmconnect_token');
      const { data } = await axios.post('http://localhost:5000/api/products', product, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newProduct = { ...data, images: [] };
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      console.error("Failed to post product to backend:", err);
      return null;
    }
  }, []);

  const updateProduct = useCallback(async (id, updates) => {
    try {
      const token = localStorage.getItem('farmconnect_token');
      const { data } = await axios.put(`http://localhost:5000/api/products/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    } catch(err) { console.error('Failed to update product', err); }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      const token = localStorage.getItem('farmconnect_token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch(err) { console.error('Failed to delete product', err); }
  }, []);

  const recordView = useCallback(async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/products/${id}/view`);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, views: (p.views || 0) + 1 } : p));
    } catch(err) {}
  }, []);

  const addOrder = useCallback(async (order) => {
    try {
      const token = localStorage.getItem('farmconnect_token');
      const { data } = await axios.post('http://localhost:5000/api/data/orders', order, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(prev => [data, ...prev]);
      return data;
    } catch(err) { return null; }
  }, []);

  const updateOrder = useCallback(async (id, updates) => {
    try {
      const token = localStorage.getItem('farmconnect_token');
      const { data } = await axios.put(`http://localhost:5000/api/data/orders/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(prev => prev.map(o => o.id === id ? data : o));
    } catch(err) {}
  }, []);

  const sendMessage = useCallback(async (msg) => {
    const tempId = Date.now().toString();
    const optimisticMsg = { ...msg, id: tempId, timestamp: new Date().toISOString(), read: false };
    // Quickly flash to UI
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const token = localStorage.getItem('farmconnect_token');
      const ciphertext = CryptoJS.AES.encrypt(msg.message, msg.conversationId + "_fckey_v1").toString();
      
      const payload = { ...msg, message: ciphertext };
      const { data } = await axios.post('http://localhost:5000/api/data/messages', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update the temporary message with real DB message
      setMessages(prev => prev.map(m => m.id === tempId ? { ...data, message: msg.message } : m));
      return data;
    } catch(err) {
      // Revert if failed
      setMessages(prev => prev.filter(m => m.id !== tempId));
      return null;
    }
  }, []);

  const addReport = useCallback(async (reportData) => {
    try {
      const token = localStorage.getItem('farmconnect_token');
      const { data } = await axios.post('http://localhost:5000/api/data/reports', reportData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(prev => [data, ...prev]);
    } catch(err) {}
  }, []);

  const updateReport = useCallback((id, updates) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const addStrike = useCallback((userId) => {
    setStrikes(prev => ({ ...prev, [userId]: (prev[userId] || 0) + 1 }));
  }, []);

  const toggleBan = useCallback((userId) => {
    setBanned(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  }, []);

  const addReview = useCallback(async (review) => {
    try {
      const token = localStorage.getItem('farmconnect_token');
      const { data } = await axios.post('http://localhost:5000/api/data/reviews', review, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(prev => [data, ...prev]);
      return data;
    } catch(err) { return null; }
  }, []);

  const toggleSavedItem = useCallback((productId) => {
    setSavedItems(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  }, []);

  const addNotification = useCallback((userId, text, type = 'general') => {
    setNotifications(prev => [{ id: Date.now(), userId, text, type, read: false, createdAt: new Date().toISOString() }, ...prev]);
  }, []);

  const markNotificationsAsRead = useCallback((userId) => {
    setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n));
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((text, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => removeToast(id), 3500);
  }, [removeToast]);

  return (
    <DataContext.Provider value={{
      socket,
      categories: CATEGORIES,
      products, addProduct, updateProduct, deleteProduct, recordView,
      orders, addOrder, updateOrder,
      messages, sendMessage, markMessagesAsRead,
      reviews, addReview,
      reports, addReport, updateReport,
      strikes, addStrike,
      banned, toggleBan,
      savedItems, toggleSavedItem,
      notifications, addNotification, markNotificationsAsRead,
      toasts, addToast, removeToast
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
