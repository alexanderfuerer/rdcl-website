import React, { useState } from 'react';
import { HARDCODED_LOGO_URL } from '../../constants';

interface LogoProps {
    className?: string;
    logoUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-12", logoUrl }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`${className} relative flex items-center justify-center transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <img
                src={logoUrl || HARDCODED_LOGO_URL}
                alt="RDCL"
                loading="eager"
                onLoad={() => setIsLoaded(true)}
                className="h-full w-full object-contain mix-blend-multiply block"
                style={{ minWidth: '80px' }}
            />
        </div>
    );
};
