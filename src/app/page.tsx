import Image from 'next/image';

export default function Home() {
	return (
		<main className="w-full h-screen flex flex-col md:flex-row overflow-x-clip">
			{/* main image */}
			<div className="">
				<Image
					src="/images/cientist.png"
					alt="Imagem de boas-vindas à área do cliente da Pharmédice"
					width={800}
					height={600}
					className="w-screen md:max-w-[65vw] h-auto md:h-screen object-cover md:rounded-r-3xl"
				/>
			</div>
			{/* login area */}
			<div className="flex flex-col w-full justify-start items-center h-screen p-5 gap-5">
				{/* back to main site button */}
				<a
					href="https://pharmedice.com.br"
					className="w-[100%] bg-gray-100 hover:bg-gray-200 text-foreground rounded-4xl px-5 py-1 flex flex-row gap-1 transition-all duration-200"
				>
					<Image
						src="/icons/arrow.svg"
						alt="Ícone de seta para esquerda"
						width={16}
						height={16}
						className=""
					/>
					<p className="">Retorne para o site</p>
				</a>
				<div className="flex flex-col justify-around items-center h-full">
					{/* logo and title */}
					<div className="">
						<Image
							src="/icons/pharmedice-logo.svg"
							alt="Logo da Pharmédice"
							width={180}
							height={180}
							className="mt-10 mb-5"
						/>
						<h1 className="text-2xl font-bold text-center mb-2 text-[#527BC6]">
							Área do Cliente
						</h1>
					</div>
					{/* login form */}
					<form className="flex flex-col gap-4 w-[300px] md:w-[400px]">
						{/* input fields */}
						<div className="flex flex-col gap-1">
							<label className="flex flex-row gap-1 text-sm text-foreground">
								<Image
									src="/icons/account.svg"
									alt="Ícone de usuário"
									width={16}
									height={16}
									className="h-full w-auto"
								/>
								<p className="text-[#527BC6] font-bold text-md">E-mail:</p>
							</label>
							<input
								type="email"
								placeholder="Digite o e-mail da sua conta"
								className="w-full px-4 py-2 border-none bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#527BC6] transition-all duration-200"
							/>
						</div>

						<div className="flex flex-col gap-1">
							<label className="flex flex-row gap-1 text-sm text-foreground">
								<Image
									src="/icons/lock.svg"
									alt="Ícone de cadeado"
									width={16}
									height={16}
									className="h-full w-auto"
								/>
								<p className="text-[#527BC6] font-bold text-md">Senha:</p>
							</label>
							<input
								type="password"
								placeholder="Digite a senha da sua conta"
								className="w-full px-4 py-2 border-none bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#527BC6] transition-all duration-200"
							/>
						</div>

						{/* login buttons */}
						<div className="flex flex-row items-center gap-2 justify-between">
							<button
								type="submit"
								className="w-full h-full text-sm font-bold bg-[#527BC6] text-white rounded-3xl hover:bg-[#3b5aa1] hover:cursor-pointer transition-all duration-200"
							>
								Iniciar Sessão
							</button>
							<a href="#" className="w-full hover:opacity-60">
								<Image
									src="/icons/btn-google-light.svg"
									alt="Botão de login com Google"
									width={16}
									height={16}
									className="w-full h-auto"
								/>
							</a>
						</div>
						<p className="text-sm text-[#527BC6] w-full text-center">
							Não tem uma conta?{' '}
							<a href="#" className="underline">
								Cadastre-se!
							</a>
						</p>
					</form>
				</div>
			</div>
		</main>
	);
}
