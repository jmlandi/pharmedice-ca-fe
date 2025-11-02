'use client';

import { useState } from 'react';
import { User } from '@/lib/api';
import { AuthService, UpdateProfileData } from '@/lib/auth';
import { useAlert } from '@/components/AlertProvider';

interface ProfileEditModalProps {
	user: User;
	onClose: () => void;
	onSuccess: (updatedUser: User) => void;
}

export default function ProfileEditModal({ user, onClose, onSuccess }: ProfileEditModalProps) {
	const { showError, showSuccess } = useAlert();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<UpdateProfileData>({
		primeiro_nome: user.primeiro_nome,
		segundo_nome: user.segundo_nome,
		apelido: user.apelido || '',
		email: user.email,
		telefone: user.telefone || '',
		numero_documento: user.numero_documento || '',
		data_nascimento: user.data_nascimento || '',
		aceite_comunicacoes_email: user.aceite_comunicacoes_email || false,
		aceite_comunicacoes_sms: user.aceite_comunicacoes_sms || false,
		aceite_comunicacoes_whatsapp: user.aceite_comunicacoes_whatsapp || false,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleChange = (field: keyof UpdateProfileData, value: string | boolean) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		// Limpar erro do campo quando o usuário começar a digitar
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: '' }));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		// Validações obrigatórias (quando campos estão preenchidos)
		if (formData.primeiro_nome && formData.primeiro_nome.length < 2) {
			newErrors.primeiro_nome = 'Primeiro nome deve ter no mínimo 2 caracteres';
		}
		if (formData.segundo_nome && formData.segundo_nome.length < 2) {
			newErrors.segundo_nome = 'Segundo nome deve ter no mínimo 2 caracteres';
		}
		if (formData.apelido && formData.apelido.length < 3) {
			newErrors.apelido = 'Apelido deve ter no mínimo 3 caracteres';
		}
		if (formData.email && !formData.email.includes('@')) {
			newErrors.email = 'Email deve ser válido';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateForm()) {
			return;
		}

		setLoading(true);
		setErrors({});

		try {
			// Remover campos vazios do objeto
			const dataToSubmit = Object.entries(formData).reduce((acc, [key, value]) => {
				if (value !== '' && value !== null && value !== undefined) {
					acc[key as keyof UpdateProfileData] = value;
				}
				return acc;
			}, {} as UpdateProfileData);

			const updatedUser = await AuthService.updateProfile(dataToSubmit);
			showSuccess('Perfil atualizado com sucesso!');
			onSuccess(updatedUser);
		} catch (error) {
			console.error('Erro ao atualizar perfil:', error);
			
			// Tentar extrair erros de validação se existirem
			if (error instanceof Error) {
				showError(error.message);
			} else {
				showError('Erro ao atualizar perfil. Tente novamente.');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
				<div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
					<h2 className="text-2xl font-bold text-gray-900">Editar Meu Perfil</h2>
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
								required
							/>
							{errors.primeiro_nome && (
								<p className="mt-1 text-sm text-red-600">{errors.primeiro_nome}</p>
							)}
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Segundo Nome
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
								Apelido <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={formData.apelido || ''}
								onChange={(e) => handleChange('apelido', e.target.value)}
								className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4E7FC6] focus:border-transparent ${
									errors.apelido ? 'border-red-500' : 'border-gray-300'
								}`}
								disabled={loading}
								required
							/>
							{errors.apelido && (
								<p className="mt-1 text-sm text-red-600">{errors.apelido}</p>
							)}
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
								required
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600">{errors.email}</p>
							)}
							{formData.email !== user.email && (
								<p className="mt-1 text-sm text-yellow-600">
									⚠️ Alterar o email exigirá nova verificação
								</p>
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

						<div className="md:col-span-2">
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
							className="px-4 py-2 bg-[#4E7FC6] text-white rounded-lg hover:bg-[#26364D] transition-colors disabled:opacity-50"
							disabled={loading}
						>
							{loading ? 'Salvando...' : 'Salvar Alterações'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}