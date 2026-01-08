import React, { useState } from 'react';
import { Logo } from './Logo';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage, Language } from '../../contexts/LanguageContext';

// UI translations for static elements
const UI_TRANSLATIONS = {
    de: {
        contact: 'Kontaktieren',
        navItems: ['Mission', 'Services', 'Projekte', 'Insights', 'Über uns']
    },
    en: {
        contact: 'Contact',
        navItems: ['Mission', 'Services', 'Projects', 'Insights', 'About']
    }
};

interface NavbarProps {
    onNavigate: (view: string) => void;
    currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
    onNavigate,
    currentView
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navKeys = ['mission', 'services', 'projects', 'insights', 'about'];

    const { isAuthenticated, openAuthModal, openContact, openAdmin } = useAuth();
    const { currentLanguage, setLanguage, isTranslating, currentData } = useLanguage();

    const ui = UI_TRANSLATIONS[currentLanguage];
    const toggleLanguage = () => setLanguage(currentLanguage === 'de' ? 'en' : 'de');

    const handleMobileNav = (view: string) => {
        onNavigate(view);
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className="fixed top-0 z-50 w-full bg-[#f9f8f6]/90 backdrop-blur-md border-b border-black/5">
                <div className="mx-auto max-w-[1400px] px-6">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
                            <Logo className="h-10 md:h-12" logoUrl={currentData.logoUrl} />
                        </div>

                        <nav className="hidden md:flex items-center gap-8">
                            {navKeys.map((key, idx) => (
                                <button
                                    key={key}
                                    onClick={() => onNavigate(key)}
                                    className={`text-[15px] font-medium transition-colors relative group ${currentView === key ? 'text-black' : 'text-[#6b6965] hover:text-black'}`}
                                >
                                    {ui.navItems[idx]}
                                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-secondary-blue transition-transform duration-300 origin-left ${currentView === key ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                                </button>
                            ))}
                        </nav>

                        <div className="flex items-center gap-3 md:gap-6">
                            {/* Language Toggle */}
                            <button
                                onClick={toggleLanguage}
                                className={`hidden sm:flex items-center gap-1 h-10 px-3 rounded-full border border-black/10 text-[#6b6965] text-xs font-medium hover:bg-black/5 transition-all ${isTranslating ? 'opacity-50' : ''}`}
                                disabled={isTranslating}
                            >
                                <span className={currentLanguage === 'de' ? 'font-bold text-black' : ''}>DE</span>
                                <span className="text-black/30">/</span>
                                <span className={currentLanguage === 'en' ? 'font-bold text-black' : ''}>EN</span>
                            </button>

                            {isAuthenticated && (
                                <button
                                    onClick={openAdmin}
                                    className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-full border border-black/10 text-[#6b6965] text-xs font-medium hover:bg-black/5 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">settings</span>
                                    Backend
                                </button>
                            )}

                            <button
                                onClick={openContact}
                                className="hidden sm:block h-10 px-5 rounded-full bg-black text-white text-[15px] font-medium hover:bg-secondary-orange transition-colors"
                            >
                                {ui.contact}
                            </button>

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-black/5 text-black hover:bg-black/10 transition-colors"
                                aria-label="Toggle menu"
                            >
                                <span className="material-symbols-outlined">
                                    {isMenuOpen ? 'close' : 'menu'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div
                className={`fixed inset-0 z-[45] bg-[#f9f8f6] transition-transform duration-500 ease-in-out md:hidden ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
            >
                <div className="flex flex-col h-full pt-28 px-6 pb-12 overflow-y-auto">
                    <nav className="flex flex-col gap-6 mb-12">
                        {navKeys.map((key, idx) => (
                            <button
                                key={key}
                                onClick={() => handleMobileNav(key)}
                                className={`text-left font-serif text-5xl tracking-tight transition-colors ${currentView === key ? 'text-secondary-blue' : 'text-black'}`}
                            >
                                {ui.navItems[idx]}
                            </button>
                        ))}
                    </nav>
                    <div className="mt-auto space-y-6">
                        {/* Language Toggle for Mobile */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => { setLanguage('de'); }}
                                className={`px-6 py-3 rounded-xl text-lg font-medium transition-colors ${currentLanguage === 'de' ? 'bg-black text-white' : 'bg-black/5 text-black'}`}
                            >
                                Deutsch
                            </button>
                            <button
                                onClick={() => { setLanguage('en'); }}
                                className={`px-6 py-3 rounded-xl text-lg font-medium transition-colors ${currentLanguage === 'en' ? 'bg-black text-white' : 'bg-black/5 text-black'}`}
                            >
                                English
                            </button>
                        </div>
                        {isAuthenticated && (
                            <button onClick={() => { openAdmin(); setIsMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl border border-black/10 text-black font-medium hover:bg-black/5 transition-colors">
                                <span className="material-symbols-outlined">settings</span> Backend
                            </button>
                        )}
                        <button onClick={() => { openContact(); setIsMenuOpen(false); }} className="w-full h-14 rounded-2xl bg-black text-white font-medium text-lg hover:bg-secondary-orange transition-colors">{ui.contact}</button>
                    </div>
                </div>
            </div>
        </>
    );
};
