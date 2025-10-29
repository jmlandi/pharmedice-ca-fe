import Image from 'next/image';

interface FormFieldProps {
	label: string;
	icon: string;
	iconAlt: string;
	type: string;
	placeholder: string;
	value: string;
	error?: string;
	maxLength?: number;
	onChange: (value: string) => void;
	className?: string;
}

export default function FormField({
	label,
	icon,
	iconAlt,
	type,
	placeholder,
	value,
	error,
	maxLength,
	onChange,
	className = '',
}: FormFieldProps) {
	return (
		<div className={`flex flex-col gap-1 mx-1 ${className}`}>
			<label className="flex flex-row gap-1 text-sm text-foreground">
				<Image
					src={icon}
					alt={iconAlt}
					width={16}
					height={16}
					className="h-full w-auto"
				/>
				<p className="text-[#4E7FC6] font-bold text-md">{label}:</p>
			</label>
			<input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				maxLength={maxLength}
				className={`w-full px-4 py-2 border-none bg-[#F5F2ED] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4E7FC6] transition-all duration-200 placeholder:text-[#B8ADA0] ${
					error ? 'ring-2 ring-red-400' : ''
				}`}
			/>
			{error && <span className="text-red-500 text-xs">{error}</span>}
		</div>
	);
}
