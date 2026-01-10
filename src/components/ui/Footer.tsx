import React from 'react';
import { Logo } from '../ui/Logo';
import { useLanguage } from '../../contexts/LanguageContext';

interface FooterProps {
    readinessUrl: string;
    onAdminTrigger: () => void;
    logoUrl: string;
    onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ readinessUrl, onAdminTrigger, logoUrl, onNavigate }) => {
    const { currentLanguage } = useLanguage();
    const isDE = currentLanguage === 'de';

    return (
    <footer className="bg-[#f9f8f6] pt-12 pb-12 mt-0">
        <div className="mx-auto max-w-[1400px] px-6">
            <div className="mb-24 flex flex-col md:flex-row items-center justify-between p-12 md:p-20 rounded-[3rem] bg-black border border-white/5 shadow-2xl shadow-black/10">
                <div className="mb-8 md:mb-0 max-w-xl">
                    <h3 className="font-serif text-4xl md:text-5xl mb-4 text-white">{isDE ? 'Bewerte das KI-Potenzial deines Unternehmens.' : 'Assess your company\'s AI potential.'}</h3>
                    <p className="text-lg text-white/60 font-light">{isDE ? 'Finde heraus, wo KI für dich den grössten Wert schafft. Und wie dein Team sein volles Potenzial ausschöpfen kann.' : 'Discover where AI creates the most value for you. And how your team can reach its full potential.'}</p>
                </div>
                <a href={readinessUrl} target="_blank" rel="noopener noreferrer" className="h-14 px-10 rounded-full bg-secondary-orange text-white font-medium text-lg hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 shadow-xl shadow-secondary-orange/20 flex items-center gap-2">
                    AI Readiness Check <span className="material-symbols-outlined">trending_up</span>
                </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                <div className="lg:col-span-2 pr-8">
                    <div className="mb-6"><Logo className="h-14" logoUrl={logoUrl} /></div>
                    <p className="text-sm text-[#6b6965] mb-6 max-w-xs">{isDE ? 'Human Centered AI. Wir begleiten Unternehmen in eine Zukunft, in der Künstliche Intelligenz Menschen dient.' : 'Human Centered AI. We guide companies into a future where artificial intelligence serves people.'}</p>
                </div>
                <div>
                    <h4 className="font-medium text-black mb-6">Legal</h4>
                    <ul className="space-y-4 text-sm text-[#6b6965]">
                        <li><button onClick={() => onNavigate('impressum')} className="hover:text-secondary-blue transition-colors text-left">{isDE ? 'Impressum' : 'Imprint'}</button></li>
                        <li><button onClick={() => onNavigate('privacy')} className="hover:text-secondary-blue transition-colors text-left">{isDE ? 'Datenschutz' : 'Privacy Policy'}</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-medium text-black mb-6">Connect</h4>
                    <ul className="space-y-4 text-sm text-[#6b6965]">
                        <li><a href="https://www.linkedin.com/in/alexanderfuerer/" target="_blank" rel="noopener noreferrer" className="hover:text-secondary-blue transition-colors flex items-center gap-2">LinkedIn <span className="material-symbols-outlined text-xs">north_east</span></a></li>
                        <li><a href="https://x.com/alexanderfuerer" target="_blank" rel="noopener noreferrer" className="hover:text-secondary-orange transition-colors flex items-center gap-2">X <span className="material-symbols-outlined text-xs">north_east</span></a></li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/5 text-sm text-[#6b6965]">
                <p>© 2024 RDCL. All rights reserved.</p>
                <span onDoubleClick={onAdminTrigger} className="flex items-center gap-2 mt-4 md:mt-0 cursor-default select-none group" title="System Status">
                    <span className="w-2 h-2 bg-secondary-blue rounded-full animate-pulse group-hover:scale-125 transition-transform"></span> AI Systems Online
                </span>
            </div>
        </div>
    </footer>
    );
};
