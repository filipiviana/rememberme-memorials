
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
      setTributes(data || []);
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
      const { data, error } = await supabase
        .from('memorial_tributes')
        .insert({
          memorial_id: memorialId,
          author_name: tribute.author_name,
          message: tribute.message,
          image_url: tribute.image_url || null,
          status: 'approved' // Auto-approve for now
        })
        .select()
        .single();

      if (error) throw error;

      setTributes(prev => [data, ...prev]);
      
      toast({
        title: "Homenagem enviada!",
        description: "Sua mensagem foi publicada com sucesso.",
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

      // Update tribute likes count
      const { error } = await supabase
        .from('memorial_tributes')
        .update({ 
          likes_count: supabase.raw('likes_count + 1')
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
