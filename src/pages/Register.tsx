import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { useTrafficTracker } from '../hooks/useTrafficTracker'; // Don't forget this!

export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Connect the Brain
  const { trafficData, clearTrackingData } = useTrafficTracker();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Sign Up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // 2. Tracking Logic
    if (data.session) {
      const finalSource = trafficData?.source || 'direct';
      const finalMedium = trafficData?.medium || 'none';
      const finalCampaign = trafficData?.campaign || null;

      await supabase.from('user_attribution').insert([{ 
          user_id: data.user?.id, 
          source: finalSource,
          medium: finalMedium,
          campaign: finalCampaign
      }]);
      
      clearTrackingData(); // Clear the "Green Box" data
      navigate('/');       // Redirect to Store
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Create Account</h2>
      
      {/* Show user if we are tracking them */}
      {trafficData && (
        <div style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '10px', fontSize: '0.8rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>
          ✨ Special Offer applied from <strong>{trafficData.source}</strong>
        </div>
      )}

      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="email" 
          placeholder="Email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" 
          placeholder="Password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem', fontWeight: 'bold' }}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login" style={{ color: '#2563eb' }}>Log in</Link>
      </p>
    </div>
  );
};