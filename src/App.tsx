import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Store } from './components/Store';
import { AdminDashboard } from './components/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CartProvider } from './context/CartContext';
import { Checkout } from './pages/Checkout';


function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        {/* Navbar is outside Routes so it always shows */}
        <Navbar />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <Routes>
            {/* The Public Store */}
            <Route path="/" element={<Store />} />
            
            {/* Auth Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* The Dashboard */}
            <Route path="/dashboard" element={<AdminDashboard />} />
            
            {/* Cart/Checkout */}
            <Route path="/cart" element={<Checkout />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;