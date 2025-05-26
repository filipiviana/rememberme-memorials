
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Memorial } from '../types/memorial';
import MemorialLogo from './MemorialLogo';

interface CreateMemorialFormProps {
  onSubmit: (memorial: Memorial) => void;
  onCancel: () => void;
}

const CreateMemorialForm = ({ onSubmit, onCancel }: CreateMemorialFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    tribute: '',
    biography: '',
    profilePhoto: '',
    coverPhoto: ''
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.birthDate || !formData.deathDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, data de nascimento e falecimento",
        variant: "destructive",
      });
      return;
    }

    const memorial: Memorial = {
      id: Date.now().toString(),
      name: formData.name,
      birthDate: formData.birthDate,
      deathDate: formData.deathDate,
      tribute: formData.tribute,
      biography: formData.biography,
      profilePhoto: formData.profilePhoto || 'https://images.unsplash.com/photo-1494790108755-2616b612b788?w=400',
      coverPhoto: formData.coverPhoto || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
      photos,
      videos,
      slug: generateSlug(formData.name),
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSubmit(memorial);
    
    toast({
      title: "Memorial criado com sucesso!",
      description: `O memorial de ${formData.name} foi criado e está disponível.`,
    });
  };

  const handlePhotoUpload = () => {
    // Simulação de upload - em produção integraria com serviço de upload
    const samplePhotos = [
      'https://images.unsplash.com/photo-1494790108755-2616b612b788?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
    ];
    const randomPhoto = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    setPhotos(prev => [...prev, randomPhoto]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onCancel}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <MemorialLogo />
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Memorial</CardTitle>
            <CardDescription>
              Preencha as informações para criar uma página memorial personalizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tribute">Frase de Homenagem</Label>
                  <Input
                    id="tribute"
                    value={formData.tribute}
                    onChange={(e) => setFormData(prev => ({ ...prev, tribute: e.target.value }))}
                    placeholder="Uma frase especial em memória"
                  />
                </div>
              </div>

              {/* Datas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                    required
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
                  />
                </div>
              </div>

              {/* Fotos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profilePhoto">Foto de Perfil (URL)</Label>
                  <Input
                    id="profilePhoto"
                    value={formData.profilePhoto}
                    onChange={(e) => setFormData(prev => ({ ...prev, profilePhoto: e.target.value }))}
                    placeholder="URL da foto de perfil"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverPhoto">Foto de Capa (URL)</Label>
                  <Input
                    id="coverPhoto"
                    value={formData.coverPhoto}
                    onChange={(e) => setFormData(prev => ({ ...prev, coverPhoto: e.target.value }))}
                    placeholder="URL da foto de capa"
                  />
                </div>
              </div>

              {/* Biografia */}
              <div className="space-y-2">
                <Label htmlFor="biography">Biografia</Label>
                <Textarea
                  id="biography"
                  value={formData.biography}
                  onChange={(e) => setFormData(prev => ({ ...prev, biography: e.target.value }))}
                  placeholder="Conte a história de vida desta pessoa especial..."
                  rows={4}
                />
              </div>

              {/* Galeria de Fotos */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Galeria de Fotos</Label>
                  <Button type="button" variant="outline" onClick={handlePhotoUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Adicionar Foto
                  </Button>
                </div>
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setPhotos(prev => prev.filter((_, i) => i !== index))}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Criar Memorial
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateMemorialForm;
