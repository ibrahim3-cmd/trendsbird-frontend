import React from "react";

export const SearchableJobFilter: React.FC<{ value?: string; onChange?: (v: string) => void }> = ({ value, onChange }) => {
	return (
		<input
			value={value || ""}
			onChange={(e) => onChange?.(e.target.value)}
			placeholder="Search..."
			className="px-2 py-1 text-sm border rounded"
		/>
	);
};

export default SearchableJobFilter;
