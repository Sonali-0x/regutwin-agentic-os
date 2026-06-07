import { Outlet, Link, useLocation } from 'react-router-dom';

/* ============================================
   DashboardLayout — Shell for authenticated
   pages (upload, future dashboard, etc.)
   ============================================ */

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Upload', path: '/upload', icon: '📄' },
  { label: 'Regulations', path: '/regulations', icon: '📋' },
  { label: 'Validation', path: '/validation', icon: '✅' },
];

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen gradient-bg grid-pattern flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] glass border-r border-white/5 p-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-600)] flex items-center justify-center text-white font-bold text-lg">
            R
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">ReguTwin</h1>
            <span className="text-[var(--color-surface-300)] text-xs tracking-wider uppercase">Agentic OS</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-[var(--color-primary-600)]/15 text-[var(--color-primary-400)] border border-[var(--color-primary-600)]/20'
                    : 'text-[var(--color-surface-200)] hover:bg-white/5 hover:text-white'
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section (placeholder) */}
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-600)] flex items-center justify-center text-white text-sm font-semibold">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">Test User</p>
            <p className="text-[var(--color-surface-300)] text-xs truncate">test@regutwin.com</p>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar (mobile) */}
        <header className="lg:hidden glass border-b border-white/5 p-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-600)] flex items-center justify-center text-white font-bold text-sm">
              R
            </div>
            <span className="text-white font-bold">ReguTwin</span>
          </Link>
          {/* Mobile nav links */}
          <nav className="flex gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                    ${isActive
                      ? 'bg-[var(--color-primary-600)]/20 text-[var(--color-primary-400)]'
                      : 'text-[var(--color-surface-300)] hover:text-white'
                    }`}
                >
                  {item.icon}
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
