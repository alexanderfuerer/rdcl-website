import React, { useState } from 'react';

interface AdminAuthModalProps {
    onLogin: () => void;
    onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ onLogin, onClose }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'rdcl2024') onLogin();
        else {
            setError(true);
            setTimeout(() => setError(false), 1000);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`w-full max-w-md bg-white rounded-[2.5rem] p-12 shadow-2xl border border-black/5 transform transition-all duration-300 ${error ? 'animate-shake' : 'animate-in zoom-in-95'}`}>
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-secondary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-3xl text-secondary-blue">shield_person</span>
                    </div>
                    <h2 className="font-serif text-3xl mb-2">Backend Access</h2>
                    <p className="text-sm text-[#6b6965]">Verify admin credentials to access core systems.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="password"
                        autoFocus
                        placeholder="System Password"
                        className={`w-full h-14 bg-[#f9f8f6] border-none rounded-2xl px-6 focus:ring-2 focus:ring-secondary-blue transition-all outline-none text-center tracking-[0.5em] font-bold ${error ? 'text-red-500 ring-2 ring-red-200' : 'text-black'}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 h-14 rounded-2xl text-sm font-medium text-[#6b6965] hover:bg-black/5 transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 h-14 bg-black text-white rounded-2xl text-sm font-medium hover:bg-secondary-blue transition-all">Authorize</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
