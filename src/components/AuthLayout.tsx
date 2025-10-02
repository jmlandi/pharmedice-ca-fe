import Image from 'next/image';
import OptimizedImage from './OptimizedImage';
import PageTransition from './PageTransition';

interface AuthLayoutProps {
	children: React.ReactNode;
	title: string;
	navigationLinks?: React.ReactNode;
}

export default function AuthLayout({
	children,
	title,
	navigationLinks,
}: AuthLayoutProps) {
	return (
		<main className="w-full min-h-screen flex flex-col md:flex-row">
			{/* main image - fixed on desktop */}
			<div className="md:fixed md:left-0 md:top-0 md:w-[60vw] md:h-screen md:z-10">
				<OptimizedImage
					src="/images/cientist.png"
					alt="Imagem de boas-vindas à área do cliente da Pharmédice"
					width={800}
					height={600}
					priority={true}
					className="w-screen md:w-full h-auto md:h-screen object-cover md:rounded-r-3xl"
				/>
			</div>
			{/* auth area */}
			<div className="flex flex-col w-full md:ml-[60vw] md:w-[40vw] justify-start items-center min-h-screen p-5 gap-5 md:px-8 md:py-6 overflow-y-auto">
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
				<div className="flex flex-col justify-around items-center h-full w-full py-4">
					{/* logo and title */}
					<PageTransition>
						<div className="flex-shrink-0 flex flex-col items-center">
							<OptimizedImage
								src="/icons/pharmedice-logo.svg"
								alt="Logo da Pharmédice"
								width={150}
								height={150}
								className="mb-5"
								priority={true}
							/>
							<h1 className="text-2xl font-bold text-center mb-2 text-[#527BC6]">
								{title}
							</h1>
						</div>
					</PageTransition>

					{/* auth form */}
					<PageTransition className="flex-1 flex items-center justify-center w-full max-w-[450px]">
						<div className="w-full m-1 border-0 p-4 rounded-3xl shadow-lg bg-white">
							{children}
						</div>
					</PageTransition>

					{/* navigation links */}
					{navigationLinks && (
						<PageTransition>
							<div className="flex-shrink-0 mt-4 w-full max-w-[500px]">
								{navigationLinks}
							</div>
						</PageTransition>
					)}
				</div>
			</div>
		</main>
	);
}
