interface SubmitButtonProps {
	children: React.ReactNode;
	isLoading?: boolean;
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset';
	variant?: 'primary' | 'secondary';
	className?: string;
	onClick?: () => void;
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
		'min-h-[30px] w-full h-12 text-sm font-bold rounded-3xl transition-all duration-200';
	const variantClasses = {
		primary: 'bg-[#527BC6] text-white hover:bg-[#3b5aa1]',
		secondary: 'bg-gray-100 text-[#527BC6] hover:bg-gray-200',
	};
	const stateClasses =
		isLoading || disabled
			? 'opacity-60 cursor-not-allowed'
			: 'hover:cursor-pointer';

	return (
		<button
			type={type}
			disabled={isLoading || disabled}
			onClick={onClick}
			className={`${baseClasses} ${variantClasses[variant]} ${stateClasses} ${className}`}
		>
			{children}
		</button>
	);
}
