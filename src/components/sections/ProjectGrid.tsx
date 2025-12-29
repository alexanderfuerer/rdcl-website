import React from 'react';
import { FormattedText } from '../ui/FormattedText';
import { Project } from '../../types';

interface ProjectGridProps {
    projects: Project[];
    heading: string;
    intro: string;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, heading, intro }) => (
    <section className="py-32"><div className="mx-auto max-w-[1400px] px-6">
        <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="font-serif text-5xl md:text-6xl text-black mb-8">{heading}</h2>
            <div className="text-lg text-[#6b6965] font-light leading-relaxed">
                <FormattedText text={intro} />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">{projects.map((p, idx) => (
            <div key={p.id} className="group cursor-pointer">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-6 relative shadow-lg shadow-black/5"><img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
                <h3 className="font-serif text-2xl text-black mb-2 group-hover:text-secondary-blue transition-colors">{p.title}</h3>
                <div className="text-[#6b6965] text-sm leading-relaxed mb-4">
                    <FormattedText text={p.description} />
                </div>
                {p.pdfUrl && (
                    <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-black hover:text-secondary-blue transition-colors z-10 relative">
                        <span className="material-symbols-outlined text-lg">description</span>
                        View Document
                    </a>
                )}
            </div>
        ))}</div>
    </div></section>
);
