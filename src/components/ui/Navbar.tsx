import React, { useState } from 'react';
import { Logo } from './Logo';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface NavbarProps {
    onNavigate: (view: string) => void;
    currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
    onNavigate,
    currentView
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navItems = ['Mission', 'Services', 'Projects', 'Insights', 'About'];

    const { isAuthenticated, openAuthModal, openContact, openAdmin } = useAuth();
    const { currentLanguage, setLanguage, isTranslating, currentData } = useLanguage();

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
                            {navItems.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => onNavigate(item.toLowerCase())}
                                    className={`text-[15px] font-medium transition-colors relative group ${currentView === item.toLowerCase() ? 'text-black' : 'text-[#6b6965] hover:text-black'}`}
                                >
                                    {item}
                                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-secondary-blue transition-transform duration-300 origin-left ${currentView === item.toLowerCase() ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                                </button>
                            ))}
                        </nav>

                        <div className="flex items-center gap-3 md:gap-6">


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
                                Contact Us
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
                        {navItems.map((item) => (
                            <button
                                key={item}
                                onClick={() => handleMobileNav(item.toLowerCase())}
                                className={`text-left font-serif text-5xl tracking-tight transition-colors ${currentView === item.toLowerCase() ? 'text-secondary-blue' : 'text-black'}`}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>
                    <div className="mt-auto space-y-8">
                        {/* Language Toggle Removed */}
                        {isAuthenticated && (
                            <button onClick={() => { openAdmin(); setIsMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl border border-black/10 text-black font-medium hover:bg-black/5 transition-colors">
                                <span className="material-symbols-outlined">settings</span> Backend
                            </button>
                        )}
                        <button onClick={() => { openContact(); setIsMenuOpen(false); }} className="w-full h-14 rounded-2xl bg-black text-white font-medium text-lg hover:bg-secondary-orange transition-colors">Contact Us</button>
                    </div>
                </div>
            </div>
        </>
    );
};
