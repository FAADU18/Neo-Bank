import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useFormState } from '@/hooks/useFormState';

export default function ProfilePage() {
  const profile = useFormState({ name: 'Neo Customer', email: 'neo@bankx.com', phone: '+1 555 0100' });
  const password = useFormState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [prefs, setPrefs] = useState({ alerts: true, payments: true, marketing: false, biometrics: true });

  const togglePref = (key) => setPrefs((current) => ({ ...current, [key]: !current[key] }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Account</p>
        <h1 className="mt-2 font-display text-4xl text-white">Profile Settings</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="glass-panel rounded-3xl p-6 space-y-5">
          <h2 className="font-display text-2xl text-white">Edit profile</h2>
          <Input label="Full name" name="name" value={profile.values.name} onChange={profile.handleChange} />
          <Input label="Email" name="email" value={profile.values.email} onChange={profile.handleChange} />
          <Input label="Phone" name="phone" value={profile.values.phone} onChange={profile.handleChange} />
          <Button>Save profile</Button>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-5">
          <h2 className="font-display text-2xl text-white">Security settings</h2>
          <Input label="Current password" name="currentPassword" type="password" value={password.values.currentPassword} onChange={password.handleChange} />
          <Input label="New password" name="newPassword" type="password" value={password.values.newPassword} onChange={password.handleChange} />
          <Input label="Confirm new password" name="confirmPassword" type="password" value={password.values.confirmPassword} onChange={password.handleChange} />
          <Button variant="secondary">Update password</Button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6">
        <h2 className="font-display text-2xl text-white">Notification preferences</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['alerts', 'Security alerts'],
            ['payments', 'Payment updates'],
            ['marketing', 'Product updates'],
            ['biometrics', 'Biometric login'],
          ].map(([key, label]) => (
            <button key={key} onClick={() => togglePref(key)} className={`rounded-2xl border px-4 py-4 text-left transition ${prefs[key] ? 'border-cyan-400/30 bg-cyan-400/15 text-cyan-100' : 'border-white/8 bg-white/5 text-slate-300'}`}>
              <span className="text-sm font-medium">{label}</span>
              <span className="mt-1 block text-xs uppercase tracking-[0.28em]">{prefs[key] ? 'Enabled' : 'Disabled'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
