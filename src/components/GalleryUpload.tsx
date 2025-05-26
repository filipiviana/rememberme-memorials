
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Upload } from 'lucide-react';
import FileUpload from './FileUpload';

interface GalleryUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
}

const GalleryUpload = ({ photos, onPhotosChange }: GalleryUploadProps) => {
  const handleAddPhotos = (newUrls: string[]) => {
    onPhotosChange([...photos, ...newUrls]);
  };

  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(updatedPhotos);
  };

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
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryUpload;
