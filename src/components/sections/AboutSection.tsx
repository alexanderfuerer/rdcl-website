import React from 'react';
import { FormattedText } from '../ui/FormattedText';
import { AboutContent } from '../../types';
import { BioItem } from '../ui/BioItem';
import { useLanguage } from '../../contexts/LanguageContext';

interface AboutSectionProps {
    content: AboutContent;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ content }) => {
    const { currentLanguage } = useLanguage();
    const isDE = currentLanguage === 'de';

    return (
    <section className="py-32">
        <div className="mx-auto max-w-[1400px] px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                <div className="order-2 lg:order-1">
                    {/* Founder label removed */}
                    <h2 className="font-serif text-5xl md:text-7xl mb-8 leading-tight">
                        {content.ceoName}
                        <span className="block text-2xl font-sans font-medium text-[#6b6965] mt-2 italic">{content.ceoTitle}</span>
                    </h2>

                    <div className="relative mb-12">
                        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-secondary-orange/30"></div>
                        <div className="text-xl text-[#6b6965] font-light leading-relaxed italic">
                            "<FormattedText text={content.bio} />"
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="font-serif text-3xl">{isDE ? 'Grundsätze' : 'Principles'}</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4 text-lg group">
                                <div className="w-2 h-2 rounded-full transition-all bg-secondary-orange group-hover:scale-150"></div>
                                {isDE ? 'KI soll Menschen befähigen, nicht ersetzen.' : 'AI should empower people, not replace them.'}
                            </li>
                            <li className="flex items-center gap-4 text-lg group">
                                <div className="w-2 h-2 rounded-full transition-all bg-secondary-orange group-hover:scale-150"></div>
                                {isDE ? 'KI und Automatisierung sollen Zeit für kreative, strategischere Arbeit freispielen.' : 'AI and automation should free up time for creative, strategic work.'}
                            </li>
                            <li className="flex items-center gap-4 text-lg group">
                                <div className="w-2 h-2 rounded-full transition-all bg-secondary-orange group-hover:scale-150"></div>
                                {isDE ? 'Radikale Einfachheit ist die höchste Form von Eleganz.' : 'Radical simplicity is the highest form of elegance.'}
                            </li>
                        </ul>
                    </div>

                    <div className="mt-20">
                        <h3 className="font-serif text-3xl mb-8 text-secondary-blue">{isDE ? 'Berufliche Stationen' : 'Career Milestones'}</h3>
                        <div className="space-y-6">
                            {content.cvItems?.map((item, i) => (
                                <BioItem
                                    key={i}
                                    role={item.role}
                                    organization={item.company}
                                    year={item.year}
                                    logoUrl={item.logoUrl}
                                    colorClass="text-secondary-blue"
                                />
                            ))}
                        </div>
                    </div>

                    {content.lecturingItems && content.lecturingItems.length > 0 && (
                        <div className="mt-20">
                            <h3 className="font-serif text-3xl mb-8 text-secondary-orange">{isDE ? 'Dozententätigkeit' : 'Lecturing Activities'}</h3>
                            <div className="space-y-6">
                                {content.lecturingItems.map((item, i) => (
                                    <BioItem
                                        key={i}
                                        role={item.role}
                                        organization={item.institution}
                                        year={item.year}
                                        logoUrl={item.logoUrl}
                                        colorClass="text-secondary-orange"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {content.educationItems && content.educationItems.length > 0 && (
                        <div className="mt-20">
                            <h3 className="font-serif text-3xl mb-8 text-secondary-green">{isDE ? 'Aus- und Weiterbildung' : 'Education'}</h3>
                            <div className="space-y-6">
                                {content.educationItems.map((item, i) => (
                                    <BioItem
                                        key={i}
                                        role={item.degree}
                                        organization={item.institution}
                                        year={item.year}
                                        logoUrl={item.logoUrl}
                                        colorClass="text-secondary-green"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="order-1 lg:order-2">
                    <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl relative">
                        <img src={content.imageUrl} alt={content.ceoName} className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </div>
    </section>
    );
};
