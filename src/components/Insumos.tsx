import { useState } from 'react';
import { Plus, Search, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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

  const [insumos, setInsumos] = useState<Insumo[]>([
    { id: '1', nome: 'Farinha de Trigo', quantidade: 2, unidade: 'kg', valorUnitario: 5.50, estoqueMinimo: 5, categoria: 'Farinha' },
    { id: '2', nome: 'Açúcar Refinado', quantidade: 3, unidade: 'kg', valorUnitario: 4.20, estoqueMinimo: 5, categoria: 'Açúcar' },
    { id: '3', nome: 'Manteiga', quantidade: 0.5, unidade: 'kg', valorUnitario: 28.00, estoqueMinimo: 1, categoria: 'Laticínio' },
    { id: '4', nome: 'Ovos', quantidade: 30, unidade: 'und', valorUnitario: 0.60, estoqueMinimo: 12, categoria: 'Proteína' },
    { id: '5', nome: 'Chocolate em Pó', quantidade: 1.5, unidade: 'kg', valorUnitario: 22.00, estoqueMinimo: 1, categoria: 'Chocolate' },
    { id: '6', nome: 'Leite Condensado', quantidade: 8, unidade: 'und', valorUnitario: 6.50, estoqueMinimo: 3, categoria: 'Laticínio' },
  ]);

  const [formData, setFormData] = useState({
    nome: '',
    quantidade: '',
    unidade: 'kg',
    valorUnitario: '',
    estoqueMinimo: '',
    categoria: '',
  });

  const [adjustAmount, setAdjustAmount] = useState('');

  const filteredInsumos = insumos.filter((insumo) =>
    insumo.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInsumo = () => {
    const newInsumo: Insumo = {
      id: Date.now().toString(),
      nome: formData.nome,
      quantidade: parseFloat(formData.quantidade),
      unidade: formData.unidade,
      valorUnitario: parseFloat(formData.valorUnitario),
      estoqueMinimo: parseFloat(formData.estoqueMinimo),
      categoria: formData.categoria,
    };
    setInsumos([...insumos, newInsumo]);
    setDialogOpen(false);
    setFormData({ nome: '', quantidade: '', unidade: 'kg', valorUnitario: '', estoqueMinimo: '', categoria: '' });
  };

  const handleAdjustStock = (type: 'increase' | 'decrease') => {
    if (selectedInsumo && adjustAmount) {
      const amount = parseFloat(adjustAmount);
      setInsumos(insumos.map(insumo => 
        insumo.id === selectedInsumo.id
          ? { ...insumo, quantidade: type === 'increase' ? insumo.quantidade + amount : insumo.quantidade - amount }
          : insumo
      ));
      setAdjustDialogOpen(false);
      setAdjustAmount('');
      setSelectedInsumo(null);
    }
  };

  const handleDeleteInsumo = (id: string) => {
    setInsumos(insumos.filter(insumo => insumo.id !== id));
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
