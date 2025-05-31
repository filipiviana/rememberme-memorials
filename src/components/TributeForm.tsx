
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Image, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TributeFormProps {
  onSubmit: (tribute: { author_name: string; message: string; image_url?: string }) => void;
  loading?: boolean;
}

const TributeForm = ({ onSubmit, loading = false }: TributeFormProps) => {
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 5MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('tribute-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('tribute-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload da imagem",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorName.trim() || !message.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome e mensagem",
        variant: "destructive",
      });
      return;
    }

    if (message.length > 500) {
      toast({
        title: "Mensagem muito longa",
        description: "A mensagem deve ter no máximo 500 caracteres",
        variant: "destructive",
      });
      return;
    }

    let imageUrl: string | undefined;

    if (imageFile) {
      imageUrl = await uploadImage(imageFile) || undefined;
    }

    await onSubmit({
      author_name: authorName.trim(),
      message: message.trim(),
      image_url: imageUrl
    });

    // Reset form
    setAuthorName('');
    setMessage('');
    setImageFile(null);
    setImagePreview(null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Deixe sua Homenagem
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="author_name">Seu Nome</Label>
            <Input
              id="author_name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Digite seu nome"
              maxLength={100}
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Sua Mensagem</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Compartilhe uma memória especial, palavras de carinho ou uma homenagem..."
              rows={4}
              maxLength={500}
              required
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {message.length}/500 caracteres
            </div>
          </div>

          <div>
            <Label htmlFor="image">Adicionar Foto (opcional)</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label htmlFor="image" className="cursor-pointer">
                    <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Clique para adicionar uma foto
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || uploading}
          >
            {loading || uploading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {uploading ? 'Enviando imagem...' : 'Enviando...'}
              </div>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Enviar Homenagem
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TributeForm;
