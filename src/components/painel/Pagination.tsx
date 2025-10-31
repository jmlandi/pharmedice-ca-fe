'use client';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	if (totalPages <= 1) {
		return null;
	}

	return (
		<div className="flex justify-center items-center gap-2 mt-8">
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
			>
				Anterior
			</button>

			<span className="px-4 py-1">
				Página {currentPage} de {totalPages}
			</span>

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 cursor-pointer"
			>
				Próxima
			</button>
		</div>
	);
}
