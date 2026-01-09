import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { WebsiteData } from '../types';
import { INITIAL_DATA, INITIAL_DATA_DE } from '../constants';
import { useData } from './DataContext';

export type Language = 'de' | 'en';

interface LanguageContextType {
    currentLanguage: Language;
    isTranslating: boolean;
    currentData: WebsiteData;
    setLanguage: (lang: Language) => void;
}

const STORAGE_KEY = 'rdcl-language';

// Detect browser language, default to German
const getInitialLanguage = (): Language => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
        return 'de';
    }
    try {
        // Check localStorage first
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'de' || stored === 'en') {
            return stored;
        }
    } catch {
        // localStorage might not be available
    }
    // Default to German (primary audience)
    return 'de';
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage);
    const [isTranslating, setIsTranslating] = useState(false);
    const { translations } = useData();

    // Get the appropriate fallback data based on language
    const getFallbackData = (lang: Language): WebsiteData => {
        return lang === 'de' ? INITIAL_DATA_DE : INITIAL_DATA;
    };

    const currentData = useMemo(() => {
        const saved = translations[currentLanguage];
        // Use saved data directly if it exists, otherwise fallback
        if (saved) {
            return saved;
        }
        return getFallbackData(currentLanguage);
    }, [translations, currentLanguage]);

    const setLanguage = (lang: Language) => {
        if (lang === currentLanguage) return;

        setIsTranslating(true);
        setCurrentLanguage(lang);
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {
            // localStorage might not be available
        }

        // Brief transition effect
        setTimeout(() => setIsTranslating(false), 150);
    };

    // Persist language preference
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, currentLanguage);
        } catch {
            // localStorage might not be available
        }
    }, [currentLanguage]);

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
