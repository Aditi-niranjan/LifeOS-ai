import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, Command, LoaderCircle, LockKeyhole, LogIn, Mail, UserPlus } from 'lucide-react';

export type AuthMode = 'welcome' | 'signin' | 'signup';

type Props = {
  mode: AuthMode;
  setMode: (m: AuthMode) => void;
  configured: boolean;
  busy: boolean;
  error: string;
  info: string;
  onGoogle: () => void;
  onSignIn: (email: string, password: string) => void;
  onSignUp: (name: string, email: string, password: string) => void;
  onGuest: () => void;
};

function GoogleIcon() {
  return <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.9-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>;
}

export default function AuthScreen(p: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function submit(e: FormEvent) {
    e.preventDefault();
    if (p.mode === 'signup') p.onSignUp(name.trim(), email.trim(), password);
    else p.onSignIn(email.trim(), password);
  }

  return <div className="auth-screen app-shell dark">
    <div className="auth-card">
      <div className="auth-brand"><div className="brand-mark"><Command size={20}/></div><div className="brand-name">lifeos<span>ai</span></div></div>

      {p.mode === 'welcome' && <>
        <h1>Your Life. Your Goals. Your AI.</h1>
        <p className="auth-sub">Plan your day, track goals and get help from your AI assistant, all in one place.</p>
        <button type="button" className="auth-btn google" disabled={p.busy} onClick={p.onGoogle}>{p.busy ? <LoaderCircle size={18} className="spin"/> : <GoogleIcon/>} Continue with Google</button>
        <button type="button" className="auth-btn" onClick={() => p.setMode('signin')}><LogIn size={18}/> Sign in with email</button>
        <button type="button" className="auth-btn primary" onClick={() => p.setMode('signup')}><UserPlus size={18}/> Create account</button>
        <div className="auth-divider"><span>or</span></div>
        <button type="button" className="auth-link" onClick={p.onGuest}>Continue as guest</button>
      </>}

      {p.mode !== 'welcome' && <>
        <button type="button" className="auth-back" onClick={() => p.setMode('welcome')}><ArrowLeft size={16}/> Back</button>
        <h1>{p.mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
        <p className="auth-sub">{p.mode === 'signup' ? 'It takes less than a minute.' : 'Sign in to continue.'}</p>
        <form className="auth-form" onSubmit={submit}>
          {p.mode === 'signup' && <label>Name<input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required maxLength={40} autoComplete="name"/></label>}
          <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email"/></label>
          <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required minLength={6} autoComplete={p.mode === 'signup' ? 'new-password' : 'current-password'}/></label>
          <button className="auth-btn primary" disabled={p.busy}>{p.busy ? <LoaderCircle size={18} className="spin"/> : <Mail size={18}/>} {p.mode === 'signup' ? 'Create account' : 'Sign in'}</button>
        </form>
        <button type="button" className="auth-btn google" disabled={p.busy} onClick={p.onGoogle}><GoogleIcon/> Continue with Google</button>
        <button type="button" className="auth-link" onClick={() => p.setMode(p.mode === 'signup' ? 'signin' : 'signup')}>{p.mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create an account'}</button>
      </>}

      {p.error && <div className="auth-msg error" role="alert">{p.error}</div>}
      {p.info && <div className="auth-msg ok" role="status">{p.info}</div>}
      {!p.configured && <div className="auth-msg warn">Login is not connected yet (Supabase keys missing). You can still use the app as a guest.</div>}
      <div className="auth-privacy"><LockKeyhole size={13}/> Your tasks and goals stay in your account.</div>
    </div>
  </div>;
}
