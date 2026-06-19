import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import NotificationCenter from '../components/NotificationCenter';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Upload Regulation',
    path: '/upload',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
    ),
  },
  {
    label: 'Regulations',
    path: '/regulations',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'MAP Tasks',
    path: '/maps',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: 'Audit Governance',
    path: '/audits',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: '#0f0f1a' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 h-screen flex flex-col w-[240px] z-50
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{
          background: 'rgba(18, 18, 36, 0.97)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            R
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">ReguTwin</p>
            <p className="text-[10px] font-medium uppercase tracking-widest" style={{ color: '#6366f1' }}>
              Agentic OS
            </p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Navigation
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)',
                  background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))' : 'transparent',
                  border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                }}
              >
                <span style={{ color: isActive ? '#818cf8' : 'rgba(255,255,255,0.3)' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Notifications + User */}
        <div className="px-3 py-4 border-t border-white/5 space-y-3">
          <div className="flex items-center justify-between px-3">
            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Alerts</span>
            <NotificationCenter />
          </div>
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              B
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">Bank Admin</p>
              <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>
                compliance@bank.com
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        {/* Mobile top bar */}
        <header
          className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3"
          style={{
            background: 'rgba(15,15,26,0.95)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              R
            </div>
            <span className="text-white font-bold text-sm">ReguTwin</span>
          </div>
          <NotificationCenter />
        </header>

        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
