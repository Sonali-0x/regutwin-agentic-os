import { Outlet } from 'react-router-dom';

/* ============================================
   AuthLayout — Split design with gradient panel
   Matches the reference: gradient left + form right
   ============================================ */
export default function AuthLayout() {
  return (
    <div className="auth-container">
      {/* Left Gradient Panel */}
      <div className="auth-gradient-panel">
        <div className="auth-gradient-bg" />
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-blob auth-blob-3" />

        {/* Top icon */}
        <div className="auth-panel-content" style={{ position: 'absolute', top: '48px', left: '48px' }}>
          <span className="brand-icon brand-icon-white">✦</span>
        </div>

        {/* Bottom text */}
        <div className="auth-panel-content">
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', fontWeight: 400 }}>
            You can easily
          </p>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', lineHeight: 1.3, maxWidth: '320px' }}>
            Streamline your regulatory compliance with AI-powered intelligence
          </h2>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-wrapper fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
