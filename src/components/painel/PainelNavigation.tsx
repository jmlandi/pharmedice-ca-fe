'use client';

export interface NavigationTab {
	id: string;
	label: string;
	icon?: string;
}

interface PainelNavigationProps {
	tabs: NavigationTab[];
	activeTab: string;
	onTabChange: (tabId: string) => void;
}

export default function PainelNavigation({
	tabs,
	activeTab,
	onTabChange,
}: PainelNavigationProps) {
	return (
		<nav className="bg-[#252220] border-b">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex space-x-8">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => onTabChange(tab.id)}
							className={`
								py-4 px-1 border-b-2 font-medium text-sm transition-colors
								${
									activeTab === tab.id
										? 'border-blue-500 text-[#6B9FE8]'
										: 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
								}
							`}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>
		</nav>
	);
}
