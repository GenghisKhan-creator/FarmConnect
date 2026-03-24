import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Subscription from './pages/Subscription';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Support from './pages/Support';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import FarmerProfile from './pages/FarmerProfile';
import NotFound from './pages/NotFound';

function Layout({ children, noFooter = false }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      {!noFooter && <Footer />}
      <ToastContainer />
    </div>
  );
}

function FullLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Auth pages (no navbar/footer) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Messages (full layout, no footer) */}
            <Route path="/messages" element={
              <FullLayout><Messages /></FullLayout>
            } />

            {/* Admin (with navbar, no footer) */}
            <Route path="/admin" element={
              <Layout noFooter>
                <Admin />
              </Layout>
            } />

            {/* Standard pages with footer */}
            <Route path="/" element={
              <Layout><Home /></Layout>
            } />
            <Route path="/marketplace" element={
              <Layout><Marketplace /></Layout>
            } />
            <Route path="/products/:id" element={
              <Layout><ProductDetails /></Layout>
            } />
            <Route path="/farmer/:id" element={
              <Layout><FarmerProfile /></Layout>
            } />
            <Route path="/dashboard" element={
              <Layout><Dashboard /></Layout>
            } />
            <Route path="/profile" element={
              <Layout><Profile /></Layout>
            } />
            <Route path="/subscription" element={
              <Layout><Subscription /></Layout>
            } />
            <Route path="/support" element={
              <Layout><Support /></Layout>
            } />
            <Route path="/privacy" element={
              <Layout><Privacy /></Layout>
            } />
            <Route path="/terms" element={
              <Layout><Terms /></Layout>
            } />

            {/* Fallback */}
            <Route path="*" element={
              <Layout><NotFound /></Layout>
            } />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
