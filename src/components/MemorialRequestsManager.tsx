
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  User,
  Clock
} from 'lucide-react';
import { useMemorialRequests, MemorialRequest } from '@/hooks/useMemorialRequests';
import { toast } from '@/hooks/use-toast';

const MemorialRequestsManager = () => {
  const { requests, loading, updateRequestStatus, approveRequest, deleteRequest } = useMemorialRequests();
  const [selectedRequest, setSelectedRequest] = useState<MemorialRequest | null>(null);
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleApprove = async (request: MemorialRequest) => {
    setActionLoading(request.id);
    const { error } = await approveRequest(request);
    setActionLoading(null);
    
    if (!error) {
      setSelectedRequest(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setActionLoading(requestId);
    await updateRequestStatus(requestId, 'rejected', notes);
    setActionLoading(null);
    setNotes('');
  };

  const handleDelete = async (requestId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta solicitação?')) return;
    
    setActionLoading(requestId);
    await deleteRequest(requestId);
    setActionLoading(null);
  };

  const getStatusBadge = (status: MemorialRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'in_review':
        return <Badge variant="default">Em Análise</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-600 text-white">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'in_review');
  const processedRequests = requests.filter(r => r.status === 'approved' || r.status === 'rejected');

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 mt-2">Carregando solicitações...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Solicitações de Memorial</h2>
          <p className="text-gray-600">Gerencie as solicitações de criação de memoriais</p>
        </div>
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{pendingRequests.length}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{requests.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pendentes ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="processed">
            Processadas ({processedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma solicitação pendente
                </h3>
                <p className="text-gray-600">
                  Todas as solicitações foram processadas!
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(request.birth_date)} - {formatDate(request.death_date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{request.requester_name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{request.requester_email}</span>
                        </div>
                        {request.requester_phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{request.requester_phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Enviado em {formatDate(request.created_at)}</span>
                        </div>
                      </div>

                      {request.tribute && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm italic text-gray-700">"{request.tribute}"</p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Detalhes da Solicitação</DialogTitle>
                            <DialogDescription>
                              Revise todas as informações antes de aprovar
                            </DialogDescription>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Nome</Label>
                                  <p className="font-medium">{selectedRequest.name}</p>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                                </div>
                                <div>
                                  <Label>Data de Nascimento</Label>
                                  <p>{formatDate(selectedRequest.birth_date)}</p>
                                </div>
                                <div>
                                  <Label>Data de Falecimento</Label>
                                  <p>{formatDate(selectedRequest.death_date)}</p>
                                </div>
                              </div>

                              {selectedRequest.tribute && (
                                <div>
                                  <Label>Homenagem</Label>
                                  <p className="mt-1 italic">"{selectedRequest.tribute}"</p>
                                </div>
                              )}

                              {selectedRequest.biography && (
                                <div>
                                  <Label>Biografia</Label>
                                  <p className="mt-1 text-sm">{selectedRequest.biography}</p>
                                </div>
                              )}

                              <div className="border-t pt-4">
                                <h4 className="font-medium mb-2">Informações de Contato</h4>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                  <p><strong>Nome:</strong> {selectedRequest.requester_name}</p>
                                  <p><strong>Email:</strong> {selectedRequest.requester_email}</p>
                                  {selectedRequest.requester_phone && (
                                    <p><strong>Telefone:</strong> {selectedRequest.requester_phone}</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex space-x-2 pt-4">
                                <Button 
                                  onClick={() => handleApprove(selectedRequest)}
                                  disabled={actionLoading === selectedRequest.id}
                                  className="flex-1"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  {actionLoading === selectedRequest.id ? 'Aprovando...' : 'Aprovar'}
                                </Button>
                                
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="destructive" className="flex-1">
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Rejeitar
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Rejeitar Solicitação</DialogTitle>
                                      <DialogDescription>
                                        Adicione uma observação sobre o motivo da rejeição
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="notes">Observações</Label>
                                        <Textarea
                                          id="notes"
                                          value={notes}
                                          onChange={(e) => setNotes(e.target.value)}
                                          placeholder="Motivo da rejeição..."
                                          rows={3}
                                        />
                                      </div>
                                      <div className="flex space-x-2">
                                        <Button
                                          variant="destructive"
                                          onClick={() => handleReject(selectedRequest.id)}
                                          disabled={actionLoading === selectedRequest.id}
                                          className="flex-1"
                                        >
                                          {actionLoading === selectedRequest.id ? 'Rejeitando...' : 'Confirmar Rejeição'}
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(request.id)}
                        disabled={actionLoading === request.id}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="processed" className="space-y-4">
          {processedRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">Nenhuma solicitação processada ainda.</p>
              </CardContent>
            </Card>
          ) : (
            processedRequests.map((request) => (
              <Card key={request.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{request.name}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span>Solicitante: {request.requester_name}</span>
                        <span className="mx-2">•</span>
                        <span>Processado em {formatDate(request.updated_at)}</span>
                      </div>
                      {request.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          Observação: {request.notes}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(request.id)}
                      disabled={actionLoading === request.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MemorialRequestsManager;
