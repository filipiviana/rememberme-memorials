
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, Calendar, Play, Pause, Heart } from 'lucide-react';
import { usePublicMemorial } from '@/hooks/usePublicMemorial';
import MemorialLogo from '@/components/MemorialLogo';

const PublicMemorial = () => {
  const { slug } = useParams<{ slug: string }>();
  const { memorial, loading, error } = usePublicMemorial(slug || '');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const toggleAudio = (audioId: string) => {
    setPlayingAudio(playingAudio === audioId ? null : audioId);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShare = async () => {
    const url = `https://rememberme.com.br/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Memorial de ${memorial?.name}`,
          text: `Conheça o memorial de ${memorial?.name}`,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      // Could add a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando memorial...</p>
        </div>
      </div>
    );
  }

  if (error || !memorial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Memorial não encontrado</h1>
          <p className="text-gray-600 mb-4">
            {error || 'Este memorial não está disponível ou não foi publicado.'}
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <MemorialLogo />
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
      </header>

      {/* Cover Photo */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {memorial.coverPhoto ? (
          <img
            src={memorial.coverPhoto}
            alt="Foto de capa"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Memorial Header */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Photo */}
              <div className="relative">
                <img
                  src={memorial.profilePhoto || '/placeholder.svg'}
                  alt={memorial.name}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>
              
              {/* Memorial Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-2">
                  <span className="text-sm text-gray-500 mr-2">Em memória de</span>
                  <Heart className="h-4 w-4 text-red-500" />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {memorial.name}
                </h1>
                
                {/* Birth and Death Dates */}
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start space-y-2 md:space-y-0 md:space-x-8 mb-4">
                  <div className="flex items-center text-gray-600">
                    <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                    <span className="text-sm">{formatDate(memorial.birthDate)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <div className="w-3 h-3 bg-gray-400 mr-2" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                    <span className="text-sm">{formatDate(memorial.deathDate)}</span>
                  </div>
                </div>
                
                {/* Tribute */}
                {memorial.tribute && (
                  <p className="text-lg text-gray-700 max-w-2xl">
                    {memorial.tribute}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex justify-center mb-8 sticky top-20 z-40">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {[
              { id: 'historia', label: 'História' },
              { id: 'memorias', label: 'Memórias' },
              { id: 'audio', label: 'Áudio' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className="px-6 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* História Section */}
        <section id="historia" className="mb-16 scroll-mt-32">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">História de Vida</h2>
              <p className="text-gray-700 leading-relaxed">
                {memorial.biography || 'Uma pessoa especial que tocou muitas vidas com sua bondade, alegria e amor. Sua memória permanecerá sempre viva em nossos corações, inspirando todos que tiveram o privilégio de conhecê-la.'}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Memórias Section */}
        <section id="memorias" className="mb-16 scroll-mt-32">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Galeria de Memórias</h2>
              {memorial.photos && memorial.photos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {memorial.photos.map((photo, index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <img
                        src={photo}
                        alt={`Memória ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg transition-transform group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma foto foi adicionada ainda.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Áudio Section */}
        <section id="audio" className="mb-16 scroll-mt-32">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Mensagens de Áudio</h2>
              {memorial.audios && memorial.audios.length > 0 ? (
                <div className="space-y-4">
                  {memorial.audios.map((audio, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleAudio(audio.url)}
                          className="w-12 h-12 rounded-full"
                        >
                          {playingAudio === audio.url ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                        </Button>
                        <div>
                          <p className="font-medium">{audio.title}</p>
                          {audio.duration && (
                            <p className="text-sm text-gray-500">
                              Duração: {Math.floor(audio.duration / 60)}:{(audio.duration % 60).toString().padStart(2, '0')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-gray-600">Nenhum áudio foi adicionado ainda</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center pb-8">
          <div className="text-sm text-gray-500">
            Criado com ❤️ por RememberMe
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicMemorial;
