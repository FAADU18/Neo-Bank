import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/services/api';
import { useFormState } from '@/hooks/useFormState';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { values, handleChange, reset } = useFormState({ 
    full_name: user?.full_name || '', 
    phone: user?.phone || '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [prefs, setPrefs] = useState({ 
    alerts: true, 
    payments: true, 
    marketing: false, 
    biometrics: true 
  });

  const togglePref = (key) => setPrefs((current) => ({ ...current, [key]: !current[key] }));

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.updateProfile({
        full_name: values.full_name,
        phone: values.phone
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoadingSpinner label="Loading profile..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Account</p>
        <h1 className="mt-2 font-display text-4xl text-white">Profile Settings</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={handleSaveProfile} className="glass-panel rounded-3xl p-6 space-y-5">
          <h2 className="font-display text-2xl text-white">Edit profile</h2>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-red-500/20 p-3 text-sm text-red-200 border border-red-500/30"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-emerald-500/20 p-3 text-sm text-emerald-200 border border-emerald-500/30"
            >
              Profile updated successfully!
            </motion.div>
          )}

          <Input 
            label="Full name" 
            name="full_name" 
            value={values.full_name} 
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          <Input 
            label="Email" 
            name="email" 
            type="email"
            value={user.email}
            disabled
            placeholder="Email cannot be changed"
          />
          <Input 
            label="Phone" 
            name="phone" 
            value={values.phone} 
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
          <Button 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save profile'}
          </Button>
        </form>

        <div className="glass-panel rounded-3xl p-6 space-y-5">
          <h2 className="font-display text-2xl text-white">Account information</h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Account Type</p>
              <p className="text-lg text-white font-semibold mt-2">{user.role === 'admin' ? 'Administrator' : 'Customer'}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Status</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                <span className="text-lg text-white font-semibold">{user.is_active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Member Since</p>
              <p className="text-lg text-white font-semibold mt-2">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <Button 
            variant="secondary" 
            className="w-full"
            onClick={logout}
          >
            Logout
          </Button>
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
            <button 
              key={key} 
              onClick={() => togglePref(key)} 
              className={`rounded-2xl border px-4 py-4 text-left transition ${prefs[key] ? 'border-cyan-400/30 bg-cyan-400/15 text-cyan-100' : 'border-white/8 bg-white/5 text-slate-300'}`}
            >
              <span className="text-sm font-medium">{label}</span>
              <span className="mt-1 block text-xs uppercase tracking-[0.28em]">{prefs[key] ? 'Enabled' : 'Disabled'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
