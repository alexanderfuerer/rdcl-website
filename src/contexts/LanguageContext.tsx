import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { WebsiteData } from '../types';
import { INITIAL_DATA } from '../constants';
import { useData } from './DataContext';
// @ts-ignore
import deData from '../data/de.json';

interface LanguageContextType {
    currentLanguage: 'en' | 'de';
    isTranslating: boolean;
    currentData: WebsiteData;
    setLanguage: (lang: 'en' | 'de') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<'en' | 'de'>('en');
    const [isTranslating, setIsTranslating] = useState(false);
    const { translations, saveTranslations } = useData();

    const currentData = useMemo(() => {
        return translations[currentLanguage] || translations.en || INITIAL_DATA;
    }, [currentLanguage, translations]);

    const translateToGerman = async (sourceData: WebsiteData) => {
        if (translations.de || isTranslating) return;
        try {
            setIsTranslating(true);

            // Simulate a short delay for better UX (optional)
            await new Promise(resolve => setTimeout(resolve, 500));

            // Use the imported JSON data
            await saveTranslations({
                ...translations,
                de: deData as WebsiteData
            });

            setLanguage('de');
        } catch (err) {
            console.error("Translation Error:", err);
        } finally {
            setIsTranslating(false);
        }
    };

    const setLanguage = (lang: 'en' | 'de') => {
        setCurrentLanguage(lang);
        if (lang === 'de') {
            translateToGerman(translations.en || INITIAL_DATA);
        }
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
