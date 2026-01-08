import React from 'react';
import { FormattedText } from '../ui/FormattedText';
import { Insight } from '../../types';

interface InsightsSectionProps {
    insights: Insight[];
    heading: string;
    intro: string;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ insights, heading, intro }) => (
    <section className="py-32 bg-[#111111] text-white">
        <div className="mx-auto max-w-[1400px] px-6">
            <div className="mb-20">
                <h2 className="font-serif text-5xl mb-6">{heading}</h2>
                <p className="text-gray-400 max-w-xl"><FormattedText text={intro} /></p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {insights.map((i, idx) => (
                    <div key={i.id} className="p-6 md:p-8 border border-white/10 rounded-3xl group hover:bg-white/[0.02] hover:border-white/30 transition-all">
                        {/* Mobile: Stack layout, Desktop: Side by side */}
                        <div className="flex flex-col-reverse md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1">
                                <span className={`text-xs font-bold tracking-widest uppercase mb-3 block ${idx % 2 === 0 ? 'text-secondary-blue' : 'text-secondary-orange'}`}>
                                    {i.type}
                                </span>
                                <h3 className="text-2xl font-serif mb-3">{i.title}</h3>
                                <div className="text-gray-400 text-sm mb-6">
                                    <FormattedText text={i.description} />
                                </div>
                                {i.downloadUrl && (i.downloadUrl.startsWith('http') || i.downloadUrl.startsWith('https')) && (
                                    <a href={i.downloadUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white font-medium hover:underline">
                                        Download PDF <span className="material-symbols-outlined text-sm">open_in_new</span>
                                    </a>
                                )}
                            </div>
                            {/* Thumbnail: Larger on mobile, positioned at top */}
                            <div className="w-full h-32 md:w-20 md:h-20 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 group-hover:text-white/80 transition-colors overflow-hidden flex-shrink-0">
                                {i.thumbnailUrl ? (
                                    <img src={i.thumbnailUrl} alt={i.title} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined text-4xl">description</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
