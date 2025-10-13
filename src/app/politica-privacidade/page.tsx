'use client';

import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';

export default function PrivacyPolicyPage() {
	const navigationLinks = (
		<div className="flex flex-col gap-2 text-sm text-[#527BC6] w-full text-center">
			<p>
				<Link href="/cliente/cadastro" className="underline hover:opacity-70">
					Voltar ao Cadastro de Cliente
				</Link>
			</p>
		</div>
	);

	return (
		<AuthLayout title="Política de Privacidade" navigationLinks={navigationLinks}>
			<div className="max-h-[500px] overflow-y-auto pr-2">
				<div className="space-y-6 text-sm text-gray-700 leading-relaxed">
					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">1. Informações que Coletamos</h2>
						<p className="mb-3">
							Coletamos informações que você nos fornece diretamente, como quando você cria uma conta, 
							preenche formulários ou entra em contato conosco. Isso pode incluir:
						</p>
						<ul className="list-disc list-inside space-y-1 ml-4">
							<li>Nome completo e apelido</li>
							<li>Endereço de e-mail</li>
							<li>Número de telefone</li>
							<li>Documento de identificação (CPF/CNPJ)</li>
							<li>Data de nascimento</li>
							<li>Informações de comunicação e preferências</li>
						</ul>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">2. Como Utilizamos suas Informações</h2>
						<p className="mb-3">Utilizamos as informações coletadas para:</p>
						<ul className="list-disc list-inside space-y-1 ml-4">
							<li>Fornecer, operar e manter nossos serviços</li>
							<li>Processar transações e enviar confirmações</li>
							<li>Enviar informações administrativas e atualizações</li>
							<li>Personalizar sua experiência em nossa plataforma</li>
							<li>Comunicar-nos com você sobre produtos e serviços (conforme suas preferências)</li>
							<li>Cumprir obrigações legais e regulamentares</li>
						</ul>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">3. Compartilhamento de Informações</h2>
						<p className="mb-3">
							Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros para 
							fins comerciais, exceto nas seguintes situações:
						</p>
						<ul className="list-disc list-inside space-y-1 ml-4">
							<li>Com seu consentimento explícito</li>
							<li>Para cumprir obrigações legais</li>
							<li>Para proteger nossos direitos e segurança</li>
							<li>Com prestadores de serviços que nos auxiliam na operação da plataforma</li>
						</ul>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">4. Segurança das Informações</h2>
						<p>
							Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger 
							suas informações pessoais contra acesso não autorizado, alteração, divulgação ou 
							destruição. Isso inclui criptografia de dados, controles de acesso e monitoramento 
							regular de nossos sistemas.
						</p>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">5. Seus Direitos</h2>
						<p className="mb-3">De acordo com a LGPD, você tem os seguintes direitos:</p>
						<ul className="list-disc list-inside space-y-1 ml-4">
							<li>Confirmar a existência de tratamento de seus dados</li>
							<li>Acessar seus dados pessoais</li>
							<li>Corrigir dados incompletos, inexatos ou desatualizados</li>
							<li>Solicitar a eliminação de dados desnecessários</li>
							<li>Solicitar a portabilidade de seus dados</li>
							<li>Revogar seu consentimento a qualquer momento</li>
						</ul>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">6. Cookies e Tecnologias Similares</h2>
						<p>
							Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar 
							o uso de nossos serviços e personalizar conteúdo. Você pode gerenciar suas preferências 
							de cookies através das configurações do seu navegador.
						</p>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">7. Retenção de Dados</h2>
						<p>
							Mantemos suas informações pessoais apenas pelo tempo necessário para cumprir os 
							propósitos para os quais foram coletadas, incluindo requisitos legais, contábeis 
							ou de relatórios.
						</p>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">8. Alterações nesta Política</h2>
						<p>
							Podemos atualizar esta Política de Privacidade ocasionalmente. Notificaremos você 
							sobre mudanças significativas através de e-mail ou aviso em nossa plataforma.
						</p>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">9. Contato</h2>
						<p>
							Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus 
							direitos, entre em contato conosco através do e-mail: privacidade@pharmedice.com.br
						</p>
					</div>

					<div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#527BC6]">
						<p className="text-xs text-gray-600">
							<strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
						</p>
					</div>
				</div>
			</div>
		</AuthLayout>
	);
}