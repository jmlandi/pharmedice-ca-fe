'use client';

import { useAuth } from './AuthProvider';
import EmailVerificationScreen from './EmailVerificationScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireEmailVerification = true 
}: ProtectedRouteProps) {
  const { user, isLoggedIn, isEmailVerified } = useAuth();

  // Se não estiver logado, não renderiza nada (será redirecionado pelo middleware ou pelas páginas)
  if (!isLoggedIn || !user) {
    return null;
  }

  // Se requer verificação de email e o email não foi verificado
  if (requireEmailVerification && !isEmailVerified) {
    return (
      <EmailVerificationScreen 
        onVerificationComplete={() => {
          // A verificação será detectada automaticamente pelo useAuth
          // e a página será re-renderizada
        }} 
      />
    );
  }

  // Se tudo estiver ok, renderiza os children
  return <>{children}</>;
}