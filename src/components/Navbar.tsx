import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js'; // <--- Added "type" here
import { useCart } from '../context/CartContext';


export const Navbar = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const { count } = useCart();

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 2. Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Styles
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    marginLeft: '20px'
  };

  return (
    <nav style={navStyle}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
        <Link to="/" style={{ ...linkStyle, marginLeft: 0, color: '#2563eb' }}>🦷 TopcuDental</Link>
      </div>
      
      <div>
        <Link to="/" style={linkStyle}>Store</Link>
        
        {/* Cart Link with Badge */}
        <Link to="/cart" style={linkStyle}>
          Cart {count > 0 && <span style={{ background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.8rem', marginLeft: '5px' }}>{count}</span>}
        </Link>
        
        {user ? (
          <>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            <span style={{ marginLeft: '20px', color: '#888' }}>|</span>
            <span style={{ marginLeft: '20px', fontSize: '0.9rem' }}>{user.email}</span>
            <button 
              onClick={handleLogout}
              style={{ 
                marginLeft: '20px', 
                padding: '8px 16px', 
                backgroundColor: '#ef4444', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Log In</Link>
            <Link to="/register" style={{ 
              ...linkStyle, 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '4px' 
            }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};