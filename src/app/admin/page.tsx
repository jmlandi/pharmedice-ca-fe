'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AdminHome() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-[#E3D9CD] to-[#DED1C1]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="flex justify-center mb-6">
						<Image
							src="/icons/pharmedice-logo.svg"
							alt="Pharmedice Logo"
							width={120}
							height={40}
							className="h-12 w-auto"
						/>
					</div>
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Área Administrativa
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Gerencie usuários, produtos e pedidos da plataforma Pharmedice
					</p>
				</div>

				{/* Cards de Ações */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
					{/* Login Card */}
					<div className="bg-[#F5F2ED] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
						<div className="p-6">
							<div className="flex items-center justify-center w-12 h-12 bg-[#DED1C1] rounded-lg mb-4">
								<svg
									className="w-6 h-6 text-[#4E7FC6]"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Login Administrativo
							</h3>
							<p className="text-gray-600 mb-4">
								Acesse sua conta administrativa para gerenciar a plataforma
							</p>
							<Link
								href="/admin/entrar"
								className="inline-flex items-center px-4 py-2 bg-[#4E7FC6] text-white font-medium rounded-lg hover:bg-[#26364D] transition-colors"
							>
								Fazer Login
								<svg
									className="ml-2 w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Link>
						</div>
					</div>

					{/* Signup Card */}
					<div className="bg-[#F5F2ED] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
						<div className="p-6">
							<div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
								<svg
									className="w-6 h-6 text-green-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Criar Conta
							</h3>
							<p className="text-gray-600 mb-4">
								Registre-se como administrador da Pharmedice
							</p>
							<Link
								href="/admin/cadastro"
								className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
							>
								Registrar-se
								<svg
									className="ml-2 w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Link>
						</div>
					</div>

					{/* Dashboard Preview Card */}
					<div className="bg-[#F5F2ED] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
						<div className="p-6">
							<div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
								<svg
									className="w-6 h-6 text-purple-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">
								Dashboard (Preview)
							</h3>
							<p className="text-gray-600 mb-4">
								Visualize como será o painel administrativo
							</p>
							<Link
								href="/admin/painel"
								className="inline-flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
							>
								Ver Preview
								<svg
									className="ml-2 w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Link>
						</div>
					</div>
				</div>

				{/* Info Section */}
				<div className="bg-[#F5F2ED] rounded-xl shadow-lg p-8 mb-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
						Recursos da Área Administrativa
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="space-y-4">
							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0 w-6 h-6 bg-[#DED1C1] rounded-full flex items-center justify-center mt-1">
									<svg
										className="w-3 h-3 text-[#4E7FC6]"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div>
									<h3 className="font-semibold text-gray-900">
										Gerenciamento de Usuários
									</h3>
									<p className="text-gray-600">
										Visualize, edite e gerencie contas de clientes
									</p>
								</div>
							</div>
							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0 w-6 h-6 bg-[#DED1C1] rounded-full flex items-center justify-center mt-1">
									<svg
										className="w-3 h-3 text-[#4E7FC6]"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div>
									<h3 className="font-semibold text-gray-900">
										Controle de Produtos
									</h3>
									<p className="text-gray-600">
										Adicione, edite e gerencie o catálogo de produtos
									</p>
								</div>
							</div>
							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0 w-6 h-6 bg-[#DED1C1] rounded-full flex items-center justify-center mt-1">
									<svg
										className="w-3 h-3 text-[#4E7FC6]"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div>
									<h3 className="font-semibold text-gray-900">
										Gestão de Pedidos
									</h3>
									<p className="text-gray-600">
										Processe e acompanhe todos os pedidos da plataforma
									</p>
								</div>
							</div>
						</div>
						<div className="space-y-4">
							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0 w-6 h-6 bg-[#DED1C1] rounded-full flex items-center justify-center mt-1">
									<svg
										className="w-3 h-3 text-[#4E7FC6]"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div>
									<h3 className="font-semibold text-gray-900">
										Relatórios e Analytics
									</h3>
									<p className="text-gray-600">
										Visualize estatísticas e relatórios detalhados
									</p>
								</div>
							</div>
							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0 w-6 h-6 bg-[#DED1C1] rounded-full flex items-center justify-center mt-1">
									<svg
										className="w-3 h-3 text-[#4E7FC6]"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div>
									<h3 className="font-semibold text-gray-900">
										Configurações do Sistema
									</h3>
									<p className="text-gray-600">
										Gerencie configurações e preferências da plataforma
									</p>
								</div>
							</div>
							<div className="flex items-start space-x-3">
								<div className="flex-shrink-0 w-6 h-6 bg-[#DED1C1] rounded-full flex items-center justify-center mt-1">
									<svg
										className="w-3 h-3 text-[#4E7FC6]"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<div>
									<h3 className="font-semibold text-gray-900">
										Segurança Avançada
									</h3>
									<p className="text-gray-600">
										Acesso restrito apenas para domínios corporativos
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Security Notice */}
				<div className="bg-[#E3D9CD] border border-blue-200 rounded-lg p-6">
					<div className="flex items-start space-x-3">
						<svg
							className="flex-shrink-0 w-6 h-6 text-[#4E7FC6] mt-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
						<div>
							<h3 className="font-semibold text-blue-900 mb-2">
								Acesso Restrito
							</h3>
							<p className="text-blue-800">
								Esta área é destinada exclusivamente para colaboradores da
								Pharmedice. Apenas e-mails corporativos (@pharmedice.com.br e
								@marcoslandi.com) podem criar contas administrativas.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
