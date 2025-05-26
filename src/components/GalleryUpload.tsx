
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Upload, ZoomIn } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import FileUpload from './FileUpload';

interface GalleryUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

const GalleryUpload = ({ photos, onPhotosChange }: GalleryUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleAddPhotos = (newUrls: string[]) => {
    console.log('GalleryUpload: Received new URLs:', newUrls);
    console.log('GalleryUpload: Current photos:', photos);
    
    const updatedPhotos = [...photos, ...newUrls];
    console.log('GalleryUpload: Updated photos array:', updatedPhotos);
    
    onPhotosChange(updatedPhotos);
  };

  const handleRemovePhoto = (index: number) => {
    console.log('GalleryUpload: Removing photo at index:', index);
    const updatedPhotos = photos.filter((_, i) => i !== index);
    console.log('GalleryUpload: Photos after removal:', updatedPhotos);
    onPhotosChange(updatedPhotos);
  };

  console.log('GalleryUpload: Rendering with photos:', photos);

  return (
    <div className="space-y-4">
      <Label>Galeria de Fotos</Label>
      
      <FileUpload
        label="Adicionar Fotos à Galeria"
        accept="image/*"
        multiple={true}
        onUpload={() => {}} // Not used for multiple
        onMultipleUpload={handleAddPhotos}
      />

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <AspectRatio ratio={1}>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative w-full h-full cursor-pointer">
                      <img
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-full">
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                    />
                  </DialogContent>
                </Dialog>
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X className="h-3 w-3" />
                </button>
              </AspectRatio>
            </div>
          ))}
        </div>
      )}
      
      {photos.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          Nenhuma foto adicionada à galeria ainda.
        </p>
      )}
    </div>
  );
};

export default GalleryUpload;
