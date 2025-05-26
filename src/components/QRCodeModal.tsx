
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Printer, QrCode } from 'lucide-react';
import { useQRCode } from '@/hooks/useQRCode';
import { Memorial } from '@/types/memorial';

interface QRCodeModalProps {
  memorial: Memorial;
  isOpen: boolean;
  onClose: () => void;
}

const QRCodeModal = ({ memorial, isOpen, onClose }: QRCodeModalProps) => {
  const { downloadQRCode } = useQRCode();

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && memorial.qr_code_url) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Code - ${memorial.name}</title>
            <style>
              body {
                margin: 0;
                padding: 40px;
                font-family: Arial, sans-serif;
                text-align: center;
                background: white;
              }
              .qr-container {
                max-width: 400px;
                margin: 0 auto;
                padding: 20px;
                border: 2px solid #000;
                border-radius: 8px;
              }
              .qr-image {
                width: 100%;
                max-width: 300px;
                height: auto;
                margin: 20px 0;
              }
              .memorial-info {
                margin-top: 20px;
                font-size: 16px;
                color: #333;
              }
              .memorial-name {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .memorial-url {
                font-size: 14px;
                color: #666;
                word-break: break-all;
              }
              @media print {
                body { margin: 0; padding: 20px; }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h1>Memorial QR Code</h1>
              <img src="${memorial.qr_code_url}" alt="QR Code" class="qr-image" />
              <div class="memorial-info">
                <div class="memorial-name">${memorial.name}</div>
                <div class="memorial-url">memorialize.com/${memorial.slug}</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code - {memorial.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          {memorial.qr_code_url ? (
            <>
              <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                <img
                  src={memorial.qr_code_url}
                  alt="QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>
              
              <div className="text-center text-sm text-gray-600">
                <p className="font-medium">{memorial.name}</p>
                <p>memorialize.com/{memorial.slug}</p>
              </div>
              
              <div className="flex gap-2 w-full">
                <Button
                  onClick={() => downloadQRCode(memorial.qr_code_url!, memorial.name)}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="flex-1"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">QR Code não disponível</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
