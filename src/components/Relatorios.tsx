import { useState } from 'react';
import { TrendingUp, DollarSign, Package, ShoppingBag, Calendar, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

export function Relatorios() {
  const [periodo, setPeriodo] = useState('mes_atual');
  const [tipoRelatorio, setTipoRelatorio] = useState('vendas');

  // Dados simulados de vendas por mês
  const vendasPorMes = {
    mes_atual: {
      totalVendas: 8450.00,
      custos: 3200.00,
      lucro: 5250.00,
      encomendasTotal: 42,
      encomendasConcluidas: 35,
      ticketMedio: 201.19,
    },
    mes_anterior: {
      totalVendas: 7300.00,
      custos: 2800.00,
      lucro: 4500.00,
      encomendasTotal: 38,
      encomendasConcluidas: 32,
      ticketMedio: 192.11,
    },
    ultimos_3_meses: {
      totalVendas: 23800.00,
      custos: 9100.00,
      lucro: 14700.00,
      encomendasTotal: 118,
      encomendasConcluidas: 98,
      ticketMedio: 201.69,
    },
  };

  // Dados de estoque
  const estoqueData = [
    { categoria: 'Farinha', qtdItens: 5, valorTotal: 127.50, status: 'ok' },
    { categoria: 'Açúcar', qtdItens: 4, valorTotal: 84.00, status: 'baixo' },
    { categoria: 'Laticínio', qtdItens: 6, valorTotal: 234.00, status: 'ok' },
    { categoria: 'Chocolate', qtdItens: 3, valorTotal: 166.00, status: 'baixo' },
    { categoria: 'Proteína', qtdItens: 2, valorTotal: 36.00, status: 'critico' },
  ];

  // Produtos mais vendidos
  const produtosMaisVendidos = [
    { nome: 'Bolo de Chocolate', vendas: 18, receita: 2160.00 },
    { nome: 'Torta de Morango', vendas: 12, receita: 1020.00 },
    { nome: 'Cupcakes Variados', vendas: 25, receita: 1125.00 },
    { nome: 'Brownie', vendas: 15, receita: 675.00 },
  ];

  const dados = vendasPorMes[periodo as keyof typeof vendasPorMes];
  const margemLucro = ((dados.lucro / dados.totalVendas) * 100).toFixed(1);

  const getPeriodoLabel = () => {
    const labels = {
      mes_atual: 'Novembro 2025',
      mes_anterior: 'Outubro 2025',
      ultimos_3_meses: 'Últimos 3 Meses',
    };
    return labels[periodo as keyof typeof labels];
  };

  return (
    <div className="p-4 space-y-4">
      {/* Controls */}
      <div className="flex gap-2">
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mes_atual">Mês Atual</SelectItem>
            <SelectItem value="mes_anterior">Mês Anterior</SelectItem>
            <SelectItem value="ultimos_3_meses">Últimos 3 Meses</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vendas">Vendas</SelectItem>
            <SelectItem value="estoque">Estoque</SelectItem>
            <SelectItem value="produtos">Produtos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Header with Period */}
      <Card className="border-none shadow-md bg-gradient-to-br from-pink-500 to-purple-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5" />
            <span>Período Selecionado</span>
          </div>
          <p className="text-2xl">{getPeriodoLabel()}</p>
        </CardContent>
      </Card>

      {/* Vendas Report */}
      {tipoRelatorio === 'vendas' && (
        <>
          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Receita Total</p>
                <p className="text-gray-900">R$ {dados.totalVendas.toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-1">+15% vs anterior</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Lucro Líquido</p>
                <p className="text-gray-900">R$ {dados.lucro.toFixed(2)}</p>
                <p className="text-xs text-blue-600 mt-1">{margemLucro}% de margem</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Custos</p>
                <p className="text-gray-900">R$ {dados.custos.toFixed(2)}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {((dados.custos / dados.totalVendas) * 100).toFixed(1)}% da receita
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">Encomendas</p>
                <p className="text-gray-900">{dados.encomendasConcluidas}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {dados.encomendasTotal} no total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Balance Breakdown */}
          <Card className="border-none shadow-md">
            <CardHeader className="pb-3">
              <CardTitle>Balanço Detalhado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Receita Bruta</span>
                  <span className="text-gray-900">R$ {dados.totalVendas.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Custos de Produção</span>
                  <span className="text-orange-600">- R$ {dados.custos.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${(dados.custos / dados.totalVendas) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">Lucro Líquido</span>
                  <span className="text-green-600">R$ {dados.lucro.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" 
                    style={{ width: `${(dados.lucro / dados.totalVendas) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ticket Médio</span>
                  <span className="text-purple-600">R$ {dados.ticketMedio.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Estoque Report */}
      {tipoRelatorio === 'estoque' && (
        <>
          <Card className="border-none shadow-md">
            <CardHeader className="pb-3">
              <CardTitle>Resumo do Estoque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {estoqueData.map((item) => (
                <div key={item.categoria} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-900">{item.categoria}</span>
                    <Badge 
                      className={
                        item.status === 'ok' ? 'bg-green-500' :
                        item.status === 'baixo' ? 'bg-orange-500' :
                        'bg-red-500'
                      }
                    >
                      {item.status === 'ok' ? 'OK' :
                       item.status === 'baixo' ? 'Baixo' :
                       'Crítico'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.qtdItens} itens</span>
                    <span className="text-gray-900">R$ {item.valorTotal.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              
              <div className="pt-3 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-900">Valor Total em Estoque</span>
                  <span className="text-pink-600">
                    R$ {estoqueData.reduce((sum, item) => sum + item.valorTotal, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader className="pb-3">
              <CardTitle>Alertas de Estoque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {estoqueData.filter(item => item.status !== 'ok').map((item) => (
                <div key={item.categoria} className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900">{item.categoria}</p>
                      <p className="text-sm text-gray-600">{item.qtdItens} itens restantes</p>
                    </div>
                    <Badge className={item.status === 'critico' ? 'bg-red-500' : 'bg-orange-500'}>
                      {item.status === 'critico' ? 'Crítico' : 'Baixo'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {/* Produtos Report */}
      {tipoRelatorio === 'produtos' && (
        <>
          <Card className="border-none shadow-md">
            <CardHeader className="pb-3">
              <CardTitle>Produtos Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {produtosMaisVendidos.map((produto, index) => (
                <div key={produto.nome} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-pink-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <span className="text-gray-900">{produto.nome}</span>
                    </div>
                    <Badge className="bg-purple-500">{produto.vendas} vendas</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Receita gerada</span>
                    <span className="text-green-600">R$ {produto.receita.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-1.5 rounded-full" 
                      style={{ width: `${(produto.vendas / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader className="pb-3">
              <CardTitle>Análise de Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Receita Total dos Top 4</p>
                <p className="text-green-700 text-xl">
                  R$ {produtosMaisVendidos.reduce((sum, p) => sum + p.receita, 0).toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total de Vendas</p>
                <p className="text-blue-700 text-xl">
                  {produtosMaisVendidos.reduce((sum, p) => sum + p.vendas, 0)} unidades
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Export Button */}
      <Button className="w-full bg-pink-600 hover:bg-pink-700">
        <Download className="w-4 h-4 mr-2" />
        Exportar Relatório
      </Button>
    </div>
  );
}
