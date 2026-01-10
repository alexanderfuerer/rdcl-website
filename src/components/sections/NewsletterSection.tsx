import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface NewsletterSectionProps {
    onSubscribe: (email: string) => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ onSubscribe }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const { currentLanguage } = useLanguage();
    const isDE = currentLanguage === 'de';

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        onSubscribe(email);
        try {
            const response = await fetch("https://formsubmit.co/ajax/ale.fuerer@gmail.com", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ email, _subject: "New Newsletter Subscription", _captcha: "false" })
            });
            const result = await response.json();
            if (response.ok && (result.success === true || result.success === "true")) {
                setStatus('success'); setEmail('');
            } else {
                setStatus('success'); // Still show success locally as per original code
            }
        } catch (err) {
            setStatus('success');
        }
    };

    return (
        <section className="pt-32 pb-0 bg-[#f9f8f6]">
            <div className="mx-auto max-w-[1400px] px-6">
                <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl shadow-black/[0.02] border border-black/5 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="max-w-2xl text-center lg:text-left">
                        <h2 className="font-serif text-4xl md:text-5xl text-black mb-4">{isDE ? 'Bleib am Ball rund um KI-Themen für KMU.' : 'Stay up to date on AI topics for SMEs.'}</h2>
                        <p className="text-lg text-[#6b6965] font-light">{isDE ? 'Abonniere kuratierte News aus KI-Praxis und -Entwicklung.' : 'Subscribe to curated news from AI practice and development.'}</p>
                    </div>
                    <div className="w-full lg:w-auto lg:min-w-[400px]">
                        {status === 'success' ? (
                            <div className="flex items-center gap-3 text-secondary-green bg-secondary-green/10 p-6 rounded-2xl animate-in fade-in zoom-in-95">
                                <span className="material-symbols-outlined">verified</span>
                                <p className="font-medium">{isDE ? 'Vielen Dank für deine Anmeldung.' : 'Thank you for subscribing.'}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="relative">
                                <input required type="email" placeholder={isDE ? 'Deine E-Mail-Adresse' : 'Your email address'} className="w-full h-16 bg-[#f9f8f6] border-none rounded-2xl px-8 pr-40 focus:ring-2 focus:ring-secondary-blue transition-all outline-none text-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <button type="submit" disabled={status === 'submitting'} className="absolute right-2 top-2 bottom-2 px-6 bg-black text-white rounded-xl font-medium text-sm hover:bg-secondary-blue transition-all disabled:opacity-50">
                                    {status === 'submitting' ? 'Senden...' : (isDE ? 'Abschicken' : 'Subscribe')}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
