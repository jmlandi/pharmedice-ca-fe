'use client';

import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';

export default function TermsOfUsePage() {
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
		<AuthLayout title="Termos de Uso" navigationLinks={navigationLinks}>
			<div className="max-h-[500px] overflow-y-auto pr-2">
				<div className="space-y-6 text-sm text-gray-700 leading-relaxed">
					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">1. Aceitação dos Termos</h2>
						<p>
							Ao acessar e usar os serviços da Pharmédice, você concorda em cumprir e estar vinculado 
							a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não 
							deverá usar nossos serviços.
						</p>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">2. Descrição do Serviço</h2>
						<p className="mb-3">
							A Pharmédice fornece uma plataforma digital para gestão de resultados de exames 
							laboratoriais e comunicação entre laboratórios e pacientes. Nossos serviços incluem:
						</p>
						<ul className="list-disc list-inside space-y-1 ml-4">
							<li>Acesso seguro a resultados de exames</li>
							<li>Comunicação com profissionais de saúde</li>
							<li>Armazenamento digital de histórico médico</li>
							<li>Notificações sobre novos resultados</li>
						</ul>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">3. Cadastro e Conta do Usuário</h2>
						<p className="mb-3">
							Para usar nossos serviços, você deve criar uma conta fornecendo informações 
							precisas e completas. Você é responsável por:
						</p>
						<ul className="list-disc list-inside space-y-1 ml-4">
							<li>Manter a confidencialidade de suas credenciais de acesso</li>
							<li>Todas as atividades que ocorrem em sua conta</li>
							<li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
							<li>Manter suas informações de conta atualizadas</li>
						</ul>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">4. Uso Adequado</h2>
						<p className="mb-3">Você concorda em usar nossos serviços apenas para fins legítimos e de acordo com estes termos. É proibido:</p>
						<ul className="list-disc list-inside space-y-1 ml-4">
							<li>Usar os serviços para qualquer finalidade ilegal ou não autorizada</li>
							<li>Tentar ganhar acesso não autorizado aos nossos sistemas</li>
							<li>Interferir ou interromper a integridade ou desempenho dos serviços</li>
							<li>Compartilhar suas credenciais de acesso com terceiros</li>
							<li>Usar informações obtidas através dos serviços para fins comerciais não autorizados</li>
						</ul>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">5. Privacidade e Proteção de Dados</h2>
						<p>
							Levamos a privacidade de seus dados a sério. Todas as informações pessoais e médicas 
							são tratadas de acordo com nossa Política de Privacidade e em conformidade com a 
							Lei Geral de Proteção de Dados (LGPD) e outras regulamentações aplicáveis.
						</p>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">6. Propriedade Intelectual</h2>
						<p>
							Todos os direitos de propriedade intelectual relacionados aos nossos serviços, 
							incluindo software, design, conteúdo e marcas registradas, pertencem à Pharmédice 
							ou aos seus licenciadores. Você não pode copiar, modificar ou distribuir qualquer 
							parte de nossos serviços sem autorização prévia.
						</p>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">7. Limitação de Responsabilidade</h2>
						<p className="mb-3">
							Nossos serviços são fornecidos "como estão". Não garantimos que os serviços 
							serão ininterruptos ou livres de erros. Em nenhuma circunstância seremos 
							responsáveis por:
						</p>
						<ul className="list-disc list-inside space-y-1 ml-4">
							<li>Danos indiretos, incidentais ou consequenciais</li>
							<li>Perda de dados ou interrupção de negócios</li>
							<li>Uso indevido das informações pelos usuários</li>
						</ul>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">8. Suspensão e Encerramento</h2>
						<p>
							Reservamo-nos o direito de suspender ou encerrar sua conta a qualquer momento, 
							com ou sem aviso prévio, se você violar estes termos ou se determinarmos que 
							tal ação é necessária para proteger nossos serviços ou outros usuários.
						</p>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">9. Modificações dos Termos</h2>
						<p>
							Podemos modificar estes Termos de Uso a qualquer momento. As alterações entrarão 
							em vigor imediatamente após a publicação. Seu uso continuado dos serviços após 
							as modificações constitui aceitação dos novos termos.
						</p>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">10. Lei Aplicável</h2>
						<p>
							Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa será 
							resolvida nos tribunais competentes do Brasil.
						</p>
					</div>

					<div>
						<h2 className="text-lg font-semibold text-[#527BC6] mb-3">11. Contato</h2>
						<p>
							Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através 
							do e-mail: suporte@pharmedice.com.br
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