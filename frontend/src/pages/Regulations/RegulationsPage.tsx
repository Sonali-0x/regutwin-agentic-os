import { useState, useEffect } from 'react';
import api from '../../services/api';

interface Obligation {
  requirement: string;
  priority: string;
  category: string;
}

interface Deadline {
  description: string;
  date: string;
}

interface Regulation {
  _id: string;
  title: string;
  source: string;
  status: string;
  analysis?: {
    title?: string;
    summary?: string;
    obligations: Obligation[];
    deadlines: Deadline[];
    affectedDepartments: string[];
    affectedSystems: string[];
    riskLevel?: string;
  };
}

export default function RegulationsPage() {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegulations = async () => {
      try {
        const response = await api.get('/regulations');
        setRegulations(response.data);
      } catch (error) {
        console.error('Failed to fetch regulations', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegulations();
  }, []);

  if (loading) {
    return <div className="page-center-wrapper"><p className="text-white">Loading regulations...</p></div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Regulations Explorer</h1>
          <p className="text-[var(--color-surface-300)]">Monitor active regulations and AI-extracted obligations.</p>
        </div>
      </div>

      {regulations.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-[var(--color-surface-300)]">No regulations found. Upload a document to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {regulations.map((reg) => (
            <div key={reg._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{reg.analysis?.title || reg.title}</h2>
                  <p className="text-sm text-[var(--color-surface-400)] mt-1">Source: {reg.source} • Status: <span className="text-[var(--color-primary)]">{reg.status}</span></p>
                </div>
                {reg.analysis?.riskLevel && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    reg.analysis.riskLevel.toUpperCase() === 'HIGH' || reg.analysis.riskLevel.toUpperCase() === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                    reg.analysis.riskLevel.toUpperCase() === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                    'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}>
                    {reg.analysis.riskLevel} RISK
                  </span>
                )}
              </div>

              {reg.analysis?.summary && (
                <p className="text-[var(--color-surface-300)] mb-6 text-sm">{reg.analysis.summary}</p>
              )}

              {reg.analysis && reg.analysis.obligations && reg.analysis.obligations.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-[var(--color-surface-200)] mb-3 uppercase tracking-wider">Extracted Obligations</h3>
                  <div className="grid gap-3">
                    {reg.analysis.obligations.map((ob, idx) => (
                      <div key={idx} className="flex flex-col bg-black/40 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-white font-medium text-sm">{ob.requirement}</span>
                          <span className="text-xs px-2 py-1 bg-white/10 rounded text-[var(--color-surface-300)]">{ob.priority} Priority</span>
                        </div>
                        <span className="text-xs text-[var(--color-surface-400)]">{ob.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
