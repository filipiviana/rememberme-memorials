
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Memorial } from '@/types/memorial';
import FileUpload from './FileUpload';
import GalleryUpload from './GalleryUpload';
import AudioUpload from './AudioUpload';
import VideoUpload from './VideoUpload';

interface VideoFile {
  url: string;
  title: string;
}

interface EditMemorialFormProps {
  memorial: Memorial;
  onSubmit: (memorial: Memorial) => void;
  onCancel: () => void;
}

const EditMemorialForm = ({ memorial, onSubmit, onCancel }: EditMemorialFormProps) => {
  const [profilePhoto, setProfilePhoto] = useState(memorial.profilePhoto);
  const [coverPhoto, setCoverPhoto] = useState(memorial.coverPhoto);
  const [photos, setPhotos] = useState<string[]>(memorial.photos);
  const [videos, setVideos] = useState<VideoFile[]>(
    memorial.videos.map((url, index) => ({
      url,
      title: `Vídeo ${index + 1}`
    }))
  );
  const [audios, setAudios] = useState(memorial.audios || []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: memorial.name,
      birthDate: memorial.birthDate,
      deathDate: memorial.deathDate,
      tribute: memorial.tribute,
      biography: memorial.biography,
    }
  });

  const onFormSubmit = (data: any) => {
    const updatedMemorial: Memorial = {
      ...memorial,
      name: data.name,
      birthDate: data.birthDate,
      deathDate: data.deathDate,
      tribute: data.tribute,
      biography: data.biography,
      profilePhoto,
      coverPhoto,
      photos,
      videos: videos.map(v => v.url),
      audios,
    };

    onSubmit(updatedMemorial);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={onCancel}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Editar Memorial</CardTitle>
              <CardDescription>
                Atualize as informações do memorial de {memorial.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                {/* Informações Básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      {...register('name', { required: 'Nome é obrigatório' })}
                      placeholder="Nome completo da pessoa"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="birthDate">Data de Nascimento *</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...register('birthDate', { required: 'Data de nascimento é obrigatória' })}
                      />
                      {errors.birthDate && (
                        <p className="text-sm text-red-600 mt-1">{errors.birthDate.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="deathDate">Data de Falecimento *</Label>
                      <Input
                        id="deathDate"
                        type="date"
                        {...register('deathDate', { required: 'Data de falecimento é obrigatória' })}
                      />
                      {errors.deathDate && (
                        <p className="text-sm text-red-600 mt-1">{errors.deathDate.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUpload
                    label="Foto de Perfil"
                    accept="image/*"
                    currentFile={profilePhoto}
                    onUpload={setProfilePhoto}
                  />

                  <FileUpload
                    label="Foto de Capa"
                    accept="image/*"
                    currentFile={coverPhoto}
                    onUpload={setCoverPhoto}
                  />
                </div>

                <div>
                  <Label htmlFor="tribute">Tributo</Label>
                  <Textarea
                    id="tribute"
                    {...register('tribute')}
                    placeholder="Uma mensagem especial de tributo..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="biography">Biografia</Label>
                  <Textarea
                    id="biography"
                    {...register('biography')}
                    placeholder="Conte a história de vida desta pessoa especial..."
                    rows={5}
                  />
                </div>

                {/* Galeria de Fotos */}
                <GalleryUpload
                  photos={photos}
                  onPhotosChange={setPhotos}
                />

                {/* Upload de Vídeos */}
                <VideoUpload
                  videos={videos}
                  onVideosChange={setVideos}
                />

                {/* Arquivos de Áudio */}
                <AudioUpload
                  audios={audios}
                  onAudiosChange={setAudios}
                />

                {/* Botões de Ação */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditMemorialForm;
