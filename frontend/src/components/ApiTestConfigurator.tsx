import { useState } from 'react';
import api from '../services/api';

interface ApiTestConfiguratorProps {
  mapId: string;
  initialEndpoint?: string;
  initialConfig?: any;
  onValidationComplete: (result: any) => void;
}

export default function ApiTestConfigurator({ mapId, initialEndpoint, initialConfig, onValidationComplete }: ApiTestConfiguratorProps) {
  const [targetApiEndpoint, setTargetApiEndpoint] = useState(initialEndpoint || '');
  const [method, setMethod] = useState(initialConfig?.method || 'GET');
  const [payload, setPayload] = useState(initialConfig?.payload || '');
  const [expectedStatus, setExpectedStatus] = useState(initialConfig?.expectedStatus || 200);
  const [expectedSubstring, setExpectedSubstring] = useState(initialConfig?.expectedResponseSubstring || '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSaveAndTest = async () => {
    setLoading(true);
    setError('');
    
    try {
      // First save the config
      await api.put(`/maps/${mapId}`, {
        targetApiEndpoint,
        testConfig: {
          method,
          payload,
          expectedStatus: Number(expectedStatus),
          expectedResponseSubstring: expectedSubstring
        }
      });
      
      // Then trigger validation
      const response = await api.post(`/maps/${mapId}/validate`, {
        evidenceText: "Running autonomous live API validation."
      });
      
      onValidationComplete(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Validation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-black/40 border border-white/10 rounded-lg">
      <h3 className="text-sm font-bold text-white mb-3">Autonomous API Testing Configuration</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[var(--color-surface-400)] mb-1">Target Endpoint URL</label>
          <input
            type="text"
            value={targetApiEndpoint}
            onChange={e => setTargetApiEndpoint(e.target.value)}
            placeholder="http://api.internal/kyc"
            className="w-full bg-black/50 border border-white/20 text-white text-sm rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-surface-400)] mb-1">HTTP Method</label>
          <select
            value={method}
            onChange={e => setMethod(e.target.value)}
            className="w-full bg-black/50 border border-white/20 text-white text-sm rounded-lg p-2"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        {['POST', 'PUT'].includes(method) && (
          <div className="md:col-span-2">
            <label className="block text-xs text-[var(--color-surface-400)] mb-1">JSON Payload</label>
            <textarea
              value={payload}
              onChange={e => setPayload(e.target.value)}
              placeholder="{}"
              className="w-full bg-black/50 border border-white/20 text-white text-sm rounded-lg p-2 h-20 font-mono"
            />
          </div>
        )}
        <div>
          <label className="block text-xs text-[var(--color-surface-400)] mb-1">Expected Status Code</label>
          <input
            type="number"
            value={expectedStatus}
            onChange={e => setExpectedStatus(e.target.value)}
            className="w-full bg-black/50 border border-white/20 text-white text-sm rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--color-surface-400)] mb-1">Expected Response Substring</label>
          <input
            type="text"
            value={expectedSubstring}
            onChange={e => setExpectedSubstring(e.target.value)}
            placeholder='e.g., "timeout"'
            className="w-full bg-black/50 border border-white/20 text-white text-sm rounded-lg p-2"
          />
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={handleSaveAndTest}
          disabled={loading || !targetApiEndpoint}
          className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-bold rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Running AI Validator...' : 'Save & Run Live Test'}
        </button>
        {error && <span className="text-red-400 text-sm">{error}</span>}
      </div>
    </div>
  );
}
