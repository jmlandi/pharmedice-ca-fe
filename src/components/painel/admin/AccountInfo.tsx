'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import ProfileEditModal from '@/components/ProfileEditModal';
import { User } from '@/lib/api';

export default function AccountInfo() {
	const { user, updateUser } = useAuth();
	const [showEditModal, setShowEditModal] = useState(false);

	const handleEditSuccess = (updatedUser: User) => {
		updateUser(updatedUser);
		setShowEditModal(false);
	};

	if (!user) return null;

	return (
		<>
			<div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
				<div className="flex justify-between items-start mb-6">
					<h2 className="text-2xl font-bold text-gray-900">Minha Conta</h2>
					<button
						onClick={() => setShowEditModal(true)}
						className="px-4 py-2 bg-[#4E7FC6] text-white rounded-lg hover:bg-[#26364D] transition-colors flex items-center gap-2"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
						Editar Perfil
					</button>
				</div>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Nome
						</label>
						<div className="text-gray-900">
							{user.primeiro_nome} {user.segundo_nome}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<div className="text-gray-900">{user.email}</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Tipo de Conta
						</label>
						<div className="text-gray-900">
							{user.tipo_usuario === 'administrador' ? 'Administrador' : 'Cliente'}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Status de Verificação
						</label>
						<div className="flex items-center gap-2">
							{user.email_verificado ? (
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#26364D] text-[#F5F2ED]">
									Verificado
								</span>
							) : (
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
									Não Verificado
								</span>
							)}
						</div>
					</div>

					{user.apelido && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Apelido
							</label>
							<div className="text-gray-900">{user.apelido}</div>
						</div>
					)}

					{user.telefone && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Telefone
							</label>
							<div className="text-gray-900">{user.telefone}</div>
						</div>
					)}

					{user.numero_documento && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								CPF/Documento
							</label>
							<div className="text-gray-900">{user.numero_documento}</div>
						</div>
					)}

					{user.data_nascimento && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Data de Nascimento
							</label>
							<div className="text-gray-900">
								{new Date(user.data_nascimento).toLocaleDateString('pt-BR')}
							</div>
						</div>
					)}

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Preferências de Comunicação
						</label>
						<div className="space-y-1 text-sm">
							<div className="flex items-center gap-2">
								<span className={`w-2 h-2 rounded-full ${user.aceite_comunicacoes_email ? 'bg-green-500' : 'bg-gray-300'}`}></span>
								<span className="text-gray-700">Email: {user.aceite_comunicacoes_email ? 'Aceito' : 'Recusado'}</span>
							</div>
							<div className="flex items-center gap-2">
								<span className={`w-2 h-2 rounded-full ${user.aceite_comunicacoes_sms ? 'bg-green-500' : 'bg-gray-300'}`}></span>
								<span className="text-gray-700">SMS: {user.aceite_comunicacoes_sms ? 'Aceito' : 'Recusado'}</span>
							</div>
							<div className="flex items-center gap-2">
								<span className={`w-2 h-2 rounded-full ${user.aceite_comunicacoes_whatsapp ? 'bg-green-500' : 'bg-gray-300'}`}></span>
								<span className="text-gray-700">WhatsApp: {user.aceite_comunicacoes_whatsapp ? 'Aceito' : 'Recusado'}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{showEditModal && (
				<ProfileEditModal
					user={user}
					onClose={() => setShowEditModal(false)}
					onSuccess={handleEditSuccess}
				/>
			)}
		</>
	);
}
