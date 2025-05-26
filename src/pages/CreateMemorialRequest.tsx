import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AudioFile } from '@/types/memorial';
import MemorialLogo from '@/components/MemorialLogo';
import FileUpload from '@/components/FileUpload';
import GalleryUpload from '@/components/GalleryUpload';
import AudioUpload from '@/components/AudioUpload';
import VideoUpload from '@/components/VideoUpload';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';

interface VideoFile {
  url: string;
  title: string;
}

const CreateMemorialRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    tribute: '',
    biography: '',
    profilePhoto: '',
    coverPhoto: '',
    requesterName: '',
    requesterEmail: '',
    requesterPhone: ''
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [audios, setAudios] = useState<AudioFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.birthDate || !formData.deathDate || !formData.requesterName || !formData.requesterEmail) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('memorial_requests')
        .insert({
          name: formData.name,
          birth_date: formData.birthDate,
          death_date: formData.deathDate,
          tribute: formData.tribute,
          biography: formData.biography,
          profile_photo_url: formData.profilePhoto,
          cover_photo_url: formData.coverPhoto,
          photos,
          videos: videos.map(v => v.url),
          audios: audios as any, // Cast to 'any' to satisfy the Json type
          requester_name: formData.requesterName,
          requester_email: formData.requesterEmail,
          requester_phone: formData.requesterPhone
        });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Solicitação enviada com sucesso!",
        description: "Entraremos em contato em breve para finalizar seu memorial.",
      });
    } catch (error) {
      console.error('Error creating memorial request:', error);
      toast({
        title: "Erro ao enviar solicitação",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Solicitação Enviada!
            </h2>
            <p className="text-gray-600 mb-6">
              Obrigado por escolher Remember Me. Nossa equipe analisará sua solicitação e entraremos em contato em breve através do email fornecido.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/')} className="w-full">
                Voltar ao Início
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
                Criar Outro Memorial
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <MemorialLogo />
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Criar Memorial</CardTitle>
            <CardDescription>
              Preencha as informações para criar um memorial especial. Nossa equipe revisará e entrará em contato.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Memorial Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Informações do Memorial</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Digite o nome completo"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tribute">Frase de Homenagem</Label>
                    <Input
                      id="tribute"
                      value={formData.tribute}
                      onChange={(e) => setFormData(prev => ({ ...prev, tribute: e.target.value }))}
                      placeholder="Uma frase especial em memória"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deathDate">Data de Falecimento *</Label>
                    <Input
                      id="deathDate"
                      type="date"
                      value={formData.deathDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, deathDate: e.target.value }))}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUpload
                    label="Foto de Perfil"
                    accept="image/*"
                    onUpload={(url) => setFormData(prev => ({ ...prev, profilePhoto: url }))}
                    currentFile={formData.profilePhoto}
                  />
                  <FileUpload
                    label="Foto de Capa"
                    accept="image/*"
                    onUpload={(url) => setFormData(prev => ({ ...prev, coverPhoto: url }))}
                    currentFile={formData.coverPhoto}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biography">Biografia</Label>
                  <Textarea
                    id="biography"
                    value={formData.biography}
                    onChange={(e) => setFormData(prev => ({ ...prev, biography: e.target.value }))}
                    placeholder="Conte a história de vida desta pessoa especial..."
                    rows={4}
                    disabled={isSubmitting}
                  />
                </div>

                <GalleryUpload
                  photos={photos}
                  onPhotosChange={setPhotos}
                />

                <VideoUpload
                  videos={videos}
                  onVideosChange={setVideos}
                />

                <AudioUpload
                  audios={audios}
                  onAudiosChange={setAudios}
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900">Suas Informações de Contato</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="requesterName">Seu Nome *</Label>
                    <Input
                      id="requesterName"
                      value={formData.requesterName}
                      onChange={(e) => setFormData(prev => ({ ...prev, requesterName: e.target.value }))}
                      placeholder="Seu nome completo"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requesterPhone">Telefone</Label>
                    <Input
                      id="requesterPhone"
                      value={formData.requesterPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, requesterPhone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requesterEmail">Email *</Label>
                  <Input
                    id="requesterEmail"
                    type="email"
                    value={formData.requesterEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, requesterEmail: e.target.value }))}
                    placeholder="seu@email.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Link to="/">
                  <Button type="button" variant="outline" disabled={isSubmitting}>
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateMemorialRequest;
