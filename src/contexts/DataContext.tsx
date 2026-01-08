import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WebsiteData } from '../types';
import { INITIAL_DATA, INITIAL_DATA_DE } from '../constants';
import { DataService, Subscriber } from '../lib/firebase';

interface DataContextType {
    translations: Record<string, WebsiteData>;
    subscribers: Subscriber[];
    isLoading: boolean;
    saveTranslations: (translations: Record<string, WebsiteData>) => Promise<void>;
    addSubscriber: (email: string) => void;
    deleteSubscriber: (email: string) => void;
    clearSubscribers: () => void;
    loadData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Start with INITIAL_DATA_DE immediately - no loading state blocking the UI
    const [translations, setTranslations] = useState<Record<string, WebsiteData>>({ de: INITIAL_DATA_DE });
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    // Start with false - we show content immediately, load in background
    const [isLoading, setIsLoading] = useState(false);

    const loadData = async () => {
        try {
            const saved = await DataService.load();
            if (saved) {
                // Merge with fallback data to ensure all schema fields are present
                const merged: Record<string, WebsiteData> = { ...saved };
                if (saved['de']) {
                    merged['de'] = { ...INITIAL_DATA_DE, ...saved['de'] };
                }
                if (saved['en']) {
                    merged['en'] = { ...INITIAL_DATA, ...saved['en'] };
                }
                setTranslations(merged);
            }
            // Load subscribers in background - no need to block
            const savedSubs = await DataService.loadSubscribers();
            setSubscribers(savedSubs);
        } catch (error) {
            console.error("Failed to load data:", error);
            // Keep using INITIAL_DATA_DE on error - site still works
        }
    };

    useEffect(() => {
        // Load Firestore data in background without blocking render
        loadData();
    }, []);

    const saveTranslations = async (newTranslations: Record<string, WebsiteData>) => {
        setTranslations(newTranslations);
        await DataService.save(newTranslations);
    };

    const addSubscriber = (email: string) => {
        setSubscribers(prev => {
            if (prev.some(s => s.email === email)) return prev;
            const next = [{ email, date: new Date().toISOString() }, ...prev];
            DataService.saveSubscribers(next);
            return next;
        });
    };

    const deleteSubscriber = (email: string) => {
        const next = subscribers.filter(s => s.email !== email);
        setSubscribers(next);
        DataService.saveSubscribers(next);
    };

    const clearSubscribers = () => {
        setSubscribers([]);
        DataService.saveSubscribers([]);
    };

    return (
        <DataContext.Provider value={{
            translations,
            subscribers,
            isLoading,
            saveTranslations,
            addSubscriber,
            deleteSubscriber,
            clearSubscribers,
            loadData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
