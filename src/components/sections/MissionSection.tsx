import React from 'react';
import { FormattedText } from '../ui/FormattedText';
import { MissionContent } from '../../types';

interface MissionSectionProps {
    content: MissionContent;
}

export const MissionSection: React.FC<MissionSectionProps> = ({ content }) => (
    <section className="py-32 bg-[#f9f8f6]">
        <div className="mx-auto max-w-[1400px] px-6">
            <div className="max-w-[1100px] mb-20">
                <h2 className="font-serif text-6xl md:text-[6.5rem] text-black leading-[0.9] tracking-tight mb-4">
                    <FormattedText text={content.heading} />
                </h2>
                <div className="text-xl md:text-2xl text-[#6b6965] font-normal leading-relaxed max-w-2xl">
                    <FormattedText text={content.subheading} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-32">{content.pillars.map((pillar, idx) => (
                <div key={idx} className="group space-y-6">
                    <div className="flex items-center gap-4"><span className={`text-[10px] font-bold tracking-[0.2em] ${idx % 3 === 0 ? 'text-secondary-orange' : idx % 3 === 1 ? 'text-secondary-blue' : 'text-secondary-green'}`}>0{idx + 1}</span><div className="h-[1px] flex-grow bg-black/5"></div></div>
                    <h3 className="font-serif text-3xl text-black group-hover:translate-x-2 transition-transform">{pillar.title}</h3>
                    <div className="text-[#6b6965] leading-relaxed text-[15px] font-medium">
                        <FormattedText text={pillar.text} />
                    </div>
                </div>
            ))}</div>
        </div>
    </section>
);
