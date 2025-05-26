
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Edit, Trash2, QrCode, Users, Calendar, Heart, Globe, Lock, ClipboardList } from 'lucide-react';
import MemorialLogo from './MemorialLogo';
import CreateMemorialForm from './CreateMemorialForm';
import EditMemorialForm from './EditMemorialForm';
import QRCodeModal from './QRCodeModal';
import MemorialRequestsManager from './MemorialRequestsManager';
import { Memorial } from '../types/memorial';
import { useAuth } from '@/hooks/useAuth';
import { useMemorials } from '@/hooks/useMemorials';
import { useStats } from '@/hooks/useStats';
import { useQRCode } from '@/hooks/useQRCode';
import { useMemorialRequests } from '@/hooks/useMemorialRequests';
import { toast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  onViewMemorial: (memorial: Memorial) => void;
}

const AdminDashboard = ({ onViewMemorial }: AdminDashboardProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMemorial, setEditingMemorial] = useState<Memorial | null>(null);
  const [selectedMemorialForQR, setSelectedMemorialForQR] = useState<Memorial | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { signOut } = useAuth();
  const { memorials, loading, createMemorial, updateMemorial, deleteMemorial, togglePublishMemorial } = useMemorials();
  const { stats, loading: statsLoading } = useStats();
  const { generateQRCode, loading: qrLoading } = useQRCode();
  const { requests } = useMemorialRequests();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  const handleCreateMemorial = async (memorial: Memorial) => {
    const { error } = await createMemorial(memorial);
    if (error) {
      toast({
        title: "Erro ao criar memorial",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Memorial criado com sucesso!",
        description: `O memorial de ${memorial.name} foi criado e está disponível.`,
      });
      setShowCreateForm(false);
    }
  };

  const handleUpdateMemorial = async (memorial: Memorial) => {
    const { error } = await updateMemorial(memorial);
    if (error) {
      toast({
        title: "Erro ao atualizar memorial",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Memorial atualizado com sucesso!",
        description: `O memorial de ${memorial.name} foi atualizado.`,
      });
      setEditingMemorial(null);
    }
  };

  const handleDeleteMemorial = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este memorial?')) return;
    
    const { error } = await deleteMemorial(id);
    if (error) {
      toast({
        title: "Erro ao excluir memorial",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Memorial excluído",
        description: "O memorial foi removido com sucesso",
      });
    }
  };

  const handleTogglePublish = async (memorial: Memorial) => {
    const newStatus = !memorial.isPublished;
    await togglePublishMemorial(memorial.id, newStatus);
  };

  const handleGenerateQRCode = async (memorial: Memorial) => {
    if (!memorial.qr_code_url) {
      const qrUrl = await generateQRCode(memorial.slug, memorial.id);
      if (qrUrl) {
        const updatedMemorial = { ...memorial, qr_code_url: qrUrl };
        setSelectedMemorialForQR(updatedMemorial);
      }
    } else {
      setSelectedMemorialForQR(memorial);
    }
  };

  const handleViewPublicMemorial = (memorial: Memorial) => {
    if (memorial.isPublished) {
      window.open(`https://rememberme.com.br/${memorial.slug}`, '_blank');
    } else {
      toast({
        title: "Memorial não publicado",
        description: "Este memorial precisa ser publicado antes de ser visualizado publicamente",
        variant: "destructive",
      });
    }
  };

  if (showCreateForm) {
    return (
      <CreateMemorialForm
        onSubmit={handleCreateMemorial}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  if (editingMemorial) {
    return (
      <EditMemorialForm
        memorial={editingMemorial}
        onSubmit={handleUpdateMemorial}
        onCancel={() => setEditingMemorial(null)}
      />
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'in_review');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <MemorialLogo />
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Administrador</span>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="requests" className="relative">
              Solicitações
              {pendingRequests.length > 0 && (
                <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs bg-red-500">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total de Memoriais</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {statsLoading ? '...' : stats.totalMemorials}
                      </p>
                    </div>
                    <Heart className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Visitantes Este Mês</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {statsLoading ? '...' : stats.visitsThisMonth}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Criados Este Mês</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {statsLoading ? '...' : stats.memorialsThisMonth}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Solicitações Pendentes</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {pendingRequests.length}
                      </p>
                    </div>
                    <ClipboardList className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Memorials List */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Memoriais Criados</CardTitle>
                    <CardDescription>
                      Gerencie todos os memoriais criados na plataforma
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Memorial
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Carregando memoriais...</div>
                ) : memorials.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum memorial encontrado. Crie o primeiro!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {memorials.map((memorial) => (
                      <div key={memorial.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <img
                            src={memorial.profilePhoto || 'https://images.unsplash.com/photo-1494790108755-2616b612b788?w=400'}
                            alt={memorial.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{memorial.name}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(memorial.birthDate).toLocaleDateString('pt-BR')} - {new Date(memorial.deathDate).toLocaleDateString('pt-BR')}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary">rememberme.com.br/{memorial.slug}</Badge>
                              {memorial.qr_code_url && (
                                <Badge variant="outline" className="text-green-600">QR Code</Badge>
                              )}
                              <div className="flex items-center space-x-2">
                                {memorial.isPublished ? (
                                  <Badge variant="default" className="bg-green-600">
                                    <Globe className="h-3 w-3 mr-1" />
                                    Online
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary">
                                    <Lock className="h-3 w-3 mr-1" />
                                    Offline
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {/* Publication Toggle */}
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {memorial.isPublished ? 'Online' : 'Offline'}
                            </span>
                            <Switch
                              checked={memorial.isPublished}
                              onCheckedChange={() => handleTogglePublish(memorial)}
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewMemorial(memorial)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            {memorial.isPublished && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewPublicMemorial(memorial)}
                              >
                                <Globe className="h-4 w-4 mr-1" />
                                Público
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleGenerateQRCode(memorial)}
                              disabled={qrLoading}
                            >
                              <QrCode className="h-4 w-4 mr-1" />
                              QR Code
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingMemorial(memorial)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteMemorial(memorial.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <MemorialRequestsManager />
          </TabsContent>
        </Tabs>
      </main>

      {/* QR Code Modal */}
      {selectedMemorialForQR && (
        <QRCodeModal
          memorial={selectedMemorialForQR}
          isOpen={!!selectedMemorialForQR}
          onClose={() => setSelectedMemorialForQR(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
