
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Memorial } from '@/types/memorial';

export const usePublicMemorial = (slug: string) => {
  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicMemorial = async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('memorials')
        .select(`
          *,
          memorial_photos(photo_url),
          memorial_videos(video_url),
          memorial_audios(audio_url, audio_title, duration)
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setError('Memorial não encontrado ou não está publicado');
        } else {
          throw fetchError;
        }
        return;
      }

      const formattedMemorial: Memorial = {
        id: data.id,
        name: data.name,
        birthDate: data.birth_date,
        deathDate: data.death_date,
        tribute: data.tribute || '',
        biography: data.biography || '',
        profilePhoto: data.profile_photo_url || '',
        coverPhoto: data.cover_photo_url || '',
        photos: data.memorial_photos?.map((p: any) => p.photo_url) || [],
        videos: data.memorial_videos?.map((v: any) => v.video_url) || [],
        audios: data.memorial_audios?.map((a: any) => ({
          url: a.audio_url,
          title: a.audio_title || 'Sem título',
          duration: a.duration
        })) || [],
        featuredVideo: data.featured_video_url || undefined,
        slug: data.slug,
        qr_code_url: data.qr_code_url,
        isPublished: data.is_published,
        createdAt: data.created_at.split('T')[0]
      };

      setMemorial(formattedMemorial);

      // Track visit
      await trackVisit(data.id);
    } catch (error: any) {
      setError(error.message);
      console.error('Error fetching public memorial:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackVisit = async (memorialId: string) => {
    try {
      await supabase
        .from('memorial_visits')
        .insert({
          memorial_id: memorialId,
          ip_address: null // Could be implemented with IP detection if needed
        });
    } catch (error) {
      console.log('Error tracking visit:', error);
      // Don't throw error for visit tracking failure
    }
  };

  useEffect(() => {
    fetchPublicMemorial();
  }, [slug]);

  return {
    memorial,
    loading,
    error,
    refetch: fetchPublicMemorial
  };
};
