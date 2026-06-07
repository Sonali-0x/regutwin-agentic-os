import { Outlet } from 'react-router-dom';

/* ============================================
   AuthLayout — Wraps login / signup pages
   with decorative orbs & grid overlay
   ============================================ */
export default function AuthLayout() {
  return (
    <div className="relative min-h-screen gradient-bg grid-pattern flex items-center justify-center overflow-hidden px-4 py-8">
      {/* Decorative floating orbs */}
      <div className="orb orb-blue" style={{ top: '-5%', left: '-8%' }} />
      <div className="orb orb-indigo" style={{ bottom: '10%', right: '-5%' }} />
      <div className="orb orb-green" style={{ top: '50%', left: '60%' }} />

      {/* Page content (Login or Signup) */}
      <div className="relative z-10 w-full max-w-md fade-in">
        <Outlet />
      </div>
    </div>
  );
}
