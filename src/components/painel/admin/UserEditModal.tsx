'use client';

import { useState } from 'react';
import { User } from '@/lib/api';
import { UsuariosService, UpdateUserData } from '@/lib/usuarios';
import { useAlert } from '@/components/AlertProvider';

interface UserEditModalProps {
	user: User;
	onClose: () => void;
	onSuccess: () => void;
}

export default function UserEditModal({ user, onClose, onSuccess }: UserEditModalProps) {
	const { showError, showSuccess } = useAlert();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<UpdateUserData>({
		primeiro_nome: user.primeiro_nome,
		segundo_nome: user.segundo_nome,
		apelido: user.apelido || '',
		email: user.email,
		telefone: user.telefone || '',
		numero_documento: user.numero_documento || '',
		data_nascimento: user.data_nascimento || '',
		tipo_usuario: user.tipo_usuario,
		aceite_comunicacoes_email: user.aceite_comunicacoes_email || false,
		aceite_comunicacoes_sms: user.aceite_comunicacoes_sms || false,
		aceite_comunicacoes_whatsapp: user.aceite_comunicacoes_whatsapp || false,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [showPasswordField, setShowPasswordField] = useState(false);

	const handleChange = (field: keyof UpdateUserData, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[field];
				return newErrors;
			});
		}
	};

	const validate = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.primeiro_nome?.trim()) {
			newErrors.primeiro_nome = 'Primeiro nome é obrigatório';
		}
		if (!formData.segundo_nome?.trim()) {
			newErrors.segundo_nome = 'Segundo nome é obrigatório';
		}
		if (!formData.email?.trim()) {
			newErrors.email = 'Email é obrigatório';
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email inválido';
		}
		if (showPasswordField && formData.senha && formData.senha.length < 6) {
			newErrors.senha = 'Senha deve ter no mínimo 6 caracteres';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validate()) {
			showError('Por favor, corrija os erros no formulário');
			return;
		}

		try {
			setLoading(true);
			
			// Remove senha do payload se não estiver sendo alterada
			const dataToSend = { ...formData };
			if (!showPasswordField || !dataToSend.senha) {
				delete dataToSend.senha;
			}

			await UsuariosService.update(user.id, dataToSend);
			showSuccess('Usuário atualizado com sucesso!');
			onSuccess();
		} catch (err) {
			console.error('Erro ao atualizar usuário:', err);
			const error = err as { response?: { data?: { erros?: Record<string, string[]>; mensagem?: string } } };
			
			if (error.response?.data?.erros) {
				const apiErrors: Record<string, string> = {};
				Object.entries(error.response.data.erros).forEach(([key, value]) => {
					apiErrors[key] = Array.isArray(value) ? value[0] : String(value);
				});
				setErrors(apiErrors);
				showError('Erro de validação. Verifique os campos.');
			} else {
				showError(error.response?.data?.mensagem || 'Erro ao atualizar usuário');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
				<div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
					<h2 className="text-2xl font-bold text-gray-900">Editar Usuário</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
						disabled={loading}
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Primeiro Nome <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={formData.primeiro_nome || ''}
								onChange={(e) => handleChange('primeiro_nome', e.target.value)}
								className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4E7FC6] focus:border-transparent ${
									errors.primeiro_nome ? 'border-red-500' : 'border-gray-300'
								}`}
								disabled={loading}
							/>
							{errors.primeiro_nome && (
								<p className="mt-1 text-sm text-red-600">{errors.primeiro_nome}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Segundo Nome <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={formData.segundo_nome || ''}
								onChange={(e) => handleChange('segundo_nome', e.target.value)}
								className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4E7FC6] focus:border-transparent ${
									errors.segundo_nome ? 'border-red-500' : 'border-gray-300'
								}`}
								disabled={loading}
							/>
							{errors.segundo_nome && (
								<p className="mt-1 text-sm text-red-600">{errors.segundo_nome}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Apelido
							</label>
							<input
								type="text"
								value={formData.apelido || ''}
								onChange={(e) => handleChange('apelido', e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E7FC6] focus:border-transparent"
								disabled={loading}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email <span className="text-red-500">*</span>
							</label>
							<input
								type="email"
								value={formData.email || ''}
								onChange={(e) => handleChange('email', e.target.value)}
								className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4E7FC6] focus:border-transparent ${
									errors.email ? 'border-red-500' : 'border-gray-300'
								}`}
								disabled={loading}
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600">{errors.email}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Telefone
							</label>
							<input
								type="tel"
								value={formData.telefone || ''}
								onChange={(e) => handleChange('telefone', e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E7FC6] focus:border-transparent"
								disabled={loading}
								placeholder="(00) 00000-0000"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								CPF/Documento
							</label>
							<input
								type="text"
								value={formData.numero_documento || ''}
								onChange={(e) => handleChange('numero_documento', e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E7FC6] focus:border-transparent"
								disabled={loading}
								placeholder="000.000.000-00"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Data de Nascimento
							</label>
							<input
								type="date"
								value={formData.data_nascimento || ''}
								onChange={(e) => handleChange('data_nascimento', e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E7FC6] focus:border-transparent"
								disabled={loading}
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Tipo de Usuário
							</label>
							<select
								value={formData.tipo_usuario || 'usuario'}
								onChange={(e) => handleChange('tipo_usuario', e.target.value as 'administrador' | 'usuario')}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E7FC6] focus:border-transparent"
								disabled={loading}
							>
								<option value="usuario">Cliente</option>
								<option value="administrador">Administrador</option>
							</select>
						</div>
					</div>

					<div className="mt-6">
						<button
							type="button"
							onClick={() => setShowPasswordField(!showPasswordField)}
							className="text-[#4E7FC6] hover:text-blue-700 text-sm font-medium"
						>
							{showPasswordField ? '− Cancelar alteração de senha' : '+ Alterar senha'}
						</button>
						
						{showPasswordField && (
							<div className="mt-3">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Nova Senha
								</label>
								<input
									type="password"
									value={formData.senha || ''}
									onChange={(e) => handleChange('senha', e.target.value)}
									className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4E7FC6] focus:border-transparent ${
										errors.senha ? 'border-red-500' : 'border-gray-300'
									}`}
									disabled={loading}
									placeholder="Mínimo 6 caracteres"
								/>
								{errors.senha && (
									<p className="mt-1 text-sm text-red-600">{errors.senha}</p>
								)}
								<p className="mt-1 text-sm text-gray-500">
									Deixe em branco para manter a senha atual
								</p>
							</div>
						)}
					</div>

					<div className="mt-6">
						<label className="block text-sm font-medium text-gray-700 mb-3">
							Preferências de Comunicação
						</label>
						<div className="space-y-2">
							<div className="flex items-center">
								<input
									type="checkbox"
									checked={formData.aceite_comunicacoes_email || false}
									onChange={(e) => handleChange('aceite_comunicacoes_email', e.target.checked)}
									className="h-4 w-4 text-[#4E7FC6] rounded focus:ring-[#4E7FC6]"
									disabled={loading}
								/>
								<label className="ml-2 text-sm text-gray-700">
									Aceita comunicações por Email
								</label>
							</div>
							<div className="flex items-center">
								<input
									type="checkbox"
									checked={formData.aceite_comunicacoes_sms || false}
									onChange={(e) => handleChange('aceite_comunicacoes_sms', e.target.checked)}
									className="h-4 w-4 text-[#4E7FC6] rounded focus:ring-[#4E7FC6]"
									disabled={loading}
								/>
								<label className="ml-2 text-sm text-gray-700">
									Aceita comunicações por SMS
								</label>
							</div>
							<div className="flex items-center">
								<input
									type="checkbox"
									checked={formData.aceite_comunicacoes_whatsapp || false}
									onChange={(e) => handleChange('aceite_comunicacoes_whatsapp', e.target.checked)}
									className="h-4 w-4 text-[#4E7FC6] rounded focus:ring-[#4E7FC6]"
									disabled={loading}
								/>
								<label className="ml-2 text-sm text-gray-700">
									Aceita comunicações por WhatsApp
								</label>
							</div>
						</div>
					</div>

					<div className="mt-6 pt-6 border-t bg-[#E3D9CD] -mx-6 px-6 py-4 flex justify-end gap-3 sticky bottom-0">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
							disabled={loading}
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="px-6 py-2 bg-[#4E7FC6] text-white rounded-lg hover:bg-[#26364D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
							disabled={loading}
						>
							{loading && (
								<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
								</svg>
							)}
							{loading ? 'Salvando...' : 'Salvar Alterações'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
