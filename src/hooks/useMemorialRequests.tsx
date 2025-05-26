
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AudioFile } from '@/types/memorial';

export interface MemorialRequest {
  id: string;
  name: string;
  birth_date: string;
  death_date: string;
  tribute: string | null;
  biography: string | null;
  profile_photo_url: string | null;
  cover_photo_url: string | null;
  photos: string[];
  videos: string[];
  audios: AudioFile[];
  requester_name: string;
  requester_email: string;
  requester_phone: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  created_at: string;
  updated_at: string;
  notes: string | null;
}

export const useMemorialRequests = () => {
  const [requests, setRequests] = useState<MemorialRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('memorial_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching memorial requests:', error);
      toast({
        title: "Erro ao carregar solicitações",
        description: "Não foi possível carregar as solicitações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: MemorialRequest['status'], notes?: string) => {
    try {
      const { error } = await supabase
        .from('memorial_requests')
        .update({ status, notes })
        .eq('id', id);

      if (error) throw error;

      setRequests(prev => 
        prev.map(request => 
          request.id === id 
            ? { ...request, status, notes: notes || request.notes }
            : request
        )
      );

      toast({
        title: "Status atualizado",
        description: `Solicitação ${status === 'approved' ? 'aprovada' : status === 'rejected' ? 'rejeitada' : 'atualizada'} com sucesso`,
      });

      return { error: null };
    } catch (error) {
      console.error('Error updating request status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da solicitação",
        variant: "destructive",
      });
      return { error: 'Failed to update status' };
    }
  };

  const approveRequest = async (request: MemorialRequest) => {
    try {
      // First, update the request status to approved
      const { error: statusError } = await updateRequestStatus(request.id, 'approved');
      if (statusError) return { error: statusError };

      // Generate slug for the memorial
      const { data: slugData, error: slugError } = await supabase
        .rpc('generate_unique_slug', { name_text: request.name });

      if (slugError) throw slugError;

      // Create the memorial
      const { data: memorial, error: memorialError } = await supabase
        .from('memorials')
        .insert({
          name: request.name,
          birth_date: request.birth_date,
          death_date: request.death_date,
          tribute: request.tribute,
          biography: request.biography,
          profile_photo_url: request.profile_photo_url,
          cover_photo_url: request.cover_photo_url,
          slug: slugData,
          is_published: false // Not published by default, admin can publish later
        })
        .select()
        .single();

      if (memorialError) throw memorialError;

      // Add photos to memorial_photos table
      if (request.photos.length > 0) {
        const photosData = request.photos.map(photoUrl => ({
          memorial_id: memorial.id,
          photo_url: photoUrl
        }));

        const { error: photosError } = await supabase
          .from('memorial_photos')
          .insert(photosData);

        if (photosError) console.error('Error adding photos:', photosError);
      }

      // Add videos to memorial_videos table
      if (request.videos.length > 0) {
        const videosData = request.videos.map(videoUrl => ({
          memorial_id: memorial.id,
          video_url: videoUrl
        }));

        const { error: videosError } = await supabase
          .from('memorial_videos')
          .insert(videosData);

        if (videosError) console.error('Error adding videos:', videosError);
      }

      // Add audios to memorial_audios table
      if (request.audios.length > 0) {
        const audiosData = request.audios.map(audio => ({
          memorial_id: memorial.id,
          audio_url: audio.url,
          audio_title: audio.title,
          duration: audio.duration
        }));

        const { error: audiosError } = await supabase
          .from('memorial_audios')
          .insert(audiosData);

        if (audiosError) console.error('Error adding audios:', audiosError);
      }

      toast({
        title: "Memorial criado com sucesso!",
        description: `O memorial de ${request.name} foi criado e está disponível para publicação.`,
      });

      return { error: null, memorial };
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Erro ao aprovar solicitação",
        description: "Não foi possível criar o memorial",
        variant: "destructive",
      });
      return { error: 'Failed to approve request' };
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('memorial_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRequests(prev => prev.filter(request => request.id !== id));

      toast({
        title: "Solicitação excluída",
        description: "A solicitação foi removida com sucesso",
      });

      return { error: null };
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Erro ao excluir solicitação",
        description: "Não foi possível excluir a solicitação",
        variant: "destructive",
      });
      return { error: 'Failed to delete request' };
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    fetchRequests,
    updateRequestStatus,
    approveRequest,
    deleteRequest
  };
};
