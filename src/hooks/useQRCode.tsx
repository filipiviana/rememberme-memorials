
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode';
import { toast } from '@/hooks/use-toast';

export const useQRCode = () => {
  const [loading, setLoading] = useState(false);

  const generateQRCode = async (memorialSlug: string, memorialId: string) => {
    try {
      setLoading(true);
      
      // Generate QR code as data URL using the correct domain
      const qrCodeUrl = `https://rememberme.com.br/${memorialSlug}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeUrl, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Convert data URL to blob
      const response = await fetch(qrCodeDataURL);
      const blob = await response.blob();
      
      // Upload to Supabase Storage
      const fileName = `${memorialSlug}-qr.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('qr-codes')
        .upload(fileName, blob, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('qr-codes')
        .getPublicUrl(fileName);

      // Update memorial with QR code URL
      const { error: updateError } = await supabase
        .from('memorials')
        .update({ qr_code_url: publicUrl })
        .eq('id', memorialId);

      if (updateError) throw updateError;

      return publicUrl;
    } catch (error: any) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Erro ao gerar QR Code",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = async (qrCodeUrl: string, memorialName: string) => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${memorialName}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "QR Code baixado",
        description: "O QR Code foi baixado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao baixar QR Code",
        description: "Não foi possível baixar o QR Code",
        variant: "destructive",
      });
    }
  };

  return {
    generateQRCode,
    downloadQRCode,
    loading
  };
};
