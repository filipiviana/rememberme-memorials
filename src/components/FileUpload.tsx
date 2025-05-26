
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, File, Image, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept: string;
  maxSize?: number;
  label: string;
  currentFile?: string;
  multiple?: boolean;
  onMultipleUpload?: (urls: string[]) => void;
}

const FileUpload = ({ 
  onUpload, 
  accept, 
  maxSize = 5 * 1024 * 1024, // 5MB default
  label,
  currentFile,
  multiple = false,
  onMultipleUpload
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('audio/')) return <Music className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log('Uploading file:', fileName, 'to bucket: memorial-files');

    const { error: uploadError } = await supabase.storage
      .from('memorial-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error details:', uploadError);
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from('memorial-files')
      .getPublicUrl(filePath);

    console.log('File uploaded successfully, public URL:', data.publicUrl);
    return data.publicUrl;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    console.log('Files selected:', files.length, 'Multiple mode:', multiple);

    // Validate file sizes
    for (const file of Array.from(files)) {
      if (file.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: `O arquivo ${file.name} excede o limite de ${Math.round(maxSize / (1024 * 1024))}MB`,
          variant: "destructive",
        });
        return;
      }
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // CORREÇÃO: Se multiple=true, sempre usar onMultipleUpload, independente da quantidade
      if (multiple) {
        console.log('Using multiple upload mode for', files.length, 'file(s)');
        const urls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          console.log(`Uploading file ${i + 1} of ${files.length}: ${files[i].name}`);
          const url = await uploadFile(files[i]);
          urls.push(url);
          setUploadProgress(((i + 1) / files.length) * 100);
        }
        
        console.log('All files uploaded, calling onMultipleUpload with URLs:', urls);
        onMultipleUpload?.(urls);
        
        toast({
          title: "Upload concluído",
          description: `${files.length} arquivo(s) enviado(s) com sucesso`,
        });
      } else {
        console.log(`Uploading single file: ${files[0].name}`);
        const url = await uploadFile(files[0]);
        setUploadProgress(100);
        onUpload(url);
        toast({
          title: "Upload concluído",
          description: "Arquivo enviado com sucesso",
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Erro ao enviar arquivo. Verifique se o arquivo é válido e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset input value so the same file can be uploaded again if needed
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
        {currentFile && !multiple && (
          <div className="mb-2">
            <img
              src={currentFile}
              alt="Preview"
              className="max-w-32 max-h-32 mx-auto rounded object-cover"
            />
          </div>
        )}
        
        <Input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          multiple={multiple}
          className="hidden"
          id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
        />
        
        <Label
          htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="cursor-pointer"
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-600">
              {uploading ? `Enviando... ${uploadProgress.toFixed(0)}%` : 'Clique para selecionar arquivo'}
            </span>
            <span className="text-xs text-gray-400">
              {accept.includes('image') && `Imagens até ${Math.round(maxSize / (1024 * 1024))}MB`}
              {accept.includes('audio') && `Áudios até ${Math.round(maxSize / (1024 * 1024))}MB`}
              {accept.includes('video') && `Vídeos até ${Math.round(maxSize / (1024 * 1024))}MB`}
            </span>
          </div>
        </Label>

        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
