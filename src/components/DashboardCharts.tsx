import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';

// Define nice colors for our sources
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface SummaryData {
  traffic_source: string;
  medium: string;
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
}

interface TrendData {
  sale_date: string;
  daily_total: number;
}

interface ChartProps {
  summaryData: SummaryData[];
  trendData: TrendData[];
}

export const DashboardCharts = ({ summaryData, trendData }: ChartProps) => {
  
  // 1. Prepare Data for Pie Chart (Revenue Share)
  const pieData = summaryData.map(item => ({
    name: item.traffic_source,
    value: item.total_revenue
  }));

  // 2. Prepare Data for Bar Chart (Average Order Value)
  // We want to see: Who spends more? Instagram users or Direct users?
  const barData = summaryData.map(item => ({
    name: item.traffic_source,
    avgOrder: item.average_order_value
  }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginTop: '30px' }}>
      
      {/* --- CHART 1: Market Share (Pie) --- */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#555', marginBottom: '15px' }}>🍰 Revenue Source</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              >
                {pieData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${Number(value).toLocaleString()} TL`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- CHART 2: Who Spends More? (Bar) --- */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#555', marginBottom: '15px' }}>💰 Avg. Order Value</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${Number(value).toLocaleString()} TL`} />
              <Bar dataKey="avgOrder" fill="#82ca9d" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- CHART 3: Daily Trend (Line) --- */}
      <div style={{ gridColumn: '1 / -1', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#555', marginBottom: '15px' }}>📈 Daily Revenue Trend</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="sale_date" 
                tickFormatter={(str) => new Date(str).toLocaleDateString()} 
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(str) => new Date(str).toLocaleDateString()}
                formatter={(value) => `${Number(value).toLocaleString()} TL`}
              />
              <Legend />
              <Line type="monotone" dataKey="daily_total" stroke="#8884d8" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
