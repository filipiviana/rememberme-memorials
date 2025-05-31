
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MessageCircle } from 'lucide-react';
import { useTributes } from '@/hooks/useTributes';
import TributeForm from './TributeForm';
import TributeCard from './TributeCard';

interface TributeWallProps {
  memorialId: string;
  memorialName: string;
}

const TributeWall = ({ memorialId, memorialName }: TributeWallProps) => {
  const { tributes, loading, submitTribute, likeTribute } = useTributes(memorialId);

  return (
    <section id="homenagens" className="mb-16 scroll-mt-32">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            Mural de Homenagens
          </CardTitle>
          <p className="text-gray-600">
            Compartilhe suas memórias e sentimentos sobre {memorialName}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form for new tributes */}
          <TributeForm onSubmit={submitTribute} loading={loading} />

          {/* List of existing tributes */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Homenagens ({tributes.length})
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando homenagens...</p>
              </div>
            ) : tributes.length > 0 ? (
              <div className="space-y-4">
                {tributes.map((tribute) => (
                  <TributeCard
                    key={tribute.id}
                    tribute={tribute}
                    onLike={likeTribute}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Seja o primeiro a deixar uma homenagem
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default TributeWall;
