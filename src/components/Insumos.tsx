import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { InsumosAPI } from '../services/endpoints';

interface Insumo {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
  estoqueMinimo: number;
  categoria: string;
}

export function Insumos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null);

  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    quantidade: '',
    unidade: 'kg',
    valorUnitario: '',
    estoqueMinimo: '',
    categoria: '',
  });

  const [adjustAmount, setAdjustAmount] = useState('');

  useEffect(() => {
    const fetchInsumos = async () => {
      try {
        setLoading(true);
        const data = await InsumosAPI.list();
        const mapped: Insumo[] = data.map((d: any) => ({
          id: d._id,
          nome: d.nome,
          quantidade: d.estoque ?? 0,
          unidade: d.unidade ?? 'und',
          valorUnitario: 0,
          estoqueMinimo: 0,
          categoria: d.categoria ?? '',
        }));
        setInsumos(mapped);
      } catch (e) {
        console.error('Falha ao carregar insumos', e);
        setError('Falha ao carregar insumos');
      } finally {
        setLoading(false);
      }
    };
    fetchInsumos();
  }, []);

  const filteredInsumos = insumos.filter((insumo) =>
    insumo.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInsumo = async () => {
    try {
      const created = await InsumosAPI.create({
        nome: formData.nome,
        unidade: formData.unidade,
        estoqueInicial: formData.quantidade ? parseFloat(formData.quantidade) : undefined,
        categoria: formData.categoria || undefined,
      });
      const newInsumo: Insumo = {
        id: created._id,
        nome: created.nome,
        quantidade: (created as any).estoque ?? (formData.quantidade ? parseFloat(formData.quantidade) : 0),
        unidade: created.unidade,
        valorUnitario: formData.valorUnitario ? parseFloat(formData.valorUnitario) : 0,
        estoqueMinimo: formData.estoqueMinimo ? parseFloat(formData.estoqueMinimo) : 0,
        categoria: created.categoria ?? formData.categoria,
      };
      setInsumos((prev) => [newInsumo, ...prev]);
      setDialogOpen(false);
      setFormData({ nome: '', quantidade: '', unidade: 'kg', valorUnitario: '', estoqueMinimo: '', categoria: '' });
    } catch (e) {
      console.error('Falha ao criar insumo', e);
      setError('Falha ao criar insumo');
    }
  };

  const handleAdjustStock = async (type: 'increase' | 'decrease') => {
    if (selectedInsumo && adjustAmount) {
      try {
        const amount = parseFloat(adjustAmount) * (type === 'decrease' ? -1 : 1);
        const updated = await InsumosAPI.patchEstoque(selectedInsumo.id, amount);
        setInsumos((prev) => prev.map((i) => (i.id === selectedInsumo.id ? { ...i, quantidade: updated.estoque } : i)));
      } catch (e) {
        console.error('Falha ao ajustar estoque', e);
        setError('Falha ao ajustar estoque');
      } finally {
        setAdjustDialogOpen(false);
        setAdjustAmount('');
        setSelectedInsumo(null);
      }
    }
  };

  const handleDeleteInsumo = async (id: string) => {
    try {
      await InsumosAPI.remove(id);
      setInsumos((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      console.error('Falha ao remover insumo', e);
      setError('Falha ao remover insumo');
    }
  };

  const getStockStatus = (insumo: Insumo) => {
    if (insumo.quantidade === 0) return { label: 'Esgotado', className: 'bg-red-500' };
    if (insumo.quantidade <= insumo.estoqueMinimo) return { label: 'Baixo', className: 'bg-orange-500' };
    return { label: 'OK', className: 'bg-green-500' };
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header Actions */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar insumo..."
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
              <DialogTitle>Criar Novo Insumo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome do Insumo</Label>
                <Input
                  placeholder="Ex: Farinha de Trigo"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Select value={formData.unidade} onValueChange={(value: any) => setFormData({ ...formData, unidade: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="l">l</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="und">und</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Input
                  placeholder="Ex: Farinha, Açúcar..."
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Valor Unitário (R$)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.valorUnitario}
                    onChange={(e) => setFormData({ ...formData, valorUnitario: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estoque Mínimo</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.estoqueMinimo}
                    onChange={(e) => setFormData({ ...formData, estoqueMinimo: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleCreateInsumo} className="w-full bg-pink-600 hover:bg-pink-700">
                Criar Insumo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Insumos List */}
      <div className="space-y-3">
        {filteredInsumos.map((insumo) => {
          const status = getStockStatus(insumo);
          return (
            <Card key={insumo.id} className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900">{insumo.nome}</p>
                      <Badge className={status.className}>{status.label}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{insumo.categoria}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedInsumo(insumo);
                        setAdjustDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteInsumo(insumo.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">Estoque</p>
                    <p className="text-gray-900">{insumo.quantidade} {insumo.unidade}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">Valor Unit.</p>
                    <p className="text-gray-900">R$ {insumo.valorUnitario.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">Mínimo</p>
                    <p className="text-gray-900">{insumo.estoqueMinimo} {insumo.unidade}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Adjust Stock Dialog */}
      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar Estoque</DialogTitle>
          </DialogHeader>
          {selectedInsumo && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{selectedInsumo.nome}</p>
                <p className="text-sm text-gray-600">
                  Estoque atual: {selectedInsumo.quantidade} {selectedInsumo.unidade}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Quantidade a ajustar</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleAdjustStock('increase')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Aumentar
                </Button>
                <Button
                  onClick={() => handleAdjustStock('decrease')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Diminuir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
