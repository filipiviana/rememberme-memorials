
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import AdminLogin from '../components/AdminLogin';
import AdminDashboard from '../components/AdminDashboard';
import MemorialPage from '../components/MemorialPage';
import AdminTributesManager from '../components/AdminTributesManager';
import { Memorial } from '../types/memorial';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'memorial' | 'tributes'>('dashboard');
  const [selectedMemorial, setSelectedMemorial] = useState<Memorial | null>(null);

  const handleViewMemorial = (memorial: Memorial) => {
    setSelectedMemorial(memorial);
    setCurrentView('memorial');
  };

  const handleViewTributes = () => {
    setCurrentView('tributes');
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

  if (currentView === 'tributes') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={handleBackToDashboard}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Painel
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminTributesManager />
        </main>
      </div>
    );
  }

  return (
    <AdminDashboard
      onViewMemorial={handleViewMemorial}
      onViewTributes={handleViewTributes}
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
