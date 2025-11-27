import React, { useState, useEffect } from 'react';
import { LayoutDashboard, TrendingUp, Map, Sparkles, Menu, X, ShoppingBag, Target } from 'lucide-react';
import { AppView } from './types';
import Dashboard from './components/Dashboard';
import MarketAnalysis from './components/MarketAnalysis';
import Roadmap from './components/Roadmap';
import AIAdvisor from './components/AIAdvisor';
import CRM from './components/CRM';
import Gamification from './components/Gamification';

const App: React.FC = () => {
  // Initialize from localStorage if available
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const savedView = localStorage.getItem('vinted_current_view');
    return (savedView as AppView) || AppView.DASHBOARD;
  });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Save view to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vinted_current_view', currentView);
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.MARKET_DATA:
        return <MarketAnalysis />;
      case AppView.ROADMAP:
        return <Roadmap />;
      case AppView.AI_ADVISOR:
        return <AIAdvisor />;
      case AppView.CRM:
        return <CRM />;
      case AppView.GAMIFICATION:
        return <Gamification />;
      default:
        return <Dashboard />;
    }
  };

  const NavButton = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all ${
        currentView === view
          ? 'bg-teal-600 text-white shadow-md font-medium'
          : 'text-slate-400 hover:bg-slate-700 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex font-sans text-slate-100">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-800 border-r border-slate-700 p-6 fixed h-full z-10">
        <div className="flex items-center gap-2 mb-10 px-2">
            <div className="bg-teal-600 text-white p-1.5 rounded-lg">
                <TrendingUp size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white leading-none">VintedPro</h1>
                <span className="text-xs text-slate-400 font-medium">0 a 10k Challenge</span>
            </div>
        </div>
        
        <nav className="space-y-2 flex-1">
          <NavButton view={AppView.DASHBOARD} icon={LayoutDashboard} label="Visão Geral" />
          <NavButton view={AppView.GAMIFICATION} icon={Target} label="Missões Diárias" />
          <NavButton view={AppView.CRM} icon={ShoppingBag} label="Gestão de Estoque" />
          <NavButton view={AppView.MARKET_DATA} icon={TrendingUp} label="Análise de Mercado" />
          <NavButton view={AppView.ROADMAP} icon={Map} label="Estratégia 30 Dias" />
          <NavButton view={AppView.AI_ADVISOR} icon={Sparkles} label="Consultor IA" />
        </nav>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 mt-auto">
            <p className="text-xs text-slate-400 leading-relaxed">
                "O lucro é feito na compra, não na venda."
            </p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-slate-800 z-20 border-b border-slate-700 px-4 py-3 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
            <div className="bg-teal-600 text-white p-1.5 rounded-lg">
                <TrendingUp size={20} />
            </div>
            <span className="font-bold text-white">VintedPro</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-300 p-2">
            {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-800 z-10 pt-20 px-6">
            <nav className="space-y-2">
                <NavButton view={AppView.DASHBOARD} icon={LayoutDashboard} label="Visão Geral" />
                <NavButton view={AppView.GAMIFICATION} icon={Target} label="Missões Diárias" />
                <NavButton view={AppView.CRM} icon={ShoppingBag} label="Gestão de Estoque" />
                <NavButton view={AppView.MARKET_DATA} icon={TrendingUp} label="Análise de Mercado" />
                <NavButton view={AppView.ROADMAP} icon={Map} label="Estratégia 30 Dias" />
                <NavButton view={AppView.AI_ADVISOR} icon={Sparkles} label="Consultor IA" />
            </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 min-h-screen">
        <div className="max-w-6xl mx-auto h-full">
            {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;