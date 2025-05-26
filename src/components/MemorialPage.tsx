
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Share2, Heart, Calendar, MapPin, Play } from 'lucide-react';
import { Memorial } from '../types/memorial';
import MemorialLogo from './MemorialLogo';

interface MemorialPageProps {
  memorial: Memorial;
  onBack: () => void;
}

const MemorialPage = ({ memorial, onBack }: MemorialPageProps) => {
  const [selectedTab, setSelectedTab] = useState('historia');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateAge = (birthDate: string, deathDate: string) => {
    const birth = new Date(birthDate);
    const death = new Date(deathDate);
    return death.getFullYear() - birth.getFullYear();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Painel
              </Button>
              <MemorialLogo />
            </div>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
      </header>

      {/* Memorial Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cover Photo */}
        <div className="relative h-64 md:h-80 rounded-b-lg overflow-hidden">
          <img
            src={memorial.coverPhoto}
            alt="Foto de capa"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Profile Section */}
        <div className="relative -mt-16 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6 px-6">
            <img
              src={memorial.profilePhoto}
              alt={memorial.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="text-center md:text-left text-white md:mb-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{memorial.name}</h1>
              <div className="flex items-center justify-center md:justify-start space-x-4 text-sm">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(memorial.birthDate)}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {formatDate(memorial.deathDate)}
                </span>
              </div>
              <p className="text-lg mt-2 opacity-90">{memorial.tribute}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {[
              { id: 'historia', label: 'História' },
              { id: 'memorias', label: 'Memórias' },
              { id: 'audio', label: 'Áudio' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Based on Selected Tab */}
        <div className="mb-8">
          {selectedTab === 'historia' && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">História de Vida</h2>
                <p className="text-gray-700 leading-relaxed">
                  {memorial.biography || 'Uma pessoa especial que tocou muitas vidas com sua bondade, alegria e amor. Sua memória permanecerá sempre viva em nossos corações, inspirando todos que tiveram o privilégio de conhecê-la.'}
                </p>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'memorias' && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Galeria de Memórias</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Sample photos grid - like the uploaded image */}
                    {Array.from({ length: 15 }, (_, i) => (
                      <div key={i} className="relative group cursor-pointer">
                        <img
                          src={`https://images.unsplash.com/photo-149479010875${i}?w=400&h=400&fit=crop`}
                          alt={`Memória ${i + 1}`}
                          className="w-full h-32 object-cover rounded-lg transition-transform group-hover:scale-105"
                        />
                        {i % 4 === 0 && (
                          <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === 'audio' && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Mensagem de Áudio</h2>
                <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-gray-600">Reproduzir mensagem especial</p>
                    <p className="text-sm text-gray-500 mt-2">Duração: 2:30</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Share Button */}
        <div className="text-center pb-8">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg">
            Compartilhar
          </Button>
        </div>
      </main>
    </div>
  );
};

export default MemorialPage;
