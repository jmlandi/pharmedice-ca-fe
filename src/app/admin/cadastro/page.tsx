'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import FormField from '@/components/FormField';
import SubmitButton from '@/components/SubmitButton';
import { useAlert } from '@/components/AlertProvider';
import { useLoading } from '@/components/LoadingProvider';
import { useAuth } from '@/components/AuthProvider';
import {
	formatDocument,
	formatPhone,
	isValidEmail,
	isValidCPF,
	isValidPhone,
	cleanString,
} from '@/lib/utils';

interface AdminSignupFormData {
	first_name: string;
	last_name: string;
	nickname: string;
	phone_number: string;
	email: string;
	password: string;
	confirmPassword: string;
	document_number: string;
	birth_date: string;
	accept_email_communications: boolean;
	accept_sms_communications: boolean;
	accept_whatsapp_communications: boolean;
	accept_terms_of_use: boolean;
	accept_privacy_policy: boolean;
}

interface AdminSignupFormErrors {
	first_name?: string;
	last_name?: string;
	nickname?: string;
	phone_number?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
	document_number?: string;
	birth_date?: string;
	accept_terms_of_use?: string;
	accept_privacy_policy?: string;
}

function AdminSignupForm() {
	const router = useRouter();
	const { showSuccess, showError } = useAlert();
	const { startLoading, stopLoading } = useLoading();
	const { registerAdmin, isLoggedIn, isAdmin } = useAuth();
	const [formData, setFormData] = useState<AdminSignupFormData>({
		first_name: '',
		last_name: '',
		nickname: '',
		phone_number: '',
		email: '',
		password: '',
		confirmPassword: '',
		document_number: '',
		birth_date: '',
		accept_email_communications: true,
		accept_sms_communications: true,
		accept_whatsapp_communications: true,
		accept_terms_of_use: false,
		accept_privacy_policy: false,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<AdminSignupFormErrors>({});

	// Redirecionar se já estiver logado
	useEffect(() => {
		if (isLoggedIn) {
			const redirectTo = isAdmin ? '/admin/painel' : '/cliente/painel';
			router.push(redirectTo);
		}
	}, [isLoggedIn, isAdmin, router]);

	const handleInputChange = (
		field: keyof AdminSignupFormData,
		value: string | boolean
	) => {
		let formattedValue = value;

		if (typeof value === 'string') {
			if (field === 'document_number') {
				formattedValue = formatDocument(value);
			} else if (field === 'phone_number') {
				formattedValue = formatPhone(value);
			}
		}

		setFormData((prev) => {
			const updatedData = {
				...prev,
				[field]: formattedValue,
			};

			// Auto-fill nickname with first word of first_name
			if (
				field === 'first_name' &&
				typeof formattedValue === 'string' &&
				formattedValue.trim()
			) {
				const firstWord = formattedValue.trim().split(' ')[0];
				updatedData.nickname = firstWord;
			}

			return updatedData;
		});

		// Clear error when user starts typing
		if (field in errors && errors[field as keyof AdminSignupFormErrors]) {
			setErrors((prev) => ({
				...prev,
				[field]: undefined,
			}));
		}

		// Clear nickname error when first_name changes and auto-fills nickname
		if (
			field === 'first_name' &&
			typeof value === 'string' &&
			value.trim() &&
			errors.nickname
		) {
			setErrors((prev) => ({
				...prev,
				nickname: undefined,
			}));
		}
	};

	const isValidAdminEmail = (email: string): boolean => {
		if (!isValidEmail(email)) return false;
		const domain = email.split('@')[1];
		return domain === 'pharmedice.com.br' || domain === 'marcoslandi.com';
	};

	const validateForm = (): boolean => {
		const newErrors: AdminSignupFormErrors = {};

		// Validação do primeiro nome
		if (!formData.first_name.trim()) {
			newErrors.first_name = 'O primeiro nome é obrigatório';
		} else if (formData.first_name.length < 2) {
			newErrors.first_name = 'O primeiro nome deve ter pelo menos 2 caracteres';
		} else if (formData.first_name.length > 50) {
			newErrors.first_name = 'O primeiro nome deve ter no máximo 50 caracteres';
		} else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(formData.first_name)) {
			newErrors.first_name =
				'O primeiro nome deve conter apenas letras e espaços';
		}

		// Validação do segundo nome
		if (!formData.last_name.trim()) {
			newErrors.last_name = 'O segundo nome é obrigatório';
		} else if (formData.last_name.length < 2) {
			newErrors.last_name = 'O segundo nome deve ter pelo menos 2 caracteres';
		} else if (formData.last_name.length > 50) {
			newErrors.last_name = 'O segundo nome deve ter no máximo 50 caracteres';
		} else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(formData.last_name)) {
			newErrors.last_name =
				'O segundo nome deve conter apenas letras e espaços';
		}

		// Validação do apelido
		if (!formData.nickname.trim()) {
			newErrors.nickname = 'O apelido é obrigatório';
		} else if (formData.nickname.length < 3) {
			newErrors.nickname = 'O apelido deve ter pelo menos 3 caracteres';
		} else if (formData.nickname.length > 30) {
			newErrors.nickname = 'O apelido deve ter no máximo 30 caracteres';
		} else if (!/^[A-Za-zÀ-ÿ0-9\s]+$/.test(formData.nickname)) {
			newErrors.nickname =
				'O apelido deve conter apenas letras, números e espaços';
		}

		// Validação do telefone
		if (!formData.phone_number.trim()) {
			newErrors.phone_number = 'O telefone é obrigatório';
		} else if (!isValidPhone(formData.phone_number)) {
			newErrors.phone_number =
				'O telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX';
		}

		// Validação do email (admin específico)
		if (!formData.email.trim()) {
			newErrors.email = 'O email é obrigatório';
		} else if (!isValidAdminEmail(formData.email)) {
			newErrors.email = 'E-mail deve ser @pharmedice.com.br';
		} else if (formData.email.length > 255) {
			newErrors.email = 'O email deve ter no máximo 255 caracteres';
		}

		// Validação da senha
		if (!formData.password.trim()) {
			newErrors.password = 'A senha é obrigatória';
		} else if (formData.password.length < 8) {
			newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
		} else if (formData.password.length > 50) {
			newErrors.password = 'A senha deve ter no máximo 50 caracteres';
		} else if (
			!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
				formData.password
			)
		) {
			newErrors.password =
				'A senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial (@$!%*?&)';
		}

		// Validação da confirmação de senha
		if (!formData.confirmPassword.trim()) {
			newErrors.confirmPassword = 'A confirmação da senha é obrigatória';
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword =
				'A confirmação da senha deve ser igual à senha';
		}

		// Validação do CPF
		if (!formData.document_number.trim()) {
			newErrors.document_number = 'O CPF é obrigatório';
		} else if (!isValidCPF(formData.document_number)) {
			newErrors.document_number = 'CPF deve ter 11 dígitos';
		}

		// Validação da data de nascimento
		if (!formData.birth_date.trim()) {
			newErrors.birth_date = 'A data de nascimento é obrigatória';
		} else {
			const birthDate = new Date(formData.birth_date);
			const today = new Date();
			const minDate = new Date('1900-01-01');

			if (isNaN(birthDate.getTime())) {
				newErrors.birth_date = 'A data de nascimento deve ser uma data válida';
			} else if (birthDate >= today) {
				newErrors.birth_date = 'A data de nascimento deve ser anterior a hoje';
			} else if (birthDate <= minDate) {
				newErrors.birth_date = 'A data de nascimento deve ser posterior a 1900';
			}
		}

		// Validação dos termos obrigatórios
		if (!formData.accept_terms_of_use) {
			newErrors.accept_terms_of_use = 'É obrigatório aceitar os termos de uso';
		}

		if (!formData.accept_privacy_policy) {
			newErrors.accept_privacy_policy =
				'É obrigatório aceitar a política de privacidade';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		startLoading();

		try {
			// Preparar dados no formato esperado pela API
			const registerData = {
				primeiro_nome: formData.first_name,
				segundo_nome: formData.last_name,
				apelido: formData.nickname,
				email: formData.email,
				senha: formData.password,
				senha_confirmation: formData.confirmPassword,
				confirmacao_senha: formData.confirmPassword,
				telefone: formData.phone_number,
				numero_documento: cleanString(formData.document_number),
				data_nascimento: formData.birth_date,
				aceite_comunicacoes_email: formData.accept_email_communications,
				aceite_comunicacoes_sms: formData.accept_sms_communications,
				aceite_comunicacoes_whatsapp: formData.accept_whatsapp_communications,
				aceite_termos_uso: formData.accept_terms_of_use,
				aceite_politica_privacidade: formData.accept_privacy_policy,
			};

			await registerAdmin(registerData);
			showSuccess(
				'Conta administrativa criada com sucesso! Você já está logado.'
			);
			router.push('/admin/painel');
		} catch (error: any) {
			console.error('Erro no cadastro do admin:', error);

			// Tratar erro 422 com erros específicos de validação
			if (error?.response?.status === 422 && error?.response?.data?.erros) {
				const serverErrors: AdminSignupFormErrors = {};
				const apiErrors = error.response.data.erros;

				// Mapear erros da API para os campos do formulário
				Object.keys(apiErrors).forEach((field) => {
					let formField: keyof AdminSignupFormErrors;

					// Mapear campos da API para campos do formulário
					switch (field) {
						case 'primeiro_nome':
							formField = 'first_name';
							break;
						case 'segundo_nome':
							formField = 'last_name';
							break;
						case 'apelido':
							formField = 'nickname';
							break;
						case 'telefone':
							formField = 'phone_number';
							break;
						case 'numero_documento':
							formField = 'document_number';
							break;
						case 'data_nascimento':
							formField = 'birth_date';
							break;
						case 'senha':
							formField = 'password';
							break;
						case 'senha_confirmation':
						case 'confirmacao_senha':
							formField = 'confirmPassword';
							break;
						case 'aceite_termos_uso':
							formField = 'accept_terms_of_use';
							break;
						case 'aceite_politica_privacidade':
							formField = 'accept_privacy_policy';
							break;
						default:
							formField = field as keyof AdminSignupFormErrors;
					}

					// Usar a primeira mensagem de erro para o campo
					if (apiErrors[field] && apiErrors[field].length > 0) {
						serverErrors[formField] = apiErrors[field][0];
					}
				});

				setErrors(serverErrors);
				showError('Por favor, corrija os erros nos campos destacados.');
			} else {
				const message =
					error?.response?.data?.mensagem ||
					error?.response?.data?.message ||
					error?.message ||
					'Erro ao criar conta administrativa. Tente novamente.';
				showError(message);
			}
		} finally {
			setIsLoading(false);
			stopLoading();
		}
	};

	return (
		<div className="w-full max-w-lg mx-auto">
			<div className="text-center mb-6">
				<div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
					<svg
						className="w-8 h-8 text-green-600"
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
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Criar Conta Administrativa
				</h1>
				<p className="text-gray-600">
					Registre-se para acessar o painel administrativo
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 w-[300px] md:w-full md:max-w-[420px] md:p-1 max-h-[80vh] overflow-y-auto"
			>
				<FormField
					label="Primeiro Nome"
					icon="/icons/account.svg"
					iconAlt="Ícone de usuário"
					type="text"
					placeholder="Digite seu primeiro nome"
					value={formData.first_name}
					error={errors.first_name}
					onChange={(value) => handleInputChange('first_name', value)}
				/>

				<FormField
					label="Segundo Nome"
					icon="/icons/account.svg"
					iconAlt="Ícone de usuário"
					type="text"
					placeholder="Digite seu segundo nome"
					value={formData.last_name}
					error={errors.last_name}
					onChange={(value) => handleInputChange('last_name', value)}
				/>

				<FormField
					label="Como gostaria de ser chamado"
					icon="/icons/account.svg"
					iconAlt="Ícone de usuário"
					type="text"
					placeholder="Como prefere ser chamado?"
					value={formData.nickname}
					error={errors.nickname}
					onChange={(value) => handleInputChange('nickname', value)}
				/>

				<FormField
					label="Número Celular/Telefone"
					icon="/icons/account.svg"
					iconAlt="Ícone de telefone"
					type="tel"
					placeholder="(11) 91234-1234 ou (11) 1234-1234"
					value={formData.phone_number}
					error={errors.phone_number}
					maxLength={15}
					onChange={(value) => handleInputChange('phone_number', value)}
				/>

				<FormField
					label="CPF"
					icon="/icons/account.svg"
					iconAlt="Ícone de documento"
					type="text"
					placeholder="000.000.000-00"
					value={formData.document_number}
					error={errors.document_number}
					maxLength={14}
					onChange={(value) => handleInputChange('document_number', value)}
				/>

				<FormField
					label="Data de Nascimento"
					icon="/icons/account.svg"
					iconAlt="Ícone de calendário"
					type="date"
					placeholder=""
					value={formData.birth_date}
					error={errors.birth_date}
					onChange={(value) => handleInputChange('birth_date', value)}
				/>

				<FormField
					label="E-mail Corporativo"
					icon="/icons/account.svg"
					iconAlt="Ícone de e-mail"
					type="email"
					placeholder="seu.email@pharmedice.com.br"
					value={formData.email}
					error={errors.email}
					onChange={(value) => handleInputChange('email', value)}
				/>

				<FormField
					label="Senha"
					icon="/icons/lock.svg"
					iconAlt="Ícone de cadeado"
					type="password"
					placeholder="Digite sua senha"
					value={formData.password}
					error={errors.password}
					onChange={(value) => handleInputChange('password', value)}
				/>

				<FormField
					label="Confirmação de Senha"
					icon="/icons/lock.svg"
					iconAlt="Ícone de cadeado"
					type="password"
					placeholder="Confirme sua senha"
					value={formData.confirmPassword}
					error={errors.confirmPassword}
					onChange={(value) => handleInputChange('confirmPassword', value)}
				/>

				{/* Seção de Preferências de Comunicação */}
				<div className="flex flex-col gap-3 mt-4">
					<h3 className="text-sm font-medium text-gray-700">
						Preferências de Comunicação:
					</h3>

					<label className="flex items-center gap-2 text-sm text-gray-600">
						<input
							type="checkbox"
							checked={formData.accept_email_communications}
							onChange={(e) =>
								handleInputChange(
									'accept_email_communications',
									e.target.checked
								)
							}
							className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						Aceito receber comunicações por e-mail
					</label>

					<label className="flex items-center gap-2 text-sm text-gray-600">
						<input
							type="checkbox"
							checked={formData.accept_sms_communications}
							onChange={(e) =>
								handleInputChange('accept_sms_communications', e.target.checked)
							}
							className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						Aceito receber comunicações por SMS
					</label>

					<label className="flex items-center gap-2 text-sm text-gray-600">
						<input
							type="checkbox"
							checked={formData.accept_whatsapp_communications}
							onChange={(e) =>
								handleInputChange(
									'accept_whatsapp_communications',
									e.target.checked
								)
							}
							className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						Aceito receber comunicações por WhatsApp
					</label>
				</div>

				{/* Seção de Termos Obrigatórios */}
				<div className="flex flex-col gap-3 mt-4">
					<h3 className="text-sm font-medium text-gray-700">
						Termos e Condições:
					</h3>

					<label className="flex items-start gap-2 text-sm text-gray-600">
						<input
							type="checkbox"
							checked={formData.accept_terms_of_use}
							onChange={(e) =>
								handleInputChange('accept_terms_of_use', e.target.checked)
							}
							className="rounded border-gray-300 text-[#527BC6] focus:ring-[#527BC6] mt-0.5"
						/>
						<span>
							Li e aceito os{' '}
							<a
								href="/termos-uso"
								target="_blank"
								className="text-[#527BC6] underline hover:opacity-70"
							>
								Termos de Uso
							</a>{' '}
							<span className="text-red-500">*</span>
						</span>
					</label>
					{errors.accept_terms_of_use && (
						<span className="text-red-500 text-xs">
							{errors.accept_terms_of_use}
						</span>
					)}

					<label className="flex items-start gap-2 text-sm text-gray-600">
						<input
							type="checkbox"
							checked={formData.accept_privacy_policy}
							onChange={(e) =>
								handleInputChange('accept_privacy_policy', e.target.checked)
							}
							className="rounded border-gray-300 text-[#527BC6] focus:ring-[#527BC6] mt-0.5"
						/>
						<span>
							Li e aceito a{' '}
							<a
								href="/politica-privacidade"
								target="_blank"
								className="text-[#527BC6] underline hover:opacity-70"
							>
								Política de Privacidade
							</a>{' '}
							<span className="text-red-500">*</span>
						</span>
					</label>
					{errors.accept_privacy_policy && (
						<span className="text-red-500 text-xs">
							{errors.accept_privacy_policy}
						</span>
					)}
				</div>

				<div className="pt-4">
					<SubmitButton isLoading={isLoading} className="w-full">
						{isLoading ? 'Criando conta...' : 'Criar Conta Administrativa'}
					</SubmitButton>
				</div>

				<div className="text-center">
					<span className="text-gray-600">
						Já tem uma conta administrativa?{' '}
					</span>
					<Link
						href="/admin/entrar"
						className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
					>
						Fazer login
					</Link>
				</div>
			</form>

			<div className="mt-6 p-4 bg-blue-50 rounded-lg">
				<p className="text-sm text-blue-700">
					<strong>Nota:</strong> Apenas colaboradores com e-mail corporativo
					(@pharmedice.com.br) podem criar contas administrativas.
				</p>
			</div>
		</div>
	);
}

export default function AdminSignup() {
	return (
		<AuthLayout title="Cadastro Administrativo">
			<AdminSignupForm />
		</AuthLayout>
	);
}
