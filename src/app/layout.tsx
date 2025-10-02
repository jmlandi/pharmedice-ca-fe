import type { Metadata } from 'next';
import { Montserrat, Montserrat_Alternates } from 'next/font/google';
import './globals.css';
import { AlertProvider } from '../components/AlertProvider';

const montserrat = Montserrat({
	variable: '--font-montserrat',
	subsets: ['latin'],
});

const montserratAlternates = Montserrat_Alternates({
	variable: '--font-montserrat-alternates',
	weight: ['500', '800'],
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Pharmédice | Área do Cliente',
	description: 'Área do cliente da Pharmédice | Laudos, pedidos e mais',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-br">
			<body
				className={`${montserrat.variable} ${montserratAlternates.variable} antialiased`}
			>
				<AlertProvider>
					{children}
				</AlertProvider>
			</body>
		</html>
	);
}
