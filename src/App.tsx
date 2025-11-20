import { useState } from 'react';
import { Home, Package, BookOpen, ShoppingCart, BarChart3 } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Insumos } from './components/Insumos';
import { Catalogo } from './components/Catalogo';
import { Encomendas } from './components/Encomendas';
import { Relatorios } from './components/Relatorios';

type TabType = 'dashboard' | 'insumos' | 'catalogo' | 'encomendas' | 'relatorios';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'insumos', label: 'Insumos', icon: Package },
    { id: 'catalogo', label: 'Catálogo', icon: BookOpen },
    { id: 'encomendas', label: 'Encomendas', icon: ShoppingCart },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-center text-pink-600">🧁 Gestão de Confeitaria</h1>
        </div>
      </header>

      {/* Content */}
      <main className="pb-20">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'insumos' && <Insumos />}
        {activeTab === 'catalogo' && <Catalogo />}
        {activeTab === 'encomendas' && <Encomendas />}
        {activeTab === 'relatorios' && <Relatorios />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive
                    ? 'text-pink-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
