
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import MemorialPage from '../components/MemorialPage';
import { Memorial } from '../types/memorial';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'memorial'>('dashboard');
  const [selectedMemorial, setSelectedMemorial] = useState<Memorial | null>(null);

  const handleViewMemorial = (memorial: Memorial) => {
    setSelectedMemorial(memorial);
    setCurrentView('memorial');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedMemorial(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
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
      onViewMemorial={handleViewMemorial}
    />
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
