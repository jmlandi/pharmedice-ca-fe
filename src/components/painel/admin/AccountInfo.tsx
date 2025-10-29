'use client';

import { useAuth } from '@/components/AuthProvider';

export default function AccountInfo() {
	const { user } = useAuth();

	if (!user) return null;

	return (
		<div className="bg-[#252220] rounded-lg shadow-md p-6">
			<h2 className="text-2xl font-bold text-gray-100 mb-6">Minha Conta</h2>

			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-200 mb-1">
						Nome
					</label>
					<div className="text-gray-100">
						{user.primeiro_nome} {user.segundo_nome}
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-200 mb-1">
						Email
					</label>
					<div className="text-gray-100">{user.email}</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-200 mb-1">
						Tipo de Conta
					</label>
					<div className="text-gray-100">
						{user.tipo_usuario === 'administrador' ? 'Administrador' : 'Cliente'}
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-200 mb-1">
						Status de Verificação
					</label>
					<div className="flex items-center gap-2">
						{user.email_verificado ? (
							<>
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
