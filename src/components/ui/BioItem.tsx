import React from 'react';

interface BioItemProps {
    role: string;
    organization: string;
    year: string;
    logoUrl?: string;
    colorClass?: string; // e.g. 'text-secondary-blue' or 'group-hover:text-secondary-blue'
}

export const BioItem: React.FC<BioItemProps> = ({ role, organization, year, logoUrl, colorClass = 'group-hover:text-secondary-blue' }) => {
    return (
        <div className="flex items-center gap-6 border-b border-black/5 pb-4 group">
            {logoUrl && (
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                    <img src={logoUrl} alt={organization} className="w-full h-full object-contain" />
                </div>
            )}
            <div className="flex-grow flex justify-between items-center">
                <div>
                    <p className={`font-bold text-lg ${colorClass}`}>{organization}</p>
                    <p className="text-[#6b6965] font-medium">{role}</p>
                </div>
                <span className={`font-mono text-sm font-bold opacity-30 text-black`}>
                    {year}
                </span>
            </div>
        </div>
    );
};
