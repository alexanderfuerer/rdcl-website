import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ContactModalProps {
    onClose: () => void;
}

// Get contact email from environment variable with fallback
const getContactEmail = (): string => {
    const email = import.meta.env.VITE_CONTACT_EMAIL;
    if (!email) {
        console.warn('VITE_CONTACT_EMAIL not configured in .env');
        return '';
    }
    return email;
};

// Basic email validation
const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Basic input sanitization (removes potential XSS)
const sanitizeInput = (input: string): string => {
    return input
        .replace(/[<>]/g, '')
        .trim()
        .slice(0, 1000); // Limit length
};

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentLanguage } = useLanguage();
    const isDE = currentLanguage === 'de';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Client-side validation
        const sanitizedName = sanitizeInput(name);
        const sanitizedMessage = sanitizeInput(message);

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            setIsSubmitting(false);
            return;
        }

        if (sanitizedName.length < 2) {
            setError('Please enter your name.');
            setIsSubmitting(false);
            return;
        }

        if (sanitizedMessage.length < 10) {
            setError('Please enter a longer message (at least 10 characters).');
            setIsSubmitting(false);
            return;
        }

        const contactEmail = getContactEmail();
        if (!contactEmail) {
            setError('Contact form not configured. Please try again later.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`https://formsubmit.co/ajax/${contactEmail}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    name: sanitizedName,
                    email,
                    message: sanitizedMessage,
                    _subject: "New Inquiry from RDCL Website",
                    _captcha: "false"
                })
            });
            const result = await response.json();
            if (response.ok && (result.success === "true" || result.success === true)) setIsSuccess(true);
            else throw new Error(result.message || "Submission failed.");
        } catch (err: any) {
            setError("Delivery error: " + (err.message || "Please try again later."));
        } finally { setIsSubmitting(false); }
    };

    if (isSuccess) return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-white rounded-[3rem] p-16 shadow-2xl border border-black/5 text-center animate-in zoom-in-95">
                <div className="w-20 h-20 bg-secondary-green/10 rounded-full flex items-center justify-center mx-auto mb-8"><span className="material-symbols-outlined text-4xl text-secondary-green">check_circle</span></div>
                <h2 className="font-serif text-4xl mb-4">{isDE ? 'Nachricht gesendet' : 'Message Sent'}</h2>
                <p className="text-[#6b6965] mb-10 leading-relaxed">{isDE ? 'Vielen Dank' : 'Thank you'}, <span className="font-bold text-black">{name}</span>. {isDE ? 'Wir melden uns in Kürze bei' : 'We will get back to you shortly at'} <span className="font-bold text-black">{email}</span>.</p>
                <button onClick={onClose} className="h-14 px-10 bg-black text-white rounded-2xl font-medium hover:bg-secondary-blue transition-all">{isDE ? 'Schliessen' : 'Close'}</button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-xl bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl border border-black/5 animate-in zoom-in-95">
                <div className="flex justify-between items-start mb-10">
                    <div><h2 className="font-serif text-5xl mb-3">Let's Connect</h2><p className="text-[#6b6965]">{isDE ? 'Wie kann ich dich in der KI-Transformation deines Unternehmens unterstützen?' : 'How can I support you in your company\'s AI transformation?'}</p></div>
                    <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"><span className="material-symbols-outlined">close</span></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 flex items-start gap-3"><span className="material-symbols-outlined text-lg">error</span><p>{error}</p></div>}
                    <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-[#6b6965]">Name</label><input required type="text" placeholder="" className="w-full h-14 bg-[#f9f8f6] border-none rounded-2xl px-6 focus:ring-2 focus:ring-secondary-orange transition-all outline-none text-lg" value={name} onChange={(e) => setName(e.target.value)} /></div>
                    <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-[#6b6965]">{isDE ? 'E-Mail-Adresse' : 'Email Address'}</label><input required type="email" placeholder="" className="w-full h-14 bg-[#f9f8f6] border-none rounded-2xl px-6 focus:ring-2 focus:ring-secondary-orange transition-all outline-none text-lg" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                    <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-[#6b6965]">{isDE ? 'Deine Nachricht' : 'Your Message'}</label><textarea required rows={4} placeholder="" className="w-full bg-[#f9f8f6] border-none rounded-2xl p-6 focus:ring-2 focus:ring-secondary-orange transition-all outline-none text-lg resize-none" value={message} onChange={(e) => setMessage(e.target.value)} /></div>
                    <button type="submit" disabled={isSubmitting} className="w-full h-16 bg-black text-white rounded-2xl text-lg font-medium hover:bg-secondary-orange transition-all flex items-center justify-center gap-3 disabled:opacity-50">{isSubmitting ? <span className="animate-pulse">Senden...</span> : <>{isDE ? 'Jetzt senden' : 'Send now'}<span className="material-symbols-outlined">send</span></>}</button>
                </form>
            </div>
        </div>
    );
};
