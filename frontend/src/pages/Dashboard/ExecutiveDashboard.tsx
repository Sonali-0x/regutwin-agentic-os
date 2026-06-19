import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface HealthMetrics {
  healthScore: number;
  metrics: {
    total: number;
    open: number;
    inProgress: number;
    inReview: number;
    closed: number;
  };
}

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

export default function ExecutiveDashboard() {
  const [data, setData] = useState<HealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await api.get('/analytics/health');
        setData(response.data);
      } catch (error) {
        console.error("Failed to load health metrics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);

  if (loading) {
    return <div className="page-center-wrapper text-white">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="page-center-wrapper text-red-400">Failed to load analytics.</div>;
  }

  const chartData = [
    { name: 'OPEN', value: data.metrics.open },
    { name: 'IN PROGRESS', value: data.metrics.inProgress },
    { name: 'IN REVIEW', value: data.metrics.inReview },
    { name: 'CLOSED', value: data.metrics.closed },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Executive Dashboard</h1>
          <p className="text-[var(--color-surface-300)]">Predictive Risk Scoring & Compliance Health</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
          <h2 className="text-lg text-[var(--color-surface-300)] mb-2">Compliance Health Score</h2>
          <div className={`text-6xl font-bold ${data.healthScore >= 80 ? 'text-green-400' : data.healthScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
            {data.healthScore}
          </div>
          <span className="text-xs text-[var(--color-surface-400)] mt-2">/ 100</span>
        </div>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
          <h2 className="text-lg text-[var(--color-surface-300)] mb-2">Total Action Points</h2>
          <div className="text-5xl font-bold text-white">
            {data.metrics.total}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center">
          <h2 className="text-lg text-[var(--color-surface-300)] mb-2">High Risk (Open)</h2>
          <div className="text-5xl font-bold text-red-400">
            {data.metrics.open}
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-96">
        <h2 className="text-lg font-bold text-white mb-4">MAP Distribution</h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: 'white' }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
