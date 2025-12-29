import React from 'react';
import { FormattedText } from '../ui/FormattedText';
import { Service } from '../../types';
import { ServiceCard } from '../ui/ServiceCard';

interface ServiceSectionProps {
    services: Service[];
    onContact: () => void;
}

export const ServiceSection: React.FC<ServiceSectionProps> = ({ services, onContact }) => (
    <section className="py-32 bg-white">
        <div className="mx-auto max-w-[1200px] px-6">
            <div className="space-y-40">
                {services.map((service, index) => {
                    const colorClass = index % 3 === 0 ? 'text-secondary-blue' : index % 3 === 1 ? 'text-secondary-orange' : 'text-secondary-green';
                    const bgClass = index % 3 === 0 ? 'bg-secondary-blue' : index % 3 === 1 ? 'bg-secondary-orange' : 'bg-secondary-green';

                    return (
                        <div key={service.id} className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start group/service">
                            <div className="w-full lg:w-[400px] flex-shrink-0">
                                <ServiceCard
                                    title={service.title}
                                    imageUrl={service.imageUrl}
                                    icon={service.icon}
                                    resultLabel={service.resultLabel}
                                    resultValue={service.resultValue}
                                    colorClass={colorClass}
                                />
                            </div>
                            <div className="w-full lg:flex-grow flex flex-col">
                                <h2 className="font-serif text-5xl md:text-6xl text-black mb-8 leading-[1.1]">{service.mainTitle}</h2>
                                <div className="text-xl text-[#6b6965] font-light leading-relaxed mb-10 max-w-2xl">
                                    <FormattedText text={service.description} />
                                </div>
                                <div className="bg-[#f9f8f6] p-10 rounded-[2.5rem] mb-10 border border-black/5">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${bgClass}`}>
                                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                                        </div>
                                        <h4 className="font-bold text-xs tracking-widest uppercase">{service.scopeTitle || 'Scope'}</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                        {service.scopeItems?.map((item, i) => (
                                            <div key={i} className="flex items-start gap-4">
                                                <div className={`w-1.5 h-1.5 rounded-full ${bgClass} mt-2.5 flex-shrink-0 opacity-20`}></div>
                                                <div className="text-[15px] text-[#4a4846] font-medium">
                                                    <FormattedText text={item} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={onContact} className={`flex items-center gap-2 group text-black font-semibold hover:${colorClass} transition-all`}>
                                    <span className="text-[15px] font-bold">Jetzt kontaktieren</span>
                                    <span className={`material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform ${colorClass}`}>arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </section>
);
