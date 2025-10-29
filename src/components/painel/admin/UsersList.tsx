'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { User } from '@/lib/api';
import { UsuariosService, ListUsersParams } from '@/lib/usuarios';
import { useAlert } from '@/components/AlertProvider';
import Pagination from '../Pagination';

interface UsersListProps {
	onEditUser: (user: User) => void;
	onViewUser: (user: User) => void;
}

export default function UsersList({ onEditUser, onViewUser }: UsersListProps) {
	const { showError, showSuccess } = useAlert();
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [perPage, setPerPage] = useState(15);
	const [filters, setFilters] = useState<ListUsersParams>({});
	const [searchInput, setSearchInput] = useState('');
	const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'administrador' | 'usuario'>('all');

	const loadUsers = async () => {
		try {
			setLoading(true);
			const params: ListUsersParams = {
				page: currentPage,
				per_page: perPage,
				...filters,
			};

			const response = await UsuariosService.list(params);
			setUsers(response.data);
			setTotalPages(response.last_page);
			setTotal(response.total);
		} catch (error) {
			console.error('Erro ao carregar usuários:', error);
			showError('Erro ao carregar lista de usuários');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, perPage, filters]);

	const handleSearch = () => {
		setCurrentPage(1);
		setFilters((prev) => ({
			...prev,
			nome: searchInput || undefined,
			email: searchInput || undefined,
		}));
	};

	const handleTypeFilterChange = (type: 'all' | 'administrador' | 'usuario') => {
		setUserTypeFilter(type);
		setCurrentPage(1);
		setFilters((prev) => ({
			...prev,
			tipo_usuario: type === 'all' ? undefined : type,
		}));
	};

	const handleDelete = async (user: User) => {
		if (!window.confirm(
			`Tem certeza que deseja remover o usuário "${user.primeiro_nome} ${user.segundo_nome}"? ` +
			'Esta ação irá marcar o usuário como inativo e ele não poderá mais acessar o sistema.'
		)) {
			return;
		}

		try {
			await UsuariosService.delete(user.id);
			showSuccess('Usuário removido com sucesso!');
			loadUsers();
		} catch (error) {
			console.error('Erro ao remover usuário:', error);
			showError('Erro ao remover usuário');
		}
	};

	if (loading && users.length === 0) {
		return (
			<div className="bg-[#F5F2ED] rounded-lg shadow-md p-8">
				<div className="animate-pulse space-y-4">
					<div className="h-4 bg-[#CCCCCC] rounded w-1/4"></div>
					<div className="space-y-3">
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="h-16 bg-[#CCCCCC] rounded"></div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-[#F5F2ED] rounded-lg shadow-md">
			<div className="p-6 border-b">
				<h2 className="text-2xl font-bold text-gray-900 mb-4">Gerenciar Usuários</h2>
				
				<div className="space-y-4">
					<div className="flex gap-2">
						<div className="flex-1 relative">
							<input
								type="text"
								placeholder="Buscar por nome ou email..."
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
								className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E7FC6] focus:border-transparent"
							/>
							<svg
								className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						<button
							onClick={handleSearch}
							className="px-6 py-2 bg-[#4E7FC6] text-white rounded-lg hover:bg-[#26364D] transition-colors"
						>
							Buscar
						</button>
					</div>

					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => handleTypeFilterChange('all')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								userTypeFilter === 'all'
									? 'bg-[#4E7FC6] text-white'
									: 'bg-[#E3D9CD] text-gray-700 hover:bg-[#DED1C1]'
							}`}
						>
							Todos
						</button>
						<button
							onClick={() => handleTypeFilterChange('administrador')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								userTypeFilter === 'administrador'
									? 'bg-[#4E7FC6] text-white'
									: 'bg-[#E3D9CD] text-gray-700 hover:bg-[#DED1C1]'
							}`}
						>
							Administradores
						</button>
						<button
							onClick={() => handleTypeFilterChange('usuario')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								userTypeFilter === 'usuario'
									? 'bg-[#4E7FC6] text-white'
									: 'bg-[#E3D9CD] text-gray-700 hover:bg-[#DED1C1]'
							}`}
						>
							Clientes
						</button>
					</div>

					<div className="flex items-center gap-2 text-sm text-gray-600">
						<span>Total: {total} usuário{total !== 1 ? 's' : ''}</span>
						<span>•</span>
						<select
							value={perPage}
							onChange={(e) => {
								setPerPage(Number(e.target.value));
								setCurrentPage(1);
							}}
							className="border rounded px-2 py-1"
						>
							<option value={10}>10 por página</option>
							<option value={15}>15 por página</option>
							<option value={25}>25 por página</option>
							<option value={50}>50 por página</option>
						</select>
					</div>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-[#E3D9CD]">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Usuário
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Email
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Tipo
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
								Ações
							</th>
						</tr>
					</thead>
					<tbody className="bg-[#F5F2ED] divide-y divide-gray-200">
						{users.length === 0 ? (
							<tr>
								<td colSpan={5} className="px-6 py-8 text-center text-gray-500">
									Nenhum usuário encontrado
								</td>
							</tr>
						) : (
							users.map((user) => (
								<tr key={user.id} className="hover:bg-[#E3D9CD] transition-colors">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											{user.avatar ? (
												<Image
													src={user.avatar}
													alt={user.primeiro_nome}
													width={40}
													height={40}
													className="rounded-full"
												/>
											) : (
												<div className="h-10 w-10 rounded-full bg-[#4E7FC6] flex items-center justify-center text-white font-semibold">
													{user.primeiro_nome[0]}{user.segundo_nome?.[0]}
												</div>
											)}
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900">
													{user.primeiro_nome} {user.segundo_nome}
												</div>
												{user.apelido && user.apelido !== user.primeiro_nome && (
													<div className="text-sm text-gray-500">
														{user.apelido}
													</div>
												)}
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm text-gray-900">{user.email}</div>
										{user.provider === 'google' && (
											<div className="text-xs text-gray-500 flex items-center gap-1">
												<svg className="w-3 h-3" viewBox="0 0 24 24">
													<path
														fill="currentColor"
														d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
													/>
													<path
														fill="currentColor"
														d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
													/>
													<path
														fill="currentColor"
														d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
													/>
													<path
														fill="currentColor"
														d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
													/>
												</svg>
												Google
											</div>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
												user.tipo_usuario === 'administrador'
													? 'bg-purple-100 text-purple-800'
													: 'bg-green-100 text-green-800'
											}`}
										>
											{user.tipo_usuario === 'administrador' ? 'Admin' : 'Cliente'}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex flex-col gap-1">
											{user.email_verified_at ? (
												<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
													Verificado
												</span>
											) : (
												<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
													Não Verificado
												</span>
											)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button
											onClick={() => onViewUser(user)}
											className="text-[#4E7FC6] hover:text-[#26364D] mr-3"
											title="Visualizar"
										>
											<svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										</button>
										<button
											onClick={() => onEditUser(user)}
											className="text-indigo-600 hover:text-indigo-900 mr-3"
											title="Editar"
										>
											<svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
											</svg>
										</button>
										<button
											onClick={() => handleDelete(user)}
											className="text-red-600 hover:text-red-900"
											title="Remover"
										>
											<svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{totalPages > 1 && (
				<div className="px-6 py-4 border-t">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				</div>
			)}
		</div>
	);
}
