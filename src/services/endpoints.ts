import api from './api';

// Types reflecting minimal fields used in components
export type CatalogoItem = {
  _id: string;
  nome: string;
  categoria?: string;
  precoVenda?: number;
  custoProducao?: number;
  descricao?: string;
};

export const CatalogoAPI = {
  list: async () => {
    const { data } = await api.get<CatalogoItem[]>('/catalogo');
    return data;
  },
  create: async (payload: Partial<CatalogoItem> & { precoVenda?: number; custoProducao?: number }) => {
    const { data } = await api.post<CatalogoItem>('/catalogo', payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await api.delete(`/catalogo/${id}`);
    return data;
  },
};

export type Insumo = {
  _id: string;
  nome: string;
  unidade: string;
  estoque: number;
  categoria?: string;
};

export const InsumosAPI = {
  list: async () => {
    const { data } = await api.get<Insumo[]>('/insumos');
    return data;
  },
  create: async (payload: { nome: string; unidade: string; estoqueInicial?: number; categoria?: string }) => {
    const { data } = await api.post<Insumo>('/insumos', payload);
    return data;
  },
  patchEstoque: async (id: string, quantidade: number) => {
    const { data } = await api.patch(`/insumos/${id}/estoque`, { quantidade });
    return data as { _id: string; estoque: number };
  },
  remove: async (id: string) => {
    const { data } = await api.delete(`/insumos/${id}`);
    return data;
  },
};

export type Encomenda = {
  _id: string;
  cliente?: { nome?: string } | string;
  itens?: Array<{ produto: string; quantidade: number; precoUnitarioSnapshot?: number }>;
  valorTotal?: number;
  status?: string;
  createdAt?: string;
};

export const EncomendasAPI = {
  list: async (params?: { page?: number; limit?: number; status?: string }) => {
    const { data } = await api.get<Encomenda[]>('/encomendas', { params });
    return data;
  },
  create: async (payload: any) => {
    const { data } = await api.post<Encomenda>('/encomendas', payload);
    return data;
  },
  updateStatus: async (id: string, status: string) => {
    const { data } = await api.put(`/encomendas/${id}/status`, { status });
    return data as { _id: string; status: string };
  },
};

export type Balanco = {
  receitaTotal?: number;
  pedidosHoje?: number;
  topProdutos?: Array<{ produtoId: string; nome: string; quantidadeVendida: number; receitaGerada?: number }>;
};

export const BalancoAPI = {
  get: async () => {
    const { data } = await api.get<Balanco>('/balanco');
    return data;
  },
};

export const RelatoriosAPI = {
  gerar: async (
    tipo: 'vendas' | 'produtos' | 'estoque',
    inicio: string,
    fim: string,
    salvar?: boolean
  ) => {
    const { data } = await api.get('/relatorios/gerar', {
      params: { tipo, inicio, fim, salvar },
    });
    return data as any;
  },
};
