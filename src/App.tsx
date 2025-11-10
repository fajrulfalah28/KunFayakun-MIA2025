import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import SignUpForm from './pages/SignUpForm';
import LoginPage from './pages/LoginPage';
import DetailKiosPage from './pages/DetailKiosPage';
import SettingsPage from './pages/SettingsPage';

type PageType = 'landing' | 'login' | 'signup' | 'detailkios' | 'settings';

const backgroundImages = [
  'https://images.unsplash.com/photo-1692609748666-95c48797b47d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1717657588624-16b762da95d6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1616636830943-606a21a78788?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1920',
];

export default function App() {
  // Load initial page from localStorage, default to 'login' if not logged in
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    const savedPage = localStorage.getItem('currentPage') as PageType | null;
    return savedPage || 'login';
  });

  // Save page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  const [currentImageIndex, setCurrentImageIndex] = useState(() => Math.floor(Math.random() * backgroundImages.length));
  const currentBgImage = backgroundImages[currentImageIndex];

  useEffect(() => {
    // Change image every 10 seconds (10000ms)
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage 
          onNavigateToLogin={() => setCurrentPage('login')}
          onNavigateToSignUp={() => setCurrentPage('signup')}
          onNavigateToDetailKios={() => setCurrentPage('detailkios')}
        />
      )}
      {currentPage === 'login' && (
        <LoginPage 
          onNavigateToSignUp={() => setCurrentPage('signup')}
          onNavigateToHome={() => setCurrentPage('landing')}
          currentBgImage={currentBgImage}
        />
      )}
      {currentPage === 'signup' && (
        <SignUpForm 
          onNavigateToLogin={() => setCurrentPage('login')}
          currentBgImage={currentBgImage}
        />
      )}
      {currentPage === 'detailkios' && (
        <DetailKiosPage
          onNavigateToLogin={() => setCurrentPage('login')}
          onNavigateToSignUp={() => setCurrentPage('signup')}
          onNavigateToHome={() => setCurrentPage('landing')}
          onNavigateToSettings={() => setCurrentPage('settings')}
          onNavigateToDetailKios={() => setCurrentPage('detailkios')}
        />
      )}
      {currentPage === 'settings' && (
        <SettingsPage
          onNavigateToLogin={() => setCurrentPage('login')}
          onNavigateToSignUp={() => setCurrentPage('signup')}
          onNavigateToHome={() => setCurrentPage('landing')}
          onNavigateToSettings={() => setCurrentPage('settings')}
          onNavigateToDetailKios={() => setCurrentPage('detailkios')}
        />
      )}
    </>
  );
}
