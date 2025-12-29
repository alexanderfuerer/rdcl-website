import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    isAdminOpen: boolean;
    isContactOpen: boolean;
    isAuthModalOpen: boolean;
    login: () => void;
    logout: () => void;
    openAdmin: () => void;
    closeAdmin: () => void;
    openContact: () => void;
    closeContact: () => void;
    openAuthModal: () => void;
    closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        const auth = sessionStorage.getItem('rdcl_admin_auth');
        if (auth === 'true') setIsAuthenticated(true);
    }, []);

    const login = () => {
        sessionStorage.setItem('rdcl_admin_auth', 'true');
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
        setIsAdminOpen(true);
    };

    const logout = () => {
        sessionStorage.removeItem('rdcl_admin_auth');
        setIsAuthenticated(false);
        setIsAdminOpen(false);
    };

    const openAdmin = () => setIsAdminOpen(true);
    const closeAdmin = () => setIsAdminOpen(false);

    const openContact = () => setIsContactOpen(true);
    const closeContact = () => setIsContactOpen(false);

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isAdminOpen,
            isContactOpen,
            isAuthModalOpen,
            login,
            logout,
            openAdmin,
            closeAdmin,
            openContact,
            closeContact,
            openAuthModal,
            closeAuthModal
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
