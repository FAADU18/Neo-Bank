import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { useFormState } from '@/hooks/useFormState';

export default function RegisterPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const { values, handleChange } = useFormState({ 
    fullName: '', 
    email: '', 
    phone: '',
    password: '', 
    agree: false 
  });

  const validate = () => {
    const nextErrors = {};
    if (values.fullName.trim().length < 3) nextErrors.fullName = 'Enter your full name.';
    if (!values.email.includes('@')) nextErrors.email = 'Enter a valid email address.';
    if (values.phone.trim().length < 10) nextErrors.phone = 'Enter a valid phone number.';
    if (values.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(values.password)) nextErrors.password = 'Password must contain an uppercase letter.';
    if (!/[0-9]/.test(values.password)) nextErrors.password = 'Password must contain a number.';
    if (!/[!@#$%^&*()_+\-=]/.test(values.password)) nextErrors.password = 'Password must contain a special character.';
    if (!values.agree) nextErrors.agree = 'You must agree to the terms.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setApiError('');
      await auth.register(values.fullName, values.email, values.phone, values.password);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message);
    }
  };

  if (auth?.loading) {
    return <LoadingSpinner label="Creating NeoBankX account" />;
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Start your journey</p>
        <h2 className="mt-3 font-display text-3xl text-white">Create your account</h2>
      </div>

      {apiError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-500/20 p-3 text-sm text-red-200 border border-red-500/30"
        >
          {apiError}
        </motion.div>
      )}

      <Input 
        label="Full name" 
        name="fullName" 
        value={values.fullName} 
        onChange={handleChange} 
        error={errors.fullName} 
        placeholder="John Doe" 
      />

      <Input 
        label="Email address" 
        name="email" 
        type="email" 
        value={values.email} 
        onChange={handleChange} 
        error={errors.email} 
        placeholder="john@example.com" 
      />

      <Input 
        label="Phone number" 
        name="phone" 
        type="tel" 
        value={values.phone} 
        onChange={handleChange} 
        error={errors.phone} 
        placeholder="9876543210" 
      />

      <div>
        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Create a password"
        />
        <button type="button" onClick={() => setShowPassword((current) => !current)} className="mt-2 text-xs text-cyan-200 hover:text-cyan-100">
          {showPassword ? 'Hide password' : 'Show password'}
        </button>
        <p className="mt-2 text-xs text-slate-400">
          Password must contain: uppercase, number, special character (!@#$%^&*)
        </p>
      </div>

      <label className="flex items-start gap-3 text-sm text-slate-300">
        <input 
          type="checkbox" 
          name="agree" 
          checked={values.agree} 
          onChange={handleChange} 
          className="mt-1 h-4 w-4 rounded border-cyan-400/20 bg-white/5 text-cyan-400" 
        />
        <span>I agree to the NeoBankX terms and privacy policy.</span>
      </label>
      {errors.agree ? <p className="text-xs text-rose-300">{errors.agree}</p> : null}

      <Button className="w-full" disabled={auth?.loading}>
        {auth?.loading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}
