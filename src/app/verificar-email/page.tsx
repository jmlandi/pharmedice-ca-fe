'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import EmailVerificationScreen from '@/components/EmailVerificationScreen';

export default function VerificarEmail() {
  const router = useRouter();
  const { isLoggedIn, isEmailVerified, isAdmin } = useAuth();

  useEffect(() => {
    // Se não estiver logado, redirecionar para login
    if (!isLoggedIn) {
      router.push('/cliente/entrar');
      return;
    }

    // Se já verificou o email, redirecionar para o painel apropriado
    if (isEmailVerified) {
      const redirectTo = isAdmin ? '/admin/painel' : '/cliente/painel';
      router.push(redirectTo);
      return;
    }
  }, [isLoggedIn, isEmailVerified, isAdmin, router]);

  // Se não estiver logado ou já tiver verificado o email, não renderizar nada
  if (!isLoggedIn || isEmailVerified) {
    return null;
  }

  return (
    <EmailVerificationScreen 
      onVerificationComplete={() => {
        // O redirecionamento será feito pelo useEffect acima
        // quando o isEmailVerified mudar para true
      }}
    />
  );
}