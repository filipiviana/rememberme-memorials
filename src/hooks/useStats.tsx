
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalMemorials: number;
  totalVisits: number;
  visitsThisMonth: number;
  memorialsThisMonth: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalMemorials: 0,
    totalVisits: 0,
    visitsThisMonth: 0,
    memorialsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .rpc('get_memorial_stats');

      if (error) throw error;

      if (data && data.length > 0) {
        const statsData = data[0];
        setStats({
          totalMemorials: Number(statsData.total_memorials) || 0,
          totalVisits: Number(statsData.total_visits) || 0,
          visitsThisMonth: Number(statsData.visits_this_month) || 0,
          memorialsThisMonth: Number(statsData.memorials_this_month) || 0
        });
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refetch: fetchStats };
};
