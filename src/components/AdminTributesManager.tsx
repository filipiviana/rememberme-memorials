
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, MessageCircle, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import { useAdminTributes } from '@/hooks/useAdminTributes';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Switch } from '@/components/ui/switch';
import { Tribute } from '@/hooks/useTributes';

const AdminTributesManager = () => {
  const { tributes, loading, pendingCount, updateTributeStatus, bulkUpdateTributes } = useAdminTributes();
  const { settings, updateSetting } = useAppSettings();
  const [selectedTributes, setSelectedTributes] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredTributes = tributes.filter(tribute => {
    if (filterStatus === 'all') return true;
    return tribute.status === filterStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Aprovada</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejeitada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const toggleTributeSelection = (tributeId: string) => {
    setSelectedTributes(prev => 
      prev.includes(tributeId) 
        ? prev.filter(id => id !== tributeId)
        : [...prev, tributeId]
    );
  };

  const handleBulkAction = (action: 'approved' | 'rejected') => {
    if (selectedTributes.length > 0) {
      bulkUpdateTributes(selectedTributes, action);
      setSelectedTributes([]);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando homenagens...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Gerenciar Homenagens
            {pendingCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingCount} pendentes
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.moderation_enabled}
                onCheckedChange={(checked) => updateSetting('moderation_enabled', checked)}
              />
              <label className="text-sm font-medium">
                Moderação ativada
              </label>
            </div>
            <p className="text-sm text-gray-600">
              {settings.moderation_enabled 
                ? 'Homenagens precisam de aprovação antes de serem publicadas'
                : 'Homenagens são publicadas automaticamente'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Bulk Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            {/* Filters */}
            <Tabs value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
              <TabsList>
                <TabsTrigger value="all">Todas ({tributes.length})</TabsTrigger>
                <TabsTrigger value="pending">
                  Pendentes ({tributes.filter(t => t.status === 'pending').length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Aprovadas ({tributes.filter(t => t.status === 'approved').length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejeitadas ({tributes.filter(t => t.status === 'rejected').length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Bulk Actions */}
            {selectedTributes.length > 0 && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-green-600 border-green-300 hover:bg-green-50"
                  onClick={() => handleBulkAction('approved')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Aprovar ({selectedTributes.length})
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => handleBulkAction('rejected')}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Rejeitar ({selectedTributes.length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tributes List */}
      <div className="space-y-4">
        {filteredTributes.length > 0 ? (
          filteredTributes.map((tribute) => (
            <Card key={tribute.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedTributes.includes(tribute.id)}
                    onCheckedChange={() => toggleTributeSelection(tribute.id)}
                  />
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{tribute.author_name}</h4>
                        <p className="text-sm text-gray-500">
                          Memorial: {(tribute as any).memorial_name} • {formatDate(tribute.created_at)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(tribute.status)}
                        <div className="flex items-center text-sm text-gray-500">
                          <Heart className="h-3 w-3 mr-1" />
                          {tribute.likes_count}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {tribute.message}
                    </p>

                    {tribute.image_url && (
                      <div className="mb-3">
                        <img
                          src={tribute.image_url}
                          alt="Imagem da homenagem"
                          className="w-full max-w-sm h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {tribute.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-300 hover:bg-green-50"
                          onClick={() => updateTributeStatus(tribute.id, 'approved')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => updateTributeStatus(tribute.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeitar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {filterStatus === 'all' 
                  ? 'Nenhuma homenagem encontrada'
                  : `Nenhuma homenagem ${filterStatus === 'pending' ? 'pendente' : filterStatus === 'approved' ? 'aprovada' : 'rejeitada'} encontrada`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminTributesManager;
