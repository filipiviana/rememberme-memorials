
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Calendar } from 'lucide-react';
import { Tribute } from '@/hooks/useTributes';

interface TributeCardProps {
  tribute: Tribute;
  onLike: (tributeId: string) => void;
}

const TributeCard = ({ tribute, onLike }: TributeCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-gray-900">{tribute.author_name}</h4>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(tribute.created_at)}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(tribute.id)}
            className="flex items-center gap-1 text-gray-500 hover:text-red-500"
          >
            <Heart className="h-4 w-4" />
            <span className="text-sm">{tribute.likes_count}</span>
          </Button>
        </div>

        <p className="text-gray-700 mb-3 leading-relaxed">
          {tribute.message}
        </p>

        {tribute.image_url && (
          <div className="mt-3">
            <img
              src={tribute.image_url}
              alt="Foto da homenagem"
              className="w-full max-w-sm h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TributeCard;
