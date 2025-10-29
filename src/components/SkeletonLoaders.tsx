// Skeleton components for different UI elements

export function FormSkeleton() {
	return (
		<div className="flex flex-col gap-4 w-[300px] md:w-full md:max-w-[420px] md:p-1">
			{/* Email field skeleton */}
			<div className="animate-pulse">
				<div className="h-4 bg-[#CCCCCC] rounded w-16 mb-2"></div>
				<div className="h-12 bg-[#CCCCCC] rounded-lg"></div>
			</div>

			{/* Password field skeleton */}
			<div className="animate-pulse">
				<div className="h-4 bg-[#CCCCCC] rounded w-20 mb-2"></div>
				<div className="h-12 bg-[#CCCCCC] rounded-lg"></div>
			</div>

			{/* Forgot password link skeleton */}
			<div className="flex justify-end animate-pulse">
				<div className="h-3 bg-[#CCCCCC] rounded w-24"></div>
			</div>

			{/* Button skeleton */}
			<div className="animate-pulse">
				<div className="h-12 bg-[#CCCCCC] rounded-lg"></div>
			</div>
		</div>
	);
}

export function AuthLayoutSkeleton() {
	return (
		<main className="w-full min-h-screen flex flex-col md:flex-row">
			{/* Image skeleton */}
			<div className="md:fixed md:left-0 md:top-0 md:w-[60vw] md:h-screen md:z-10">
				<div className="w-screen md:w-full h-64 md:h-screen bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse md:rounded-r-3xl"></div>
			</div>

			{/* Auth area skeleton */}
			<div className="flex flex-col w-full md:ml-[60vw] md:w-[40vw] justify-start items-center min-h-screen p-5 gap-5 md:px-8 md:py-6">
				{/* Back button skeleton */}
				<div className="w-full h-10 bg-[#CCCCCC] rounded-full animate-pulse"></div>

				<div className="flex flex-col justify-around items-center h-full w-full py-4">
					{/* Logo and title skeleton */}
					<div className="flex-shrink-0 flex flex-col items-center animate-pulse">
						<div className="w-32 h-32 bg-[#CCCCCC] rounded-full mb-5"></div>
						<div className="h-8 bg-[#CCCCCC] rounded w-48 mb-2"></div>
					</div>

					{/* Form container skeleton */}
					<div className="flex-1 flex items-center justify-center w-full max-w-[450px] m-1 border-0 p-4 rounded-3xl shadow-lg bg-[#252220]">
						<FormSkeleton />
					</div>

					{/* Navigation links skeleton */}
					<div className="flex-shrink-0 mt-4 w-full max-w-[500px] animate-pulse">
						<div className="h-4 bg-[#CCCCCC] rounded w-64 mx-auto"></div>
					</div>
				</div>
			</div>
		</main>
	);
}

export function DashboardSkeleton() {
	return (
		<main className="min-h-screen flex flex-col md:flex-row">
			{/* Mobile header skeleton */}
			<header className="sticky top-0 z-20 flex items-center justify-between bg-[#252220] px-4 py-3 shadow md:hidden">
				<div className="flex items-center gap-3 animate-pulse">
					<div className="w-10 h-10 bg-[#CCCCCC] rounded"></div>
					<div className="h-6 bg-[#CCCCCC] rounded w-32"></div>
				</div>
				<div className="w-8 h-8 bg-[#CCCCCC] rounded animate-pulse"></div>
			</header>

			{/* Content skeleton */}
			<div className="flex-1 p-6 animate-pulse">
				<div className="grid gap-4 max-w-md mx-auto">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="h-12 bg-[#CCCCCC] rounded-lg"></div>
					))}
				</div>
			</div>
		</main>
	);
}

export function CardSkeleton() {
	return (
		<div className="p-4 border rounded-lg shadow-sm animate-pulse">
			<div className="h-4 bg-[#CCCCCC] rounded w-3/4 mb-2"></div>
			<div className="h-3 bg-[#CCCCCC] rounded w-1/2"></div>
		</div>
	);
}

export function TextSkeleton({
	lines = 3,
	className = '',
}: {
	lines?: number;
	className?: string;
}) {
	return (
		<div className={`space-y-2 animate-pulse ${className}`}>
			{Array.from({ length: lines }).map((_, i) => (
				<div
					key={i}
					className="h-4 bg-[#CCCCCC] rounded"
					style={{ width: `${Math.random() * 40 + 60}%` }}
				></div>
			))}
		</div>
	);
}
