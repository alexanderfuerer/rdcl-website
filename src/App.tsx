import React, { useState } from 'react';
import { DataProvider, useData } from './contexts/DataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// UI Components
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';

// Page Sections
import { Hero } from './components/sections/Hero';
import { MissionSection } from './components/sections/MissionSection';
import { ServiceSection } from './components/sections/ServiceSection';
import { ProjectGrid } from './components/sections/ProjectGrid';
import { InsightsSection } from './components/sections/InsightsSection';
import { NewsletterSection } from './components/sections/NewsletterSection';
import { AboutSection } from './components/sections/AboutSection';
import { PartnersSection } from './components/sections/PartnersSection';

// Admin Components
import { AdminAuthModal } from './components/admin/AdminAuthModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ContactModal } from './components/admin/ContactModal';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const {
    isAuthenticated, isAdminOpen, isContactOpen, isAuthModalOpen,
    login, logout, closeAdmin, closeContact, openAuthModal, closeAuthModal, openAdmin, openContact
  } = useAuth();
  const { currentData, currentLanguage, setLanguage, isTranslating } = useLanguage();
  const { subscribers, saveTranslations, deleteSubscriber, clearSubscribers, isLoading, addSubscriber, translations } = useData();

  if (isLoading) return <div className="min-h-screen bg-[#f9f8f6] flex items-center justify-center font-serif text-xl">Loading...</div>;

  const renderContent = () => {
    switch (currentView) {
      case 'mission':
        return <MissionSection content={currentData.mission} />;
      case 'services':
        return <ServiceSection services={currentData.services} />;
      case 'projects':
        return <ProjectGrid projects={currentData.projects} heading={currentData.projectsHeading} intro={currentData.projectsIntro} />;
      case 'insights':
        return <InsightsSection insights={currentData.insights} />;
      case 'about':
        return <AboutSection content={currentData.about} />;
      case 'home':
      default:
        return (
          <>
            <Hero subtitle={currentData.mission.subheading} logoUrl={currentData.logoUrl} />
            <MissionSection content={currentData.mission} />
            <ServiceSection services={currentData.services} />
            <ProjectGrid projects={currentData.projects} heading={currentData.projectsHeading} intro={currentData.projectsIntro} />
            <InsightsSection insights={currentData.insights} />
            <PartnersSection partners={currentData.partners} />
            <NewsletterSection onSubscribe={addSubscriber} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f8f6] text-[#191716] font-sans selection:bg-secondary-orange selection:text-white">
      <Navbar
        onNavigate={setCurrentView}
        currentView={currentView}
      />

      <main className="pt-20">
        {renderContent()}
      </main>

      <Footer
        readinessUrl={currentData.aiReadinessUrl}
        onAdminTrigger={openAuthModal}
        logoUrl={currentData.logoUrl}
      />

      {isAuthModalOpen && (
        <AdminAuthModal
          onLogin={login}
          onClose={closeAuthModal}
        />
      )}

      {isAdminOpen && isAuthenticated && (
        <AdminDashboard
          initialTranslations={translations}
          subscribers={subscribers}
          onSave={saveTranslations}
          onClose={closeAdmin}
          onDeleteSubscriber={deleteSubscriber}
          onClearSubscribers={() => {
            if (window.confirm("Clear list?")) {
              clearSubscribers();
            }
          }}
        />
      )}

      {isContactOpen && <ContactModal onClose={closeContact} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AuthProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </DataProvider>
  );
};

export default App;
