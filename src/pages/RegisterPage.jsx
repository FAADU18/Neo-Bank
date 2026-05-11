import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { values, handleChange } = useFormState({ fullName: '', email: '', password: '', agree: false });

  const validate = () => {
    const nextErrors = {};
    if (values.fullName.trim().length < 3) nextErrors.fullName = 'Enter your full name.';
    if (!values.email.includes('@')) nextErrors.email = 'Enter a valid email address.';
    if (values.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';
    if (!values.agree) nextErrors.agree = 'You must agree to the terms.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    await auth.register(values);
    navigate('/dashboard');
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

      <Input label="Full name" name="fullName" value={values.fullName} onChange={handleChange} error={errors.fullName} placeholder="Ariana Ray" />
      <Input label="Email address" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} placeholder="ariana@neobankx.com" />
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
      </div>

      <label className="flex items-start gap-3 text-sm text-slate-300">
        <input type="checkbox" name="agree" checked={values.agree} onChange={handleChange} className="mt-1 h-4 w-4 rounded border-cyan-400/20 bg-white/5 text-cyan-400" />
        <span>I agree to the NeoBankX terms and privacy policy.</span>
      </label>
      {errors.agree ? <p className="text-xs text-rose-300">{errors.agree}</p> : null}

      <Button className="w-full">Create account</Button>
    </form>
  );
}
