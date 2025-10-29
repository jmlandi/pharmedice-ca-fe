interface SubmitButtonProps {
	children: React.ReactNode;
	isLoading?: boolean;
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
	variant?: 'primary' | 'secondary';
	className?: string;
	onClick?: () => void;
}

// Loading spinner component
function LoadingSpinner() {
	return (
		<svg
			className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
			></circle>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	);
}

export default function SubmitButton({
	children,
	isLoading = false,
	disabled = false,
	type = 'submit',
	variant = 'primary',
	className = '',
	onClick,
}: SubmitButtonProps) {
	const baseClasses =
		'min-h-[30px] w-full h-12 text-sm font-bold rounded-3xl transition-all duration-200 flex items-center justify-center relative overflow-hidden';
	const variantClasses = {
		primary: 'bg-[#6B9FE8] text-white hover:bg-[#4E7FC6]',
		secondary: 'bg-[#2d2823] text-[#6B9FE8] hover:bg-[#3a3530]',
	};
	const stateClasses =
		isLoading || disabled
			? 'opacity-60 cursor-not-allowed'
			: 'hover:cursor-pointer hover:shadow-lg transform hover:scale-[1.02]';

	return (
		<button
			type={type}
			disabled={isLoading || disabled}
			onClick={onClick}
			className={`${baseClasses} ${variantClasses[variant]} ${stateClasses} ${className}`}
		>
			{isLoading && (
				<>
					<LoadingSpinner />
					<span className="opacity-75">
						{typeof children === 'string' && children.includes('...')
							? children
							: 'Carregando...'}
					</span>
				</>
			)}
			{!isLoading && children}
		</button>
	);
}
