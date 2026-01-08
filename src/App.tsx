import React, { useState, lazy, Suspense } from 'react';
import { DataProvider, useData } from './contexts/DataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// UI Components (loaded immediately - needed for layout)
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';

// Critical sections loaded immediately (above the fold)
import { Hero } from './components/sections/Hero';
import { MissionSection } from './components/sections/MissionSection';

// Lazy-loaded sections (below the fold)
const ServiceSection = lazy(() => import('./components/sections/ServiceSection').then(m => ({ default: m.ServiceSection })));
const ProjectGrid = lazy(() => import('./components/sections/ProjectGrid').then(m => ({ default: m.ProjectGrid })));
const InsightsSection = lazy(() => import('./components/sections/InsightsSection').then(m => ({ default: m.InsightsSection })));
const NewsletterSection = lazy(() => import('./components/sections/NewsletterSection').then(m => ({ default: m.NewsletterSection })));
const AboutSection = lazy(() => import('./components/sections/AboutSection').then(m => ({ default: m.AboutSection })));
const PartnersSection = lazy(() => import('./components/sections/PartnersSection').then(m => ({ default: m.PartnersSection })));
const Impressum = lazy(() => import('./components/sections/Impressum').then(m => ({ default: m.Impressum })));
const PrivacyPolicy = lazy(() => import('./components/sections/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));

// Lazy-loaded admin components (only loaded when needed)
const AdminAuthModal = lazy(() => import('./components/admin/AdminAuthModal').then(m => ({ default: m.AdminAuthModal })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ContactModal = lazy(() => import('./components/admin/ContactModal').then(m => ({ default: m.ContactModal })));

// Loading fallback component
const SectionLoader: React.FC = () => (
  <div className="w-full py-20 flex items-center justify-center">
    <div className="animate-pulse text-[#6b6965]">Loading...</div>
  </div>
);

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const {
    isAuthenticated, isAdminOpen, isContactOpen, isAuthModalOpen,
    login, logout, closeAdmin, closeContact, openAuthModal, closeAuthModal, openAdmin, openContact
  } = useAuth();
  const { currentData, currentLanguage, setLanguage, isTranslating } = useLanguage();
  const { subscribers, saveTranslations, deleteSubscriber, clearSubscribers, isLoading, addSubscriber, translations } = useData();

  // No longer blocking on isLoading - content renders immediately with INITIAL_DATA
  // Firestore data loads in background and updates seamlessly

  const renderContent = () => {
    switch (currentView) {
      case 'impressum':
        return <Suspense fallback={<SectionLoader />}><Impressum /></Suspense>;
      case 'privacy':
        return <Suspense fallback={<SectionLoader />}><PrivacyPolicy /></Suspense>;
      case 'mission':
        return <MissionSection content={currentData.mission} />;
      case 'services':
        return <Suspense fallback={<SectionLoader />}><ServiceSection services={currentData.services} onContact={openContact} /></Suspense>;
      case 'projects':
        return <Suspense fallback={<SectionLoader />}><ProjectGrid projects={currentData.projects} heading={currentData.projectsHeading} intro={currentData.projectsIntro} /></Suspense>;
      case 'insights':
        return <Suspense fallback={<SectionLoader />}><InsightsSection insights={currentData.insights} heading={currentData.insightsHeading} intro={currentData.insightsIntro} /></Suspense>;
      case 'about':
        return <Suspense fallback={<SectionLoader />}><AboutSection content={currentData.about} /></Suspense>;
      case 'home':
      default:
        return (
          <Suspense fallback={<SectionLoader />}>
            <Hero subtitle={currentData.mission.subheading} logoUrl={currentData.logoUrl} />
            <MissionSection content={currentData.mission} />
            <ServiceSection services={currentData.services} onContact={openContact} />
            <ProjectGrid projects={currentData.projects} heading={currentData.projectsHeading} intro={currentData.projectsIntro} />
            <InsightsSection insights={currentData.insights} heading={currentData.insightsHeading} intro={currentData.insightsIntro} />
            <PartnersSection partners={currentData.partners} />
            <NewsletterSection onSubscribe={addSubscriber} />
          </Suspense>
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
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo(0, 0);
        }}
      />

      {isAuthModalOpen && (
        <Suspense fallback={null}>
          <AdminAuthModal
            onLogin={login}
            onClose={closeAuthModal}
          />
        </Suspense>
      )}

      {isAdminOpen && isAuthenticated && (
        <Suspense fallback={<SectionLoader />}>
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
        </Suspense>
      )}

      {isContactOpen && (
        <Suspense fallback={null}>
          <ContactModal onClose={closeContact} />
        </Suspense>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <DataProvider>
        <AuthProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </AuthProvider>
      </DataProvider>
    </ErrorBoundary>
  );
};

export default App;
