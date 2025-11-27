import React, { useEffect, useState } from 'react';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { TrendingUp, DollarSign, Package, Activity, ListChecks, Trophy } from 'lucide-react';
import { InventoryItem, Expense, GameState } from '../types';

const projectionData = [
  { name: 'Dia 1', amount: 0 },
  { name: 'Dia 5', amount: 200 },
  { name: 'Dia 10', amount: 800 },
  { name: 'Dia 15', amount: 2500 },
  { name: 'Dia 20', amount: 4800 },
  { name: 'Dia 25', amount: 7500 },
  { name: 'Dia 30', amount: 10000 },
];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    invested: 0,
    profit: 0,
    itemsCount: 0,
    tasksCompletedPercent: 0
  });

  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    // 1. Fetch CRM Data (Inventory)
    const savedItems = localStorage.getItem('vinted_inventory');
    const savedExpenses = localStorage.getItem('vinted_expenses');
    
    let totalInvested = 0;
    let grossProfit = 0;
    let totalExpenses = 0;
    let count = 0;

    // Calculate Sales Profit
    if (savedItems) {
      const items: InventoryItem[] = JSON.parse(savedItems);
      count = items.length;
      totalInvested = items.reduce((acc, item) => acc + item.buyPrice, 0);
      
      const soldItems = items.filter(i => i.status === 'sold');
      const soldRevenue = soldItems.reduce((acc, item) => acc + item.sellPrice, 0);
      const soldCost = soldItems.reduce((acc, item) => acc + item.buyPrice + (item.extraCosts || 0), 0);
      grossProfit = soldRevenue - soldCost;
    }

    // Calculate Operational Expenses
    if (savedExpenses) {
        const expenses: Expense[] = JSON.parse(savedExpenses);
        totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    }

    // Net Profit = Sales Profit - Operational Expenses
    const netProfit = grossProfit - totalExpenses;

    // 2. Fetch Roadmap Progress
    const savedProgress = localStorage.getItem('vinted_roadmap_progress');
    let progressPercent = 0;
    if (savedProgress) {
        const completedTasks: Record<string, boolean> = JSON.parse(savedProgress);
        const completedCount = Object.values(completedTasks).filter(v => v).length;
        progressPercent = Math.min(100, Math.round((completedCount / 28) * 100));
    }

    // 3. Fetch Gamification State
    const savedGamification = localStorage.getItem('vinted_gamification');
    if (savedGamification) {
        setGameState(JSON.parse(savedGamification));
    }

    setStats({
      invested: totalInvested,
      profit: netProfit,
      itemsCount: count,
      tasksCompletedPercent: progressPercent
    });

  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Gamification Summary Card */}
      {gameState && (
          <div className="bg-slate-800 rounded-xl p-4 flex items-center justify-between text-white shadow-md border border-slate-700">
              <div className="flex items-center gap-4">
                  <div className="bg-yellow-500 text-slate-900 p-2 rounded-lg">
                      <Trophy size={24} />
                  </div>
                  <div>
                      <h3 className="font-bold text-lg leading-none">Nível {gameState.level}</h3>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                         <span className="bg-slate-700 rounded-full h-1.5 w-24 block overflow-hidden">
                             <span className="block h-full bg-yellow-400" style={{ width: `${(gameState.currentXP / gameState.xpToNextLevel) * 100}%` }}></span>
                         </span>
                         {gameState.currentXP}/{gameState.xpToNextLevel} XP
                      </div>
                  </div>
              </div>
              <div className="text-right">
                  <div className="text-xs text-slate-400">Missões Hoje</div>
                  <div className="font-bold">{gameState.missions.filter(m => m.completed).length} / {gameState.missions.length}</div>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-400 text-sm font-medium">Meta Final</h3>
            <DollarSign className="text-emerald-500 w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-white">10.000€</div>
          <div className="text-xs text-emerald-400 mt-2 font-medium flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> Objetivo 30 dias
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-400 text-sm font-medium">Lucro Líquido</h3>
            <Activity className={`w-5 h-5 ${stats.profit >= 0 ? 'text-blue-500' : 'text-red-500'}`} />
          </div>
          <div className={`text-3xl font-bold ${stats.profit >= 0 ? 'text-white' : 'text-red-400'}`}>
            {stats.profit >= 0 ? '+' : ''}€{stats.profit.toFixed(0)}
          </div>
          <div className="text-xs text-slate-500 mt-2">Vendas - Custos Extras</div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-400 text-sm font-medium">Itens em Estoque</h3>
            <Package className="text-purple-500 w-5 h-5" />
          </div>
          <div className="text-3xl font-bold text-white">{stats.itemsCount}</div>
          <div className="text-xs text-slate-500 mt-2">Investido: €{stats.invested.toFixed(0)}</div>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-emerald-700 p-6 rounded-xl shadow-sm text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-teal-100 text-sm font-medium">Progresso</h3>
            <ListChecks className="text-white w-5 h-5" />
          </div>
          <div className="text-3xl font-bold">{stats.tasksCompletedPercent}%</div>
          <div className="text-xs text-teal-100 mt-2">Das tarefas concluídas</div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-6">Projeção de Crescimento (Alvo vs Real)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} tickFormatter={(value) => `€${value}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => [`€${value}`, 'Capital Acumulado']}
              />
              <Area type="monotone" dataKey="amount" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-amber-900/20 rounded-lg border border-amber-900/30 text-amber-200 text-sm">
          <strong>Aviso de Risco:</strong> Esta curva assume reinvestimento total (100%) dos lucros nas primeiras 3 semanas e uma taxa de sucesso nas vendas de 80%. O gargalo real será o tempo de envio e recebimento do saldo.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;