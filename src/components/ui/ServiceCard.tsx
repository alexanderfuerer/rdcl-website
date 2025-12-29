import React from 'react';
import { FormattedText } from '../ui/FormattedText';

interface ServiceCardProps {
    title: string;
    imageUrl?: string;
    icon?: string;
    resultLabel: string;
    resultValue: string;
    colorClass: string; // e.g., 'text-secondary-blue'
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ title, imageUrl, icon, resultLabel, resultValue, colorClass }) => {
    return (
        <div className="aspect-[4/5] bg-[#f5f1ed] rounded-[2.5rem] relative flex flex-col items-center justify-center p-8 transition-transform duration-500 group-hover/service:scale-[1.02] shadow-sm">
            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm mb-6 border border-black/5 w-20 h-20 flex items-center justify-center">
                {imageUrl ? (
                    <img src={imageUrl} className="w-full h-full object-contain" alt={title} />
                ) : (
                    <span className={`material-symbols-outlined text-4xl ${colorClass}`}>{icon || 'engineering'}</span>
                )}
            </div>
            <h3 className="font-serif text-4xl text-black text-center mb-16 leading-tight max-w-[200px]">{title}</h3>
            <div className="bg-white px-8 py-6 rounded-[1.2rem] shadow-[0_15px_30px_rgba(0,0,0,0.12)] flex flex-col items-center border border-black/[0.03] absolute bottom-12 w-[calc(100%-4rem)]">
                <span className="text-[11px] font-bold tracking-[0.25em] text-[#6b6965] uppercase mb-1 font-sans">{resultLabel}</span>
                <p className="font-serif italic text-[1.4rem] text-black text-center">
                    <FormattedText text={resultValue} />
                </p>
            </div>
        </div>
    );
};
