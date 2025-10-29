'use client';

import Image from 'next/image';

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	onSearch: () => void;
	placeholder?: string;
}

export default function SearchBar({
	value,
	onChange,
	onSearch,
	placeholder = 'Buscar...',
}: SearchBarProps) {
	return (
		<div className="flex gap-2 mb-6">
			<div className="flex-1 relative">
				<input
					type="text"
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyPress={(e) => e.key === 'Enter' && onSearch()}
					className="w-full px-4 py-2 pl-10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#6B9FE8] focus:border-transparent"
				/>
				<Image
					src="/icons/search.svg"
					alt="Buscar"
					width={20}
					height={20}
					className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
				/>
			</div>
			<button
				onClick={onSearch}
				className="px-6 py-2 bg-[#6B9FE8] text-white rounded-lg hover:bg-[#4E7FC6] transition-colors"
			>
				Buscar
			</button>
		</div>
	);
}
