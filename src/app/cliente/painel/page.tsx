'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OptimizedImage from '@/components/OptimizedImage';
import PageTransition from '@/components/PageTransition';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/components/AuthProvider';
import { useAlert } from '@/components/AlertProvider';
import { LaudosService } from '@/lib/laudos';
import { Laudo } from '@/lib/api';

interface LaudoCardProps {
  laudo: Laudo;
  onDownload: (id: string) => void;
}

function LaudoCard({ laudo, onDownload }: LaudoCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {laudo.titulo}
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            {laudo.descricao}
          </p>
          <p className="text-xs text-gray-500">
            Criado em: {LaudosService.formatDate(laudo.created_at)}
          </p>
        </div>
        <div className="ml-4">
          <Image
            src="/icons/document.svg"
            alt="Laudo"
            width={24}
            height={24}
            className="text-blue-600"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onDownload(laudo.id)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Image
            src="/icons/download.svg"
            alt="Download"
            width={16}
            height={16}
          />
          Download
        </button>
      </div>
    </div>
  );
}

function SearchBar({ 
  value, 
  onChange, 
  onSearch 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  onSearch: () => void; 
}) {
  return (
    <div className="flex gap-2 mb-6">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Buscar laudos por título ou descrição..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Image
          src="/icons/search.svg"
          alt="Buscar"
          width={20}
          height={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
      </div>
      <button
        onClick={onSearch}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Buscar
      </button>
    </div>
  );
}

function ClientePainelContent() {
  const router = useRouter();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { showError, showSuccess } = useAlert();
  const [laudos, setLaudos] = useState<Laudo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Verificar se é admin e redirecionar
  useEffect(() => {
    if (isAdmin) {
      router.push('/admin/painel');
      return;
    }
  }, [isAdmin, router]);

  // Carregar laudos
  useEffect(() => {
    if (!isAdmin) {
      loadLaudos();
    }
  }, [isAdmin, currentPage]);

  const loadLaudos = async () => {
    try {
      setLoading(true);
      const response = await LaudosService.list(currentPage);
      setLaudos(response.data);
      setTotalPages(response.last_page);
    } catch (error: any) {
      console.error('Erro ao carregar laudos:', error);
      showError('Erro ao carregar laudos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadLaudos();
      return;
    }

    try {
      setIsSearching(true);
      const response = await LaudosService.search(searchTerm);
      setLaudos(response.data);
      setTotalPages(response.last_page);
    } catch (error: any) {
      console.error('Erro ao buscar laudos:', error);
      showError('Erro ao buscar laudos. Tente novamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownload = async (laudoId: string) => {
    try {
      const blob = await LaudosService.download(laudoId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `laudo_${laudoId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSuccess('Download iniciado!');
    } catch (error: any) {
      console.error('Erro ao fazer download:', error);
      showError('Erro ao fazer download do laudo. Tente novamente.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logout realizado com sucesso!');
      router.push('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  if (!isLoggedIn || isAdmin) {
    return null; // Será redirecionado
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <OptimizedImage
                  src="/icons/pharmedice-logo.svg"
                  alt="Logo da Pharmédice"
                  width={72}
                  height={24}
                  className="max-h-8"
                />
                <h1 className="text-xl font-semibold text-gray-900">
                  Área do Cliente
                </h1>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Olá, {user?.primeiro_nome}!
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Laudos Técnicos
            </h2>
            <p className="text-gray-600">
              Visualize e faça download dos laudos técnicos disponíveis.
            </p>
          </div>

          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
          />

          {loading || isSearching ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">
                {isSearching ? 'Buscando...' : 'Carregando...'}
              </span>
            </div>
          ) : laudos.length === 0 ? (
            <div className="text-center py-12">
              <Image
                src="/icons/document.svg"
                alt="Nenhum laudo"
                width={64}
                height={64}
                className="mx-auto mb-4 opacity-50"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum laudo encontrado' : 'Nenhum laudo disponível'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Tente buscar com outros termos.' 
                  : 'Seus laudos aparecerão aqui quando estiverem disponíveis.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {laudos.map((laudo) => (
                  <LaudoCard
                    key={laudo.id}
                    laudo={laudo}
                    onDownload={handleDownload}
                  />
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  
                  <span className="px-4 py-1">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </PageTransition>
  );
}

export default function ClientePainel() {
  return (
    <ProtectedRoute requireEmailVerification={true}>
      <ClientePainelContent />
    </ProtectedRoute>
  );
}
