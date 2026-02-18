import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTrafficTracker } from '../hooks/useTrafficTracker'; // <--- Import the Tracker
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
}

export const Store = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. ACTIVATE THE TRACKER
  // This hook runs immediately to capture URL params like ?utm_source=instagram
  const { trafficData } = useTrafficTracker();
  const { addToCart } = useCart();

  // 2. Fetch Products
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) console.error('Error fetching products:', error);
      else setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading) return <p style={{padding: '2rem'}}>Loading catalog...</p>;

  return (
    <div style={{ marginTop: '20px' }}>
      
      {/* --- DEBUG: THE GREEN BOX IS BACK --- */}
      {trafficData && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#ecfdf5', 
          border: '1px solid #10b981', 
          borderRadius: '8px',
          color: '#065f46'
        }}>
          <strong>🕵️ Tracking Debugger:</strong> We detected you came from 
          <span style={{ fontWeight: 'bold', marginLeft: '5px' }}>
             {trafficData.source} ({trafficData.medium})
          </span>
        </div>
      )}
      {/* ---------------------------------- */}

      <h2 style={{ marginBottom: '20px', color: '#333' }}>🦷 Dental Catalog</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #eee', borderRadius: '12px', padding: '15px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ height: '180px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', overflow: 'hidden' }}>
               {/* Use the image URL if valid, otherwise a placeholder */}
               <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem' }}>{product.title}</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px', height: '40px', overflow: 'hidden' }}>{product.description}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
              <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#2c3e50' }}>{product.price} TL</span>
              <button 
                onClick={() => addToCart(product)}
                style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};