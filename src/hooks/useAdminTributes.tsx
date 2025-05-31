
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Tribute } from './useTributes';

export const useAdminTributes = () => {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchAllTributes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('memorial_tributes')
        .select(`
          *,
          memorials(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected',
        memorial_name: item.memorials?.name || 'Memorial não encontrado'
      }));

      setTributes(typedData);
      
      // Count pending tributes
      const pending = typedData.filter(t => t.status === 'pending').length;
      setPendingCount(pending);
      
    } catch (error) {
      console.error('Error fetching admin tributes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTributeStatus = async (tributeId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('memorial_tributes')
        .update({ status: newStatus })
        .eq('id', tributeId);

      if (error) throw error;

      // Update local state
      setTributes(prev => 
        prev.map(tribute => 
          tribute.id === tributeId 
            ? { ...tribute, status: newStatus }
            : tribute
        )
      );

      // Update pending count
      setPendingCount(prev => {
        const tribute = tributes.find(t => t.id === tributeId);
        if (tribute?.status === 'pending') {
          return prev - 1;
        }
        return prev;
      });

      toast({
        title: newStatus === 'approved' ? "Homenagem aprovada!" : "Homenagem rejeitada!",
        description: `A homenagem foi ${newStatus === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso.`,
      });

    } catch (error) {
      console.error('Error updating tribute status:', error);
      toast({
        title: "Erro ao atualizar homenagem",
        description: "Não foi possível atualizar o status da homenagem.",
        variant: "destructive",
      });
    }
  };

  const bulkUpdateTributes = async (tributeIds: string[], newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('memorial_tributes')
        .update({ status: newStatus })
        .in('id', tributeIds);

      if (error) throw error;

      // Update local state
      setTributes(prev => 
        prev.map(tribute => 
          tributeIds.includes(tribute.id)
            ? { ...tribute, status: newStatus }
            : tribute
        )
      );

      // Update pending count
      const updatedPendingTributes = tributes.filter(t => 
        tributeIds.includes(t.id) && t.status === 'pending'
      ).length;
      setPendingCount(prev => prev - updatedPendingTributes);

      toast({
        title: `${tributeIds.length} homenagens ${newStatus === 'approved' ? 'aprovadas' : 'rejeitadas'}!`,
        description: `As homenagens foram ${newStatus === 'approved' ? 'aprovadas' : 'rejeitadas'} com sucesso.`,
      });

    } catch (error) {
      console.error('Error bulk updating tributes:', error);
      toast({
        title: "Erro ao atualizar homenagens",
        description: "Não foi possível atualizar as homenagens selecionadas.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAllTributes();
  }, []);

  return {
    tributes,
    loading,
    pendingCount,
    updateTributeStatus,
    bulkUpdateTributes,
    refetch: fetchAllTributes
  };
};
