'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AdminDashboardData {
	totalUsers: number;
	totalOrders: number;
	pendingOrders: number;
	revenue: number;
}

function AdminDashboard() {
	const [dashboardData, setDashboardData] = useState<AdminDashboardData>({
		totalUsers: 0,
		totalOrders: 0,
		pendingOrders: 0,
		revenue: 0,
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// TODO: Implementar chamada da API para buscar dados do dashboard
		const fetchDashboardData = async () => {
			try {
				// Simulação de dados
				await new Promise(resolve => setTimeout(resolve, 1000));
				setDashboardData({
					totalUsers: 1250,
					totalOrders: 8450,
					pendingOrders: 23,
					revenue: 125000.50,
				});
			} catch (error) {
				console.error('Erro ao carregar dados do dashboard:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(value);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="bg-white p-6 rounded-lg shadow">
									<div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
									<div className="h-8 bg-gray-200 rounded w-3/4"></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex justify-between items-center">
						<div className="flex items-center space-x-4">
							<h1 className="text-2xl font-bold text-gray-900">
								Painel Administrativo
							</h1>
							<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
								Pharmedice Admin
							</span>
						</div>
						<div className="flex items-center space-x-4">
							<Link
								href="/"
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								Ver Site
							</Link>
							<Link
								href="/cliente/painel"
								className="text-gray-600 hover:text-gray-900 transition-colors"
							>
								Área do Cliente
							</Link>
							<button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">
								Sair
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-6 py-8">
				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-white overflow-hidden shadow rounded-lg">
						<div className="p-5">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
									</svg>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">
											Total de Usuários
										</dt>
										<dd className="text-lg font-medium text-gray-900">
											{dashboardData.totalUsers.toLocaleString()}
										</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white overflow-hidden shadow rounded-lg">
						<div className="p-5">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 11h14l-1 7H6l-1-7z" />
									</svg>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">
											Total de Pedidos
										</dt>
										<dd className="text-lg font-medium text-gray-900">
											{dashboardData.totalOrders.toLocaleString()}
										</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white overflow-hidden shadow rounded-lg">
						<div className="p-5">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">
											Pedidos Pendentes
										</dt>
										<dd className="text-lg font-medium text-gray-900">
											{dashboardData.pendingOrders}
										</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-white overflow-hidden shadow rounded-lg">
						<div className="p-5">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
									</svg>
								</div>
								<div className="ml-5 w-0 flex-1">
									<dl>
										<dt className="text-sm font-medium text-gray-500 truncate">
											Receita Total
										</dt>
										<dd className="text-lg font-medium text-gray-900">
											{formatCurrency(dashboardData.revenue)}
										</dd>
									</dl>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="bg-white shadow rounded-lg mb-8">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-lg font-medium text-gray-900">Ações Rápidas</h2>
					</div>
					<div className="p-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
								<svg className="h-8 w-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
								<div className="text-left">
									<p className="font-medium text-gray-900">Novo Produto</p>
									<p className="text-sm text-gray-500">Adicionar produto ao catálogo</p>
								</div>
							</button>

							<button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
								<svg className="h-8 w-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								<div className="text-left">
									<p className="font-medium text-gray-900">Gerenciar Pedidos</p>
									<p className="text-sm text-gray-500">Ver e processar pedidos</p>
								</div>
							</button>

							<button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
								<svg className="h-8 w-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
								<div className="text-left">
									<p className="font-medium text-gray-900">Gerenciar Usuários</p>
									<p className="text-sm text-gray-500">Administrar contas de usuários</p>
								</div>
							</button>
						</div>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="bg-white shadow rounded-lg">
					<div className="px-6 py-4 border-b border-gray-200">
						<h2 className="text-lg font-medium text-gray-900">Atividade Recente</h2>
					</div>
					<div className="p-6">
						<div className="space-y-4">
							<div className="flex items-center space-x-3">
								<div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full"></div>
								<p className="text-sm text-gray-600">
									<span className="font-medium">João Silva</span> fez um novo pedido
									<span className="text-gray-400 ml-2">há 5 minutos</span>
								</p>
							</div>
							<div className="flex items-center space-x-3">
								<div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full"></div>
								<p className="text-sm text-gray-600">
									<span className="font-medium">Maria Santos</span> se cadastrou no sistema
									<span className="text-gray-400 ml-2">há 1 hora</span>
								</p>
							</div>
							<div className="flex items-center space-x-3">
								<div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full"></div>
								<p className="text-sm text-gray-600">
									Produto <span className="font-medium">Vitamina D3</span> está com estoque baixo
									<span className="text-gray-400 ml-2">há 2 horas</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

export default function AdminDashboardPage() {
	return <AdminDashboard />;
}