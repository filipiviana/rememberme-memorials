
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, QrCode, Users, Calendar, Heart } from 'lucide-react';
import MemorialLogo from './MemorialLogo';
import CreateMemorialForm from './CreateMemorialForm';
import { Memorial } from '../types/memorial';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewMemorial: (memorial: Memorial) => void;
}

const AdminDashboard = ({ onLogout, onViewMemorial }: AdminDashboardProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [memorials, setMemorials] = useState<Memorial[]>([
    {
      id: '1',
      name: 'Anna Luiza Nicolau Evangelista',
      birthDate: '1998-05-06',
      deathDate: '2020-12-05',
      tribute: 'Que ela viva nesse mundo até cumprir o mais propósito. Anna Luiza Nicolau Evangelista',
      profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b788?w=400',
      coverPhoto: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
      biography: 'Uma pessoa especial que tocou muitas vidas...',
      photos: [],
      videos: [],
      slug: 'anna-luiza-nicolau-evangelista',
      createdAt: '2024-01-15'
    }
  ]);

  const handleCreateMemorial = (memorial: Memorial) => {
    setMemorials(prev => [...prev, memorial]);
    setShowCreateForm(false);
  };

  const handleDeleteMemorial = (id: string) => {
    setMemorials(prev => prev.filter(m => m.id !== id));
  };

  if (showCreateForm) {
    return (
      <CreateMemorialForm
        onSubmit={handleCreateMemorial}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <MemorialLogo />
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Administrador</span>
              <Button variant="outline" onClick={onLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Memoriais</p>
                  <p className="text-3xl font-bold text-gray-900">{memorials.length}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Visitantes Este Mês</p>
                  <p className="text-3xl font-bold text-gray-900">1,234</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Criados Este Mês</p>
                  <p className="text-3xl font-bold text-gray-900">5</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">QR Codes Gerados</p>
                  <p className="text-3xl font-bold text-gray-900">12</p>
                </div>
                <QrCode className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Memorials List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Memoriais Criados</CardTitle>
                <CardDescription>
                  Gerencie todos os memoriais criados na plataforma
                </CardDescription>
              </div>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Memorial
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {memorials.map((memorial) => (
                <div key={memorial.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img
                      src={memorial.profilePhoto}
                      alt={memorial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{memorial.name}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(memorial.birthDate).toLocaleDateString('pt-BR')} - {new Date(memorial.deathDate).toLocaleDateString('pt-BR')}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">memorialize.com/{memorial.slug}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewMemorial(memorial)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <QrCode className="h-4 w-4 mr-1" />
                      QR Code
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMemorial(memorial.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
