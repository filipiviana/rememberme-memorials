
import React, { useState } from 'react';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import MemorialPage from '../components/MemorialPage';
import { Memorial } from '../types/memorial';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'memorial'>('dashboard');
  const [selectedMemorial, setSelectedMemorial] = useState<Memorial | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard');
    setSelectedMemorial(null);
  };

  const handleViewMemorial = (memorial: Memorial) => {
    setSelectedMemorial(memorial);
    setCurrentView('memorial');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedMemorial(null);
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (currentView === 'memorial' && selectedMemorial) {
    return (
      <MemorialPage
        memorial={selectedMemorial}
        onBack={handleBackToDashboard}
      />
    );
  }

  return (
    <AdminDashboard
      onLogout={handleLogout}
      onViewMemorial={handleViewMemorial}
    />
  );
};

export default Index;
