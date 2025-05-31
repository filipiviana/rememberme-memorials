
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AppSettings {
  moderation_enabled: boolean;
  autoplay_enabled: boolean;
}

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>({
    moderation_enabled: false,
    autoplay_enabled: true
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['moderation_enabled', 'autoplay_enabled']);

      if (error) throw error;

      const settingsMap: Partial<AppSettings> = {};
      data?.forEach(item => {
        settingsMap[item.setting_key as keyof AppSettings] = item.setting_value as boolean;
      });

      setSettings(prev => ({ ...prev, ...settingsMap }));
    } catch (error) {
      console.error('Error fetching app settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof AppSettings, value: boolean) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          setting_key: key,
          setting_value: value
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSetting,
    refetch: fetchSettings
  };
};
