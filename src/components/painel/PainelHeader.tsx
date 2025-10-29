'use client';

import OptimizedImage from '@/components/OptimizedImage';

interface PainelHeaderProps {
	title: string;
	userName: string;
	isAdmin?: boolean;
	onLogout: () => void;
}

export default function PainelHeader({
	title,
	userName,
	isAdmin = false,
	onLogout,
}: PainelHeaderProps) {
	return (
		<header className="bg-[#F5F2ED] shadow-sm border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center gap-4">
						<OptimizedImage
							src="/icons/pharmedice-logo.svg"
							alt="Logo da Pharmédice"
							width={72}
							height={24}
							className="max-h-8"
						/>
						<h1 className="text-xl font-semibold text-gray-900">{title}</h1>
					</div>

					<div className="flex items-center gap-4">
						<span className="text-sm text-gray-600">
							Olá, {userName}! {isAdmin && '(Admin)'}
						</span>
						<button
							onClick={onLogout}
							className="text-sm text-red-600 hover:text-red-700 transition-colors"
						>
							Sair
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}
