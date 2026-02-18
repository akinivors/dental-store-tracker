import { useState } from 'react';
import { supabase } from '../supabaseClient';
import type { TrafficData } from '../hooks/useTrafficTracker'; // <--- Added "type" keyword

interface AuthProps {
  trafficData: TrafficData | null;
  onSignupSuccess: () => void;
}

// ... keep the rest of the file exactly the same ...

// Notice we now accept inputs inside the ({ ... })
export const Auth = ({ trafficData, onSignupSuccess }: AuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // DELETED: const { trafficData ... } = useTrafficTracker(); <--- We don't need this anymore!

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Sign Up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert('Error signing up: ' + error.message);
      setLoading(false);
      return;
    }

    // 2. CHECK: Only check for Session (Don't care if trafficData exists or not)
    if (data.session) {
      console.log('✅ User logged in! Saving attribution...');
      
      // LOGIC CHANGE: If no traffic data, we assume they are "Direct"
      const finalSource = trafficData?.source || 'direct';
      const finalMedium = trafficData?.medium || 'none';
      const finalCampaign = trafficData?.campaign || null;

      const { error: trackError } = await supabase
        .from('user_attribution')
        .insert([
          { 
            user_id: data.user?.id, 
            source: finalSource,     // Will be 'instagram' OR 'direct'
            medium: finalMedium,
            campaign: finalCampaign
          }
        ]);

      if (trackError) {
        console.error('❌ Database blocked the save:', trackError);
      } else {
        console.log('✅ Tracking saved successfully!');
        if (trafficData) onSignupSuccess(); 
      }
    } 
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}>
      <h3>🔐 Mock Registration</h3>
      <p>Sign up here to test if the "Instagram" tag gets sent to the database.</p>
      
      <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input 
          type="email" 
          placeholder="New Email (for testing)" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};