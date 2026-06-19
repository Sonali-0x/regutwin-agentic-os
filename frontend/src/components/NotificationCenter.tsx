import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

interface Alert {
  id: string;
  department: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationCenter() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:8000');
    
    socket.on('new_alert', (alert: Alert) => {
      setAlerts(prev => [alert, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const unreadCount = alerts.filter(a => !a.read).length;

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-white/10 rounded-full transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-black/90 border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-white font-bold">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-[var(--color-primary)] hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-4 text-center text-sm text-[var(--color-surface-400)]">
                No new alerts.
              </div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className={`p-4 border-b border-white/10 hover:bg-white/5 transition-colors ${!alert.read ? 'bg-red-500/10' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-red-400">{alert.department}</span>
                    <span className="text-xs text-[var(--color-surface-400)]">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{alert.subject}</h4>
                  <p className="text-xs text-[var(--color-surface-300)] line-clamp-3">{alert.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
