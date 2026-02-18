import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { DashboardCharts } from './DashboardCharts';

interface AnalyticsRow {
  traffic_source: string;
  medium: string;
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
}

interface TrendRow {
  sale_date: string;
  daily_total: number;
}

export const AdminDashboard = () => {
  const [summary, setSummary] = useState<AnalyticsRow[]>([]);
  const [trends, setTrends] = useState<TrendRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // 1. Fetch Totals
      const { data: summaryData } = await supabase.from('analytics_summary').select('*');
      
      // 2. Fetch Daily Trends (The new view)
      const { data: trendData } = await supabase.from('daily_revenue').select('*');

      if (summaryData) setSummary(summaryData);
      if (trendData) setTrends(trendData);
      
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Business Intelligence...</div>;

  // Calculate Total Revenue across all channels
  const totalRevenue = summary.reduce((acc, curr) => acc + curr.total_revenue, 0);

  return (
    <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px', minHeight: '80vh' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1a1a1a' }}>📊 Executive Dashboard</h2>
          <p style={{ margin: '5px 0 0', color: '#666' }}>Real-time performance metrics</p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <span style={{ display: 'block', fontSize: '0.9rem', color: '#888' }}>Total Revenue</span>
           <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
             {totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 0 })} TL
           </span>
        </div>
      </div>

      {/* 1. THE CHARTS (New!) */}
      <DashboardCharts summaryData={summary} trendData={trends} />

      {/* 2. THE DATA TABLE (Existing) */}
      <h3 style={{ marginTop: '40px', color: '#333' }}>📋 Detailed Breakdown</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <thead style={{ backgroundColor: '#f1f5f9' }}>
          <tr style={{ textAlign: 'left', color: '#475569' }}>
            <th style={{ padding: '15px' }}>Source</th>
            <th style={{ padding: '15px' }}>Orders</th>
            <th style={{ padding: '15px' }}>Revenue</th>
            <th style={{ padding: '15px' }}>Avg. Order</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((row) => (
            <tr key={row.traffic_source} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '15px', fontWeight: '600', color: '#334155' }}>
                {row.traffic_source} <span style={{fontSize:'0.8em', color:'#94a3b8'}}>({row.medium})</span>
              </td>
              <td style={{ padding: '15px' }}>{row.total_orders}</td>
              <td style={{ padding: '15px', color: '#059669', fontWeight: '600' }}>
                {row.total_revenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </td>
              <td style={{ padding: '15px', color: '#475569' }}>
                {row.average_order_value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};