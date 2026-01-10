import React from 'react';
import { Partner } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface PartnersSectionProps {
    partners: Partner[];
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ partners }) => {
    const { currentLanguage } = useLanguage();
    const isDE = currentLanguage === 'de';

    if (!partners || partners.length === 0) return null;

    return (
        <section className="py-24 bg-[#f9f8f6]">
            <div className="mx-auto max-w-[1200px] px-6">
                <div className="flex flex-col items-center">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 mb-12">
                        {isDE ? 'Strategische Partner' : 'Strategic Partners'}
                    </p>
                    <div className="w-full flex flex-wrap justify-center items-center gap-x-16 gap-y-12">
                        {partners.map((partner, index) => (
                            <div
                                key={index}
                                className="group flex flex-col items-center transition-all duration-300"
                            >
                                {partner.url ? (
                                    <a
                                        href={partner.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-2xl md:text-3xl font-serif text-black/20 group-hover:text-black transition-colors duration-500 tracking-tight"
                                    >
                                        {partner.name}
                                    </a>
                                ) : (
                                    <span className="text-2xl md:text-3xl font-serif text-black/20 tracking-tight">
                                        {partner.name}
                                    </span>
                                )}
                                <div className="h-px w-0 bg-black/10 group-hover:w-full transition-all duration-700 mt-2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
