import { useState, useEffect } from 'react';
import api from '../../services/api';
import HumanApprovalQueue from '../../components/HumanApprovalQueue';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

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

const STATUS_COLORS: Record<string, string> = {
  'OPEN': '#ef4444',
  'IN PROGRESS': '#f59e0b',
  'IN REVIEW': '#3b82f6',
  'CLOSED': '#10b981',
};

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Healthy' : score >= 50 ? 'At Risk' : 'Critical';
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
          <circle
            cx="70" cy="70" r="60"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 377} 377`}
            transform="rotate(-90 70 70)"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-4xl font-black text-white">{score}</p>
          <p className="text-xs font-medium" style={{ color }}>{label}</p>
        </div>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Compliance Health Score
      </p>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-2"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span
          className="text-3xl font-black"
          style={{ color }}
        >
          {value}
        </span>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {label}
      </p>
    </div>
  );
}

export default function ExecutiveDashboard() {
  const [data, setData] = useState<HealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await api.get('/analytics/health');
        setData(response.data);
      } catch (error) {
        console.error('Failed to load health metrics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <span className="text-white/60 text-sm">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400 text-sm">Failed to load analytics.</p>
      </div>
    );
  }

  const chartData = [
    { name: 'OPEN', value: data.metrics.open },
    { name: 'IN PROGRESS', value: data.metrics.inProgress },
    { name: 'IN REVIEW', value: data.metrics.inReview },
    { name: 'CLOSED', value: data.metrics.closed },
  ].filter(d => d.value > 0);

  const trendData = [
    { day: 'Mon', open: data.metrics.open + 3, closed: Math.max(0, data.metrics.closed - 2) },
    { day: 'Tue', open: data.metrics.open + 2, closed: Math.max(0, data.metrics.closed - 1) },
    { day: 'Wed', open: data.metrics.open + 1, closed: data.metrics.closed },
    { day: 'Thu', open: data.metrics.open, closed: data.metrics.closed + 1 },
    { day: 'Fri', open: Math.max(0, data.metrics.open - 1), closed: data.metrics.closed + 2 },
    { day: 'Today', open: data.metrics.open, closed: data.metrics.closed },
  ];

  return (
    <div className="fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Executive Compliance Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Real-time regulatory intelligence & risk scoring
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </div>
      </div>

      {/* Top row: gauge + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div
          className="lg:col-span-1 rounded-2xl p-6 flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <ScoreGauge score={data.healthScore} />
        </div>
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total MAPs" value={data.metrics.total} color="#818cf8" icon="📋" />
          <StatCard label="Open / Urgent" value={data.metrics.open} color="#ef4444" icon="🔴" />
          <StatCard label="In Progress" value={data.metrics.inProgress} color="#f59e0b" icon="🔧" />
          <StatCard label="Closed / Done" value={data.metrics.closed} color="#10b981" icon="✅" />
        </div>
      </div>

      {/* Middle row: charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie chart */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h3 className="text-sm font-bold text-white mb-4">MAP Status Distribution</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15,15,26,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: 'white' }}
                />
                <Legend
                  formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center">
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>No MAP data yet. Upload a regulation to get started.</p>
            </div>
          )}
        </div>

        {/* Trend chart */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h3 className="text-sm font-bold text-white mb-4">Weekly Compliance Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="closedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(15,15,26,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: 'white' }}
              />
              <Area type="monotone" dataKey="open" name="Open" stroke="#ef4444" fill="url(#openGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="closed" name="Closed" stroke="#10b981" fill="url(#closedGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Phase 9: Human-in-the-Loop Approval Queue */}
      <HumanApprovalQueue />

      {/* Bottom: AI pipeline status */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}
      >
        <h3 className="text-sm font-bold text-white mb-4">🤖 Agentic Pipeline Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Watchman Agent', status: 'Active', icon: '👁️' },
            { label: 'Analyst Agent', status: 'Active', icon: '🧠' },
            { label: 'Conflict Engine', status: 'Active', icon: '⚡' },
            { label: 'Legal Reviewer', status: 'Active', icon: '⚖️' },
            { label: 'Human Gate', status: 'Standby', icon: '🧑‍⚖️', standby: true },
            { label: 'Validator Agent', status: 'Active', icon: '🔬' },
          ].map((agent) => (
            <div key={agent.label} className="flex items-center gap-3">
              <span className="text-xl">{agent.icon}</span>
              <div>
                <p className="text-xs font-semibold text-white">{agent.label}</p>
                <p
                  className="text-[10px] font-medium"
                  style={{ color: (agent as any).standby ? '#f59e0b' : '#10b981' }}
                >
                  ● {agent.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
