import { Package, BookOpen, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function Dashboard() {
  const stats = [
    {
      title: 'Encomendas Ativas',
      value: '12',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+3 hoje',
    },
    {
      title: 'Itens no Catálogo',
      value: '28',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '5 novos',
    },
    {
      title: 'Insumos Cadastrados',
      value: '45',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '8 em falta',
    },
    {
      title: 'Vendas do Mês',
      value: 'R$ 8.450',
      icon: TrendingUp,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      change: '+15%',
    },
  ];

  const recentOrders = [
    { id: '#001', cliente: 'Maria Silva', produto: 'Bolo de Chocolate', status: 'pendente', valor: 'R$ 120,00' },
    { id: '#002', cliente: 'João Santos', produto: 'Torta de Morango', status: 'em_producao', valor: 'R$ 85,00' },
    { id: '#003', cliente: 'Ana Costa', produto: 'Cupcakes', status: 'concluida', valor: 'R$ 45,00' },
  ];

  const lowStock = [
    { nome: 'Farinha de Trigo', estoque: '2 kg', nivel: 'critico' },
    { nome: 'Açúcar', estoque: '3 kg', nivel: 'baixo' },
    { nome: 'Manteiga', estoque: '500g', nivel: 'baixo' },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      pendente: 'bg-yellow-100 text-yellow-800',
      em_producao: 'bg-blue-100 text-blue-800',
      concluida: 'bg-green-100 text-green-800',
    };
    const labels = {
      pendente: 'Pendente',
      em_producao: 'Em Produção',
      concluida: 'Concluída',
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="p-4 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <div className="flex items-end justify-between">
                  <p className="text-gray-900">{stat.value}</p>
                  <span className="text-xs text-gray-500">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alertas de Estoque Baixo */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <CardTitle>Alertas de Estoque</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {lowStock.map((item) => (
            <div
              key={item.nome}
              className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
            >
              <div>
                <p className="text-gray-900">{item.nome}</p>
                <p className="text-sm text-gray-600">Estoque: {item.estoque}</p>
              </div>
              <Badge className={item.nivel === 'critico' ? 'bg-red-500' : 'bg-orange-500'}>
                {item.nivel === 'critico' ? 'Crítico' : 'Baixo'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Encomendas Recentes */}
      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <CardTitle>Encomendas Recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="p-3 bg-gray-50 rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{order.id}</span>
                {getStatusBadge(order.status)}
              </div>
              <div>
                <p className="text-gray-900">{order.cliente}</p>
                <p className="text-sm text-gray-600">{order.produto}</p>
              </div>
              <p className="text-pink-600">{order.valor}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
