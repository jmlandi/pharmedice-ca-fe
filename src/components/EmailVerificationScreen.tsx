'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from './AuthProvider';
import { useAlert } from './AlertProvider';
import { useLoading } from './LoadingProvider';
import SubmitButton from './SubmitButton';
import { AuthService } from '@/lib/auth';

interface EmailVerificationScreenProps {
  onVerificationComplete: () => void;
}

export default function EmailVerificationScreen({ onVerificationComplete }: EmailVerificationScreenProps) {
  const { user, refreshUser, logout } = useAuth();
  const { showError, showSuccess } = useAlert();
  const { startLoading, stopLoading } = useLoading();
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  // Verificar periodicamente se o email foi verificado
  useEffect(() => {
    const checkVerification = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.error('Erro ao verificar status do email:', error);
      }
    };

    // Verificar a cada 5 segundos
    const interval = setInterval(checkVerification, 5000);

    return () => clearInterval(interval);
  }, [refreshUser]);

  // Verificar se email foi verificado e chamar callback
  useEffect(() => {
    if (user?.email_verificado) {
      onVerificationComplete();
    }
  }, [user?.email_verificado, onVerificationComplete]);

  // Controle do countdown para reenvio
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleResendVerification = async () => {
    setIsResending(true);
    startLoading();

    try {
      await AuthService.resendEmailVerification();
      showSuccess('Email de verificação reenviado com sucesso!');
      setCanResend(false);
      setCountdown(60); // 1 minuto de espera
    } catch (error: any) {
      console.error('Erro ao reenviar verificação:', error);
      const message = error?.message || 'Erro ao reenviar email de verificação';
      showError(message);
    } finally {
      setIsResending(false);
      stopLoading();
    }
  };

  const handleCheckVerification = async () => {
    startLoading();
    try {
      await refreshUser();
      showSuccess('Status de verificação atualizado!');
    } catch (error: any) {
      console.error('Erro ao verificar status:', error);
      showError('Erro ao verificar status de verificação');
    } finally {
      stopLoading();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Logo da Pharmedice */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Image
              src="/icons/pharmedice-logo.svg"
              alt="Pharmedice"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verifique seu e-mail
          </h1>
          <p className="text-gray-600 text-sm">
            Enviamos um link de verificação para
          </p>
          <p className="text-blue-600 font-medium text-sm">
            {user?.email}
          </p>
        </div>

        {/* Ícone de email */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-blue-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
          </div>
        </div>

        {/* Instruções */}
        <div className="text-center mb-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            Clique no link que enviamos para <strong>{user?.email}</strong> para verificar sua conta e acessar o painel.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Verificando automaticamente... ⟳
          </p>
        </div>

        {/* Botões */}
        <div className="space-y-3">
          <SubmitButton
            isLoading={isResending}
            disabled={!canResend}
            onClick={handleResendVerification}
            className="w-full"
          >
            {!canResend && countdown > 0 
              ? `Reenviar em ${countdown}s`
              : 'Reenviar e-mail de verificação'
            }
          </SubmitButton>

          {/* Botão para verificar manualmente */}
          <button
            onClick={handleCheckVerification}
            className="w-full px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          >
            ✓ Já verifiquei meu e-mail
          </button>

          {/* Link para voltar ao login */}
          <button
            onClick={handleLogout}
            className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Voltar ao login
          </button>
        </div>

        {/* Dica adicional */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <svg 
              className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
            <div>
              <p className="text-xs text-yellow-800 font-medium">
                Não recebeu o e-mail?
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Verifique sua caixa de spam ou pasta de lixo eletrônico.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}