import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export const Checkout = () => {
  const { items, total, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Please log in to complete your purchase!');
      navigate('/login');
      return;
    }

    // 2. Prepare the Data Packet (The Fix 🔧)
    // We use .flatMap() to "explode" the cart items.
    // If you have 3 Turbines, this creates 3 separate entries in the array.
    const orderData = items.flatMap(item => {
      // Create an array of size 'quantity' (e.g., 3)
      return Array(item.quantity).fill(null).map(() => ({
        user_id: user.id,
        product_id: item.id,
        amount_paid: item.price, // We record the unit price for EACH item
        status: 'paid'
      }));
    });

    // 3. Send to Supabase
    const { error } = await supabase.from('orders').insert(orderData);

    if (error) {
      alert('Checkout failed: ' + error.message);
    } else {
      alert(`✅ Payment Successful! Recorded ${orderData.length} items.`);
      clearCart();       
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Your Cart is Empty 🛒</h2>
        <p>Go add some dental products!</p>
        <Link to="/" style={{ color: '#2563eb', fontWeight: 'bold' }}>Back to Store</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Shopping Cart</h2>
      
      <div style={{ marginTop: '20px' }}>
        {items.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '15px', 
            borderBottom: '1px solid #f0f0f0' 
          }}>
            <div>
              <h4 style={{ margin: '0 0 5px' }}>{item.title}</h4>
              <span style={{ color: '#888', fontSize: '0.9rem' }}>Quantity: {item.quantity}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontWeight: 'bold' }}>{item.price} TL</span>
              <button 
                onClick={() => removeFromCart(item.id)}
                style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', textAlign: 'right' }}>
        <h3>Total: <span style={{ color: '#2563eb' }}>{total} TL</span></h3>
        
        <button 
          onClick={handleCheckout}
          disabled={loading}
          style={{ 
            backgroundColor: '#059669', 
            color: 'white', 
            border: 'none', 
            padding: '12px 24px', 
            borderRadius: '6px', 
            fontSize: '1.1rem', 
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          {loading ? 'Processing...' : 'Complete Purchase'}
        </button>
      </div>
    </div>
  );
};
