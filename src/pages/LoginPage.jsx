import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { useFormState } from '@/hooks/useFormState';

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { values, handleChange } = useFormState({ email: '', password: '' });

  const validate = () => {
    const nextErrors = {};
    if (!values.email.includes('@')) nextErrors.email = 'Enter a valid email address.';
    if (values.password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    await auth.login(values);
    navigate('/dashboard');
  };

  if (auth?.loading) {
    return <LoadingSpinner label="Signing into NeoBankX" />;
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Secure access</p>
        <h2 className="mt-3 font-display text-3xl text-white">Welcome back</h2>
      </div>

      <Input label="Email address" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="neo@bank.com" />

      <div>
        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
        />
        <button type="button" onClick={() => setShowPassword((current) => !current)} className="mt-2 text-xs text-cyan-200 hover:text-cyan-100">
          {showPassword ? 'Hide password' : 'Show password'}
        </button>
      </div>

      <Button className="w-full">Login to dashboard</Button>
      <p className="text-center text-sm text-slate-400">Use any email ending with admin to preview the admin dashboard.</p>
    </form>
  );
}
