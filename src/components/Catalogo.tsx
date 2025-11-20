import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface Receita {
  insumoId: string;
  insumoNome: string;
  quantidade: number;
  unidade: string;
}

interface ItemCatalogo {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  tempoPreparo: number;
  categoria: string;
  receita: Receita[];
}

export function Catalogo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemCatalogo | null>(null);

  const [catalogo, setCatalogo] = useState<ItemCatalogo[]>([
    {
      id: '1',
      nome: 'Bolo de Chocolate',
      descricao: 'Delicioso bolo de chocolate com cobertura',
      preco: 120.00,
      tempoPreparo: 90,
      categoria: 'Bolos',
      receita: [
        { insumoId: '1', insumoNome: 'Farinha de Trigo', quantidade: 0.5, unidade: 'kg' },
        { insumoId: '2', insumoNome: 'Açúcar Refinado', quantidade: 0.3, unidade: 'kg' },
        { insumoId: '5', insumoNome: 'Chocolate em Pó', quantidade: 0.2, unidade: 'kg' },
        { insumoId: '4', insumoNome: 'Ovos', quantidade: 4, unidade: 'und' },
      ],
    },
    {
      id: '2',
      nome: 'Torta de Morango',
      descricao: 'Torta cremosa com morangos frescos',
      preco: 85.00,
      tempoPreparo: 120,
      categoria: 'Tortas',
      receita: [
        { insumoId: '1', insumoNome: 'Farinha de Trigo', quantidade: 0.3, unidade: 'kg' },
        { insumoId: '3', insumoNome: 'Manteiga', quantidade: 0.2, unidade: 'kg' },
        { insumoId: '6', insumoNome: 'Leite Condensado', quantidade: 2, unidade: 'und' },
      ],
    },
    {
      id: '3',
      nome: 'Cupcakes Variados',
      descricao: 'Kit com 12 cupcakes de sabores variados',
      preco: 45.00,
      tempoPreparo: 60,
      categoria: 'Cupcakes',
      receita: [
        { insumoId: '1', insumoNome: 'Farinha de Trigo', quantidade: 0.25, unidade: 'kg' },
        { insumoId: '2', insumoNome: 'Açúcar Refinado', quantidade: 0.2, unidade: 'kg' },
        { insumoId: '4', insumoNome: 'Ovos', quantidade: 3, unidade: 'und' },
      ],
    },
  ]);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    tempoPreparo: '',
    categoria: '',
  });

  const filteredCatalogo = catalogo.filter((item) =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateItem = () => {
    const newItem: ItemCatalogo = {
      id: Date.now().toString(),
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
      tempoPreparo: parseInt(formData.tempoPreparo),
      categoria: formData.categoria,
      receita: [],
    };
    setCatalogo([...catalogo, newItem]);
    setDialogOpen(false);
    setFormData({ nome: '', descricao: '', preco: '', tempoPreparo: '', categoria: '' });
  };

  const handleDeleteItem = (id: string) => {
    setCatalogo(catalogo.filter(item => item.id !== id));
  };

  const calcularCustoProducao = (receita: Receita[]) => {
    // Valores simulados dos insumos
    const precos: { [key: string]: number } = {
      '1': 5.50, '2': 4.20, '3': 28.00, '4': 0.60, '5': 22.00, '6': 6.50
    };
    
    return receita.reduce((total, item) => {
      const preco = precos[item.insumoId] || 0;
      return total + (preco * item.quantidade);
    }, 0);
  };

  const calcularMargem = (preco: number, custo: number) => {
    return ((preco - custo) / preco * 100).toFixed(1);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header Actions */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar no catálogo..."
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
              <DialogTitle>Criar Item no Catálogo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome do Produto</Label>
                <Input
                  placeholder="Ex: Bolo de Chocolate"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  placeholder="Descreva o produto..."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Input
                  placeholder="Ex: Bolos, Tortas..."
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Preço (R$)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tempo (min)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.tempoPreparo}
                    onChange={(e) => setFormData({ ...formData, tempoPreparo: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleCreateItem} className="w-full bg-pink-600 hover:bg-pink-700">
                Criar Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Catalogo List */}
      <div className="space-y-3">
        {filteredCatalogo.map((item) => {
          const custo = calcularCustoProducao(item.receita);
          const margem = calcularMargem(item.preco, custo);
          
          return (
            <Card key={item.id} className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900">{item.nome}</p>
                      <Badge className="bg-purple-100 text-purple-800">
                        {item.categoria}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.descricao}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedItem(item);
                        setViewDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="bg-green-50 p-2 rounded">
                    <p className="text-gray-600">Preço</p>
                    <p className="text-green-700">R$ {item.preco.toFixed(2)}</p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-gray-600">Custo</p>
                    <p className="text-blue-700">R$ {custo.toFixed(2)}</p>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <p className="text-gray-600">Margem</p>
                    <p className="text-purple-700">{margem}%</p>
                  </div>
                  <div className="bg-orange-50 p-2 rounded">
                    <p className="text-gray-600">Tempo</p>
                    <p className="text-orange-700">{item.tempoPreparo}min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View Recipe Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-[90vw] md:max-w-md">
          <DialogHeader>
            <DialogTitle>Receita do Produto</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{selectedItem.nome}</p>
                <p className="text-sm text-gray-600">{selectedItem.descricao}</p>
              </div>
              <div>
                <Label className="mb-2 block">Insumos Necessários</Label>
                <div className="space-y-2">
                  {selectedItem.receita.length > 0 ? (
                    selectedItem.receita.map((receita, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-gray-900">{receita.insumoNome}</span>
                        <span className="text-gray-600">
                          {receita.quantidade} {receita.unidade}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Nenhum insumo cadastrado na receita
                    </p>
                  )}
                </div>
              </div>
              <div className="p-3 bg-pink-50 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Custo de Produção:</span>
                  <span className="text-gray-900">
                    R$ {calcularCustoProducao(selectedItem.receita).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Preço de Venda:</span>
                  <span className="text-gray-900">R$ {selectedItem.preco.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margem de Lucro:</span>
                  <span className="text-pink-600">
                    {calcularMargem(selectedItem.preco, calcularCustoProducao(selectedItem.receita))}%
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
