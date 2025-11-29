import { useEffect, useState } from 'react';
import { Plus, Search, Eye, X, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { EncomendasAPI } from '../services/endpoints';

interface ItemEncomenda {
  catalogoId: string;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
}

interface Encomenda {
  id: string;
  cliente: string;
  telefone: string;
  dataEntrega: string;
  horarioEntrega: string;
  status: 'pendente' | 'em_producao' | 'pronta' | 'entregue' | 'cancelada';
  itens: ItemEncomenda[];
  observacoes: string;
  valorTotal: number;
}

export function Encomendas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todas');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEncomenda, setSelectedEncomenda] = useState<Encomenda | null>(null);

  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    cliente: '',
    telefone: '',
    dataEntrega: '',
    horarioEntrega: '',
    observacoes: '',
  });

  useEffect(() => {
    const fetchEncomendas = async () => {
      try {
        setLoading(true);
        const data = await EncomendasAPI.list();
        const mapped: Encomenda[] = (Array.isArray(data) ? data : []).map((d: any) => ({
          id: d._id,
          cliente: typeof d.cliente === 'object' ? (d.cliente?.nome || '') : d.cliente,
          telefone: (d as any).telefone || '',
          dataEntrega: (d as any).dataEntrega || (d.createdAt ? new Date(d.createdAt).toISOString().slice(0,10) : ''),
          horarioEntrega: (d as any).horarioEntrega || '',
          status: (d as any).status || 'pendente',
          itens: (d.itens || []).map((i: any) => ({ catalogoId: i.produto, produtoNome: i.nome || '', quantidade: i.quantidade, precoUnitario: i.precoUnitarioSnapshot || 0 })),
          observacoes: (d as any).observacoes || '',
          valorTotal: d.valorTotal || 0,
        }));
        setEncomendas(mapped);
      } catch (e) {
        console.error('Falha ao carregar encomendas', e);
        setError('Falha ao carregar encomendas');
      } finally {
        setLoading(false);
      }
    };
    fetchEncomendas();
  }, []);

  const filteredEncomendas = encomendas.filter((encomenda) => {
    const matchSearch = 
      encomenda.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      encomenda.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'todas' || encomenda.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleCreateEncomenda = () => {
    const newEncomenda: Encomenda = {
      id: `#${(encomendas.length + 1).toString().padStart(3, '0')}`,
      cliente: formData.cliente,
      telefone: formData.telefone,
      dataEntrega: formData.dataEntrega,
      horarioEntrega: formData.horarioEntrega,
      status: 'pendente',
      itens: [],
      observacoes: formData.observacoes,
      valorTotal: 0,
    };
    setEncomendas([newEncomenda, ...encomendas]);
    setDialogOpen(false);
    setFormData({ cliente: '', telefone: '', dataEntrega: '', horarioEntrega: '', observacoes: '' });
  };

  const handleUpdateStatus = async (id: string, newStatus: Encomenda['status']) => {
    try {
      await EncomendasAPI.updateStatus(id, newStatus);
      setEncomendas((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
    } catch (e) {
      console.error('Falha ao atualizar status', e);
      setError('Falha ao atualizar status');
    }
  };

  const handleCancelEncomenda = (id: string) => {
    // Sem endpoint dedicado: mantém cancelamento local
    setEncomendas((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'cancelada' } : e)));
  };

  const getStatusBadge = (status: Encomenda['status']) => {
    const config = {
      pendente: { label: 'Pendente', className: 'bg-yellow-500' },
      em_producao: { label: 'Em Produção', className: 'bg-blue-500' },
      pronta: { label: 'Pronta', className: 'bg-purple-500' },
      entregue: { label: 'Entregue', className: 'bg-green-500' },
      cancelada: { label: 'Cancelada', className: 'bg-gray-500' },
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };

  const formatDate = (date: string) => {
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const statusOptions = [
    { value: 'todas', label: 'Todas' },
    { value: 'pendente', label: 'Pendentes' },
    { value: 'em_producao', label: 'Em Produção' },
    { value: 'pronta', label: 'Prontas' },
    { value: 'entregue', label: 'Entregues' },
    { value: 'cancelada', label: 'Canceladas' },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Header Actions */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar encomenda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pink-600 hover:bg-pink-700 shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] md:max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Encomenda</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nome do Cliente</Label>
                  <Input
                    placeholder="Ex: Maria Silva"
                    value={formData.cliente}
                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    placeholder="(11) 98765-4321"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Data de Entrega</Label>
                    <Input
                      type="date"
                      value={formData.dataEntrega}
                      onChange={(e) => setFormData({ ...formData, dataEntrega: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Horário</Label>
                    <Input
                      type="time"
                      value={formData.horarioEntrega}
                      onChange={(e) => setFormData({ ...formData, horarioEntrega: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea
                    placeholder="Observações sobre a encomenda..."
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreateEncomenda} className="w-full bg-pink-600 hover:bg-pink-700">
                  Criar Encomenda
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              size="sm"
              variant={filterStatus === option.value ? 'default' : 'outline'}
              onClick={() => setFilterStatus(option.value)}
              className={filterStatus === option.value ? 'bg-pink-600 hover:bg-pink-700' : ''}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Encomendas List */}
      <div className="space-y-3">
        {filteredEncomendas.map((encomenda) => (
          <Card key={encomenda.id} className="border-none shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-900">{encomenda.id}</span>
                    {getStatusBadge(encomenda.status)}
                  </div>
                  <p className="text-gray-900">{encomenda.cliente}</p>
                  <p className="text-sm text-gray-600">{encomenda.telefone}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedEncomenda(encomenda);
                    setViewDialogOpen(true);
                  }}
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-blue-50 p-2 rounded flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Entrega</p>
                    <p className="text-sm text-gray-900">{formatDate(encomenda.dataEntrega)}</p>
                  </div>
                </div>
                <div className="bg-purple-50 p-2 rounded flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Horário</p>
                    <p className="text-sm text-gray-900">{encomenda.horarioEntrega}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600">Valor Total</p>
                  <p className="text-pink-600">R$ {encomenda.valorTotal.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Itens</p>
                  <p className="text-gray-900">{encomenda.itens.length}</p>
                </div>
              </div>

              {encomenda.status !== 'entregue' && encomenda.status !== 'cancelada' && (
                <div className="flex gap-2">
                  {encomenda.status === 'pendente' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(encomenda.id, 'em_producao')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Iniciar Produção
                    </Button>
                  )}
                  {encomenda.status === 'em_producao' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(encomenda.id, 'pronta')}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      Marcar como Pronta
                    </Button>
                  )}
                  {encomenda.status === 'pronta' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(encomenda.id, 'entregue')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Marcar como Entregue
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCancelEncomenda(encomenda.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Encomenda Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Encomenda</DialogTitle>
          </DialogHeader>
          {selectedEncomenda && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900">{selectedEncomenda.id}</span>
                  {getStatusBadge(selectedEncomenda.status)}
                </div>
                <p className="text-gray-900">{selectedEncomenda.cliente}</p>
                <p className="text-sm text-gray-600">{selectedEncomenda.telefone}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-blue-50 rounded">
                  <p className="text-sm text-gray-600">Data de Entrega</p>
                  <p className="text-gray-900">{formatDate(selectedEncomenda.dataEntrega)}</p>
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  <p className="text-sm text-gray-600">Horário</p>
                  <p className="text-gray-900">{selectedEncomenda.horarioEntrega}</p>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Itens da Encomenda</Label>
                <div className="space-y-2">
                  {selectedEncomenda.itens.length > 0 ? (
                    selectedEncomenda.itens.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-gray-900">{item.produtoNome}</p>
                          <p className="text-sm text-gray-600">Qtd: {item.quantidade}</p>
                        </div>
                        <p className="text-gray-900">
                          R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Nenhum item adicionado
                    </p>
                  )}
                </div>
              </div>

              {selectedEncomenda.observacoes && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <Label className="mb-1 block">Observações</Label>
                  <p className="text-sm text-gray-700">{selectedEncomenda.observacoes}</p>
                </div>
              )}

              <div className="p-3 bg-pink-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-900">Valor Total</span>
                  <span className="text-pink-600">
                    R$ {selectedEncomenda.valorTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
