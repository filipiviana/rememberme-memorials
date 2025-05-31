
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAppSettings } from './useAppSettings';

export interface Tribute {
  id: string;
  memorial_id: string;
  author_name: string;
  message: string;
  image_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  likes_count: number;
  created_at: string;
}

export const useTributes = (memorialId?: string) => {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useAppSettings();

  const fetchTributes = async () => {
    if (!memorialId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('memorial_tributes')
        .select('*')
        .eq('memorial_id', memorialId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion para garantir que o status está correto
      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected'
      }));
      
      setTributes(typedData);
    } catch (error) {
      console.error('Error fetching tributes:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitTribute = async (tribute: {
    author_name: string;
    message: string;
    image_url?: string;
  }) => {
    if (!memorialId) return { error: 'Memorial ID not provided' };

    try {
      // Determinar status baseado na configuração de moderação
      const status = settings.moderation_enabled ? 'pending' : 'approved';
      
      const { data, error } = await supabase
        .from('memorial_tributes')
        .insert({
          memorial_id: memorialId,
          author_name: tribute.author_name,
          message: tribute.message,
          image_url: tribute.image_url || null,
          status: status
        })
        .select()
        .single();

      if (error) throw error;

      // Type assertion para garantir que o status está correto
      const typedData = {
        ...data,
        status: data.status as 'pending' | 'approved' | 'rejected'
      };

      // Só adicionar à lista se foi aprovado automaticamente
      if (status === 'approved') {
        setTributes(prev => [typedData, ...prev]);
      }
      
      toast({
        title: settings.moderation_enabled ? "Homenagem enviada para moderação!" : "Homenagem enviada!",
        description: settings.moderation_enabled 
          ? "Sua mensagem será analisada antes de ser publicada."
          : "Sua mensagem foi publicada com sucesso.",
      });

      return { error: null };
    } catch (error) {
      console.error('Error submitting tribute:', error);
      toast({
        title: "Erro ao enviar homenagem",
        description: "Não foi possível enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
      return { error: 'Failed to submit tribute' };
    }
  };

  const likeTribute = async (tributeId: string) => {
    try {
      // Insert like (will fail silently if already liked from same IP)
      await supabase
        .from('memorial_tribute_likes')
        .insert({ tribute_id: tributeId });

      // Get current tribute to increment likes_count
      const { data: currentTribute, error: fetchError } = await supabase
        .from('memorial_tributes')
        .select('likes_count')
        .eq('id', tributeId)
        .single();

      if (fetchError) throw fetchError;

      // Update tribute likes count
      const { error } = await supabase
        .from('memorial_tributes')
        .update({ 
          likes_count: currentTribute.likes_count + 1
        })
        .eq('id', tributeId);

      if (error) throw error;

      // Update local state
      setTributes(prev => 
        prev.map(tribute => 
          tribute.id === tributeId 
            ? { ...tribute, likes_count: tribute.likes_count + 1 }
            : tribute
        )
      );
    } catch (error) {
      // Silently fail for duplicate likes
      console.log('Like already exists or error:', error);
    }
  };

  useEffect(() => {
    fetchTributes();
  }, [memorialId]);

  return {
    tributes,
    loading,
    submitTribute,
    likeTribute,
    fetchTributes
  };
};
