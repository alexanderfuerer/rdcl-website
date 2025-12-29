import React from 'react';

interface CMSFieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    textarea?: boolean;
    type?: string;
}

export const CMSField: React.FC<CMSFieldProps> = ({ label, value, onChange, textarea = false, type = "text" }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</label>
        {textarea ? (
            <textarea
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-white/20 outline-none text-sm min-h-[100px]"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        ) : (
            <input
                type={type}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-white/20 outline-none text-sm"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        )}
    </div>
);
