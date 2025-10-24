'use client';

import { User } from '@/lib/api';
import Image from 'next/image';

interface UserViewModalProps {
	user: User;
	onClose: () => void;
	onEdit: () => void;
}

export default function UserViewModal({ user, onClose, onEdit }: UserViewModalProps) {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6 border-b flex items-center justify-between">
					<h2 className="text-2xl font-bold text-gray-900">Detalhes do Usuário</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<div className="p-6">
					<div className="flex items-center mb-6">
						{user.avatar ? (
							<Image
								src={user.avatar}
								alt={user.primeiro_nome}
								width={80}
								height={80}
								className="rounded-full"
							/>
						) : (
							<div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
								{user.primeiro_nome[0]}{user.segundo_nome?.[0]}
							</div>
						)}
						<div className="ml-4">
							<h3 className="text-xl font-bold text-gray-900">
								{user.primeiro_nome} {user.segundo_nome}
							</h3>
							{user.apelido && user.apelido !== user.primeiro_nome && (
								<p className="text-gray-600">{user.apelido}</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email
							</label>
							<p className="text-gray-900">{user.email}</p>
							{user.email_verified_at ? (
								<span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
									✓ Verificado
								</span>
							) : (
								<span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
									Não Verificado
								</span>
							)}
						</div>

						{user.telefone && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Telefone
								</label>
								<p className="text-gray-900">{user.telefone}</p>
							</div>
						)}

						{user.numero_documento && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									CPF/Documento
								</label>
								<p className="text-gray-900">{user.numero_documento}</p>
							</div>
						)}

						{user.data_nascimento && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Data de Nascimento
								</label>
								<p className="text-gray-900">
									{new Date(user.data_nascimento).toLocaleDateString('pt-BR')}
								</p>
							</div>
						)}

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Tipo de Usuário
							</label>
							<span
								className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
									user.tipo_usuario === 'administrador'
										? 'bg-purple-100 text-purple-800'
										: 'bg-green-100 text-green-800'
								}`}
							>
								{user.tipo_usuario === 'administrador' ? 'Administrador' : 'Cliente'}
							</span>
						</div>

						{user.provider && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Método de Login
								</label>
								<p className="text-gray-900 capitalize">{user.provider}</p>
							</div>
						)}
					</div>

					{(user.aceite_comunicacoes_email !== undefined || 
					  user.aceite_comunicacoes_sms !== undefined || 
					  user.aceite_comunicacoes_whatsapp !== undefined) && (
						<div className="mt-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Preferências de Comunicação
							</label>
							<div className="space-y-2">
								{user.aceite_comunicacoes_email !== undefined && (
									<div className="flex items-center">
										<input
											type="checkbox"
											checked={user.aceite_comunicacoes_email}
											disabled
											className="h-4 w-4 text-blue-600 rounded"
										/>
										<label className="ml-2 text-sm text-gray-700">
											Email
										</label>
									</div>
								)}
								{user.aceite_comunicacoes_sms !== undefined && (
									<div className="flex items-center">
										<input
											type="checkbox"
											checked={user.aceite_comunicacoes_sms}
											disabled
											className="h-4 w-4 text-blue-600 rounded"
										/>
										<label className="ml-2 text-sm text-gray-700">
											SMS
										</label>
									</div>
								)}
								{user.aceite_comunicacoes_whatsapp !== undefined && (
									<div className="flex items-center">
										<input
											type="checkbox"
											checked={user.aceite_comunicacoes_whatsapp}
											disabled
											className="h-4 w-4 text-blue-600 rounded"
										/>
										<label className="ml-2 text-sm text-gray-700">
											WhatsApp
										</label>
									</div>
								)}
							</div>
						</div>
					)}

					{user.created_at && (
						<div className="mt-6 pt-6 border-t">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
								<div>
									<span className="font-medium">Cadastrado em:</span>{' '}
									{new Date(user.created_at).toLocaleString('pt-BR')}
								</div>
								{user.updated_at && (
									<div>
										<span className="font-medium">Última atualização:</span>{' '}
										{new Date(user.updated_at).toLocaleString('pt-BR')}
									</div>
								)}
							</div>
						</div>
					)}
				</div>

				<div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
					<button
						onClick={onClose}
						className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
					>
						Fechar
					</button>
					<button
						onClick={onEdit}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Editar Usuário
					</button>
				</div>
			</div>
		</div>
	);
}
