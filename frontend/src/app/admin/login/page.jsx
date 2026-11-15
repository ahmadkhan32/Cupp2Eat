'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/schemas/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Shield, Mail, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      // Sign in via Supabase
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Verify admin role directly from Supabase
      let role = data.user?.user_metadata?.role;
      try {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();
        if (roleData?.role) role = roleData.role;
      } catch (_) {}

      if (!['super_admin', 'org_admin', 'admin'].includes(role)) {
        await supabase.auth.signOut();
        toast.error('Access denied. This portal is for administrators only.');
        return;
      }

      toast.success(`Welcome, ${data.user?.user_metadata?.full_name || 'Admin'}!`);
      router.push('/admin/dashboard');
    } catch (err) {
      toast.error(err.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-brand-gold shadow-lg mb-4 bg-brand-green">
            <Image src="/logo/cup2eat-logo.png" alt="CUP2EAT Logo" fill sizes="80px" className="object-cover" priority />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-charcoal">Admin Portal</h1>
          <p className="text-gray-500 text-xs mt-1">CUP2EAT Multi-Role Administrative Access</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input {...register('email')} type="email" placeholder="admin@cup2eat.com" className="input-field pl-10" />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="input-field pl-10 pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-brand-green text-brand-gold border-2 border-brand-gold py-3 rounded-xl font-bold text-base hover:bg-brand-gold hover:text-brand-green transition-all duration-300 disabled:opacity-50">
            {loading ? 'Verifying access...' : 'Sign In to Admin'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          <a href="/" className="hover:text-brand-green">← Back to store</a>
        </p>

        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-xs text-amber-700 text-center">🔒 This portal is monitored and all logins are logged. Unauthorized access is prohibited.</p>
        </div>
      </div>
    </div>
  );
}
