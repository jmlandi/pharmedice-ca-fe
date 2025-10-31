interface FormFieldProps {
	label: string;
	icon: string;
	iconAlt?: string;
	type: string;
	placeholder: string;
	value: string;
	error?: string;
	maxLength?: number;
	onChange: (value: string) => void;
	className?: string;
}

// Mapeamento de ícones SVG para Material Icons
const iconMap: Record<string, string> = {
	'/icons/account.svg': 'person',
	'/icons/lock.svg': 'lock',
};

export default function FormField({
	label,
	icon,
	type,
	placeholder,
	value,
	error,
	maxLength,
	onChange,
	className = '',
}: FormFieldProps) {
	const materialIcon = iconMap[icon] || 'circle';
	
	return (
		<div className={`flex flex-col gap-1 mx-1 ${className}`}>
			<label className="flex flex-row gap-1 text-sm text-foreground items-center">
				<span className="material-icons text-[16px] text-gray-500">
					{materialIcon}
				</span>
				<p className="text-gray-700 font-bold text-md">{label}:</p>
			</label>
			<input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				maxLength={maxLength}
				className={`w-full px-4 py-2 border-2 border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4E7FC6] focus:border-[#4E7FC6] transition-all duration-200 placeholder:text-gray-400 ${
					error ? 'ring-2 ring-red-400 border-red-400' : ''
				}`}
			/>
			{error && <span className="text-red-500 text-xs">{error}</span>}
		</div>
	);
}
