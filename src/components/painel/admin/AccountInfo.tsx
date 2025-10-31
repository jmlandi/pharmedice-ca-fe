'use client';

import { useAuth } from '@/components/AuthProvider';

export default function AccountInfo() {
	const { user } = useAuth();

	if (!user) return null;

	return (
		<div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
			<h2 className="text-2xl font-bold text-gray-900 mb-6">Minha Conta</h2>

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
							<>
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#26364D] text-[#F5F2ED]">
									Verificado
								</span>
							</>
						) : (
							<>
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
									Não Verificado
								</span>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
