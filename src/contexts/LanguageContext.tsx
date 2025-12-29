import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { WebsiteData } from '../types';
import { INITIAL_DATA } from '../constants';
import { useData } from './DataContext';

interface LanguageContextType {
    currentLanguage: 'en';
    isTranslating: boolean;
    currentData: WebsiteData;
    setLanguage: (lang: 'en') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Hardcoded to 'en'
    const currentLanguage = 'en';
    const isTranslating = false;
    const { translations } = useData();

    const currentData = useMemo(() => {
        return translations.en || INITIAL_DATA;
    }, [translations]);

    const setLanguage = (lang: 'en') => {
        // No-op for single language
        console.log("Language set to", lang);
    };

    return (
        <LanguageContext.Provider value={{
            currentLanguage,
            isTranslating,
            currentData,
            setLanguage
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
