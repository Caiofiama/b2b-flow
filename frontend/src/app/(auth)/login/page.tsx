'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

import { User } from '@/types';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@b2bflow.com',
      password: 'Admin123!',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await apiFetch<{ user: User; token?: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.token) {
        localStorage.setItem('access_token', response.token);
        document.cookie = `access_token=${response.token}; path=/; max-age=28800; SameSite=Lax`;
      }

      setUser(response.user);
      toast.success('Bem-vindo ao B2B Flow!');
      window.location.href = '/';
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/30 mb-3">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">B2B Flow</h1>
          <p className="text-xs text-slate-400 mt-1">Plataforma de Gestão B2B & Inteligência Comercial</p>
        </div>

        <Card className="border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Acessar Conta</CardTitle>
            <CardDescription className="text-xs">
              Insira suas credenciais de acesso corporativo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">E-mail Corporativo</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="voce@empresa.com"
                    className="pl-9"
                  />
                </div>
                {errors.email && (
                  <span className="text-xs text-red-400 mt-1">{errors.email.message}</span>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Senha</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                  />
                </div>
                {errors.password && (
                  <span className="text-xs text-red-400 mt-1">{errors.password.message}</span>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 py-2.5 gap-2 mt-2"
              >
                <span>{loading ? 'Autenticando...' : 'Entrar no Sistema'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
              <p className="text-[11px] text-slate-500">
                Credencial de teste: <code className="text-blue-400 font-mono">admin@b2bflow.com</code> / <code className="text-blue-400 font-mono">Admin123!</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
