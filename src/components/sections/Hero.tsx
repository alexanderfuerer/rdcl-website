import React, { useState } from 'react';
import { FormattedText } from '../ui/FormattedText';
import { NeuralNetworkCanvas } from '../ui/NeuralNetworkCanvas';
import { HARDCODED_LOGO_URL } from '../../constants';

interface HeroProps {
    subtitle: string;
    logoUrl: string;
}

const HeroLogo = ({ logoUrl }: { logoUrl: string }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`relative mb-6 pointer-events-none z-30 flex items-center justify-start transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <img
                src={logoUrl || HARDCODED_LOGO_URL}
                alt="RDCL Ink Logo"
                loading="eager"
                onLoad={() => setIsLoaded(true)}
                className="w-[280px] md:w-[420px] h-auto object-contain mix-blend-multiply block"
            />
        </div>
    );
};

export const Hero: React.FC<HeroProps> = ({ subtitle, logoUrl }) => (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="hero-grain"></div>
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(90,125,163,0.12)_0%,_rgba(255,78,5,0.04)_30%,_rgba(109,138,122,0.02)_60%,_transparent_80%)] animate-mesh-flow"></div>
        </div>
        <div className="relative z-10 w-full max-w-[1400px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-start text-left relative pt-0 pb-12 lg:pb-24">
                <HeroLogo logoUrl={logoUrl} />
                <h1 className="font-serif font-normal text-6xl md:text-7xl lg:text-[6.5rem] leading-[0.9] tracking-tight text-black mb-8 relative z-20">Human Centered AI-Consulting</h1>
                <div className="text-xl md:text-2xl text-[#6b6965] font-normal max-w-xl mb-10 leading-relaxed tracking-tight relative z-20">
                    <p>Bei RDCL geht es nicht um KI um der KI willen. Wir setzen Systeme auf, die Arbeit einfacher machen – und Menschen stärker. Wenn KI skaliert, soll der menschliche Wert nicht kleiner werden, sondern sichtbarer.</p>
                </div>
            </div>
            <div className="hidden lg:flex justify-center items-center relative w-full"><NeuralNetworkCanvas /></div>
        </div>
    </section>
);
