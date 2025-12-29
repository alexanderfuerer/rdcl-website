import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WebsiteData } from '../types';
import { INITIAL_DATA } from '../constants';
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
    const [translations, setTranslations] = useState<Record<string, WebsiteData>>({});
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const saved = await DataService.load();
            setTranslations(saved || { en: INITIAL_DATA });
            const savedSubs = await DataService.loadSubscribers();
            setSubscribers(savedSubs);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
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
