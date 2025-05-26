import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Memorial } from '@/types/memorial';

export const useMemorials = () => {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemorials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('memorials')
        .select(`
          *,
          memorial_photos(photo_url),
          memorial_videos(video_url),
          memorial_audios(audio_url, audio_title, duration)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedMemorials: Memorial[] = data?.map(memorial => ({
        id: memorial.id,
        name: memorial.name,
        birthDate: memorial.birth_date,
        deathDate: memorial.death_date,
        tribute: memorial.tribute || '',
        biography: memorial.biography || '',
        profilePhoto: memorial.profile_photo_url || '',
        coverPhoto: memorial.cover_photo_url || '',
        photos: memorial.memorial_photos?.map((p: any) => p.photo_url) || [],
        videos: memorial.memorial_videos?.map((v: any) => v.video_url) || [],
        audios: memorial.memorial_audios?.map((a: any) => ({
          url: a.audio_url,
          title: a.audio_title || 'Sem título',
          duration: a.duration
        })) || [],
        slug: memorial.slug,
        createdAt: memorial.created_at.split('T')[0]
      })) || [];

      setMemorials(formattedMemorials);
    } catch (error: any) {
      setError(error.message);
      console.error('Error fetching memorials:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMemorial = async (memorial: Omit<Memorial, 'id' | 'createdAt'>) => {
    try {
      // Generate unique slug
      const { data: slugData, error: slugError } = await supabase
        .rpc('generate_unique_slug', { name_text: memorial.name });

      if (slugError) throw slugError;

      const { data, error } = await supabase
        .from('memorials')
        .insert({
          name: memorial.name,
          birth_date: memorial.birthDate,
          death_date: memorial.deathDate,
          tribute: memorial.tribute,
          biography: memorial.biography,
          profile_photo_url: memorial.profilePhoto,
          cover_photo_url: memorial.coverPhoto,
          slug: slugData
        })
        .select()
        .single();

      if (error) throw error;

      // Add photos if any
      if (memorial.photos.length > 0) {
        const photoInserts = memorial.photos.map(photo => ({
          memorial_id: data.id,
          photo_url: photo
        }));

        await supabase.from('memorial_photos').insert(photoInserts);
      }

      // Add videos if any
      if (memorial.videos.length > 0) {
        const videoInserts = memorial.videos.map(video => ({
          memorial_id: data.id,
          video_url: video
        }));

        await supabase.from('memorial_videos').insert(videoInserts);
      }

      // Add audios if any
      if (memorial.audios && memorial.audios.length > 0) {
        const audioInserts = memorial.audios.map(audio => ({
          memorial_id: data.id,
          audio_url: audio.url,
          audio_title: audio.title,
          duration: audio.duration
        }));

        await supabase.from('memorial_audios').insert(audioInserts);
      }

      await fetchMemorials();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating memorial:', error);
      return { data: null, error: error.message };
    }
  };

  const deleteMemorial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('memorials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchMemorials();
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting memorial:', error);
      return { error: error.message };
    }
  };

  useEffect(() => {
    fetchMemorials();
  }, []);

  return {
    memorials,
    loading,
    error,
    createMemorial,
    deleteMemorial,
    refetch: fetchMemorials
  };
};
