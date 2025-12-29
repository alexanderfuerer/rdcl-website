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
                <div className="w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-sm border border-black/5 p-1.5 grayscale group-hover:grayscale-0 transition-all">
                    <img src={logoUrl} alt={organization} className="w-full h-full object-contain" />
                </div>
            )}
            <div className="flex-grow flex justify-between items-center">
                <div>
                    <p className={`font-bold text-black ${colorClass} transition-colors`}>{role}</p>
                    <p className="text-[#6b6965]">{organization}</p>
                </div>
                <span className={`font-mono text-sm font-bold opacity-50 ${colorClass.replace('group-hover:', '')}`}>
                    {year}
                </span>
            </div>
        </div>
    );
};
