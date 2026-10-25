import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import { usePreferences } from '../context/Preferences';
export default function PasswordReset() {
  const [params] = useSearchParams(); const token = params.get('token');
  const { t } = usePreferences();
  const [email, setEmail] = useState(params.get('email') || '');
  const [password, setPassword] = useState(''); const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [done, setDone] = useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      await apiClient.post(token ? '/auth/reset-password' : '/auth/forgot-password', { email, token, password, password_confirmation: confirmation });
      setDone(true); setMessage(t(token ? 'Password reset successfully. Please sign in.' : 'If this email has an account, a reset link has been sent.'));
    } catch (err) { setMessage(t(err.payload?.message || 'Unable to reset password. Please try again.')); }
    finally { setBusy(false); }
  }
  return <section className="min-h-screen bg-gray-50 px-4 py-16"><form onSubmit={submit} className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm space-y-4">
    <h1 className="text-2xl font-bold">{t('Reset password')}</h1>
    <label className="block">{t('Email Address')}<input className="block w-full border border-gray-200 rounded-lg p-3" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
    {token && <><label className="block">{t('New password')}<input autoComplete="new-password" className="block w-full border border-gray-200 rounded-lg p-3" type="password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} /></label><label className="block">{t('Confirm password')}<input autoComplete="new-password" className="block w-full border border-gray-200 rounded-lg p-3" type="password" minLength={8} required value={confirmation} onChange={e => setConfirmation(e.target.value)} /></label></>}
    <p role="status">{message}</p>
    <button disabled={busy || done} className="bg-gray-900 text-white rounded-lg px-6 py-3 disabled:opacity-50">{t(busy ? 'Processing...' : token ? 'Reset password' : 'Send reset link')}</button>
    <Link className="block underline" to="/">{t('Back to store')}</Link>
  </form></section>;
}
