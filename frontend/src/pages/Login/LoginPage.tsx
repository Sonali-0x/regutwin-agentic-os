import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

/* ============================================
   LoginPage — Enterprise-grade auth screen
   ============================================ */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    // Simulate API call — replace with actual authService.login() later
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // On success, navigate to /upload or /dashboard
      // For now, just log and redirect
      console.log('Login payload:', { email, password });
      window.location.href = '/upload';
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Logo & Title */}
      <div className="text-center mb-8 fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-secondary-600)] mb-5 shadow-lg shadow-[var(--color-primary-600)]/20">
          <span className="text-white text-2xl font-bold">R</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back</h1>
        <p className="text-[var(--color-surface-200)] text-sm">
          Sign in to your ReguTwin account
        </p>
      </div>

      {/* Card */}
      <div className="glass-card p-8 fade-in fade-in-delay-1">
        <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-danger-600)]/10 border border-[var(--color-danger-600)]/20 text-[var(--color-danger-500)] text-sm fade-in">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              {error}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-[var(--color-surface-100)] mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-surface-300)]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </span>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@bank.com"
                autoComplete="email"
                className="glass-input w-full pl-12 pr-4 py-3.5 text-white placeholder-[var(--color-surface-400)] text-sm"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-[var(--color-surface-100)] mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-surface-300)]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="glass-input w-full pl-12 pr-12 py-3.5 text-white placeholder-[var(--color-surface-400)] text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-surface-300)] hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-[var(--color-surface-200)]">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-[var(--color-surface-500)] bg-transparent text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)] focus:ring-offset-0"
              />
              Remember me
            </label>
            <a href="#" className="text-[var(--color-primary-400)] hover:text-[var(--color-primary-300)] transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            id="login-submit"
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Signing in…</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 text-xs text-[var(--color-surface-400)]" style={{ background: 'rgba(21,29,53,0.7)' }}>
              New to ReguTwin?
            </span>
          </div>
        </div>

        {/* Sign Up Link */}
        <Link
          to="/auth/signup"
          className="btn-secondary w-full flex items-center justify-center"
          id="go-to-signup"
        >
          Create an account
        </Link>
      </div>

      {/* Footer */}
      <p className="text-center text-[var(--color-surface-400)] text-xs mt-6 fade-in fade-in-delay-3">
        Protected by enterprise-grade security · ReguTwin © {new Date().getFullYear()}
      </p>
    </div>
  );
}
