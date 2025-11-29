
import React, { useState } from 'react';
import { TOP_PRODUCTS, MARKET_TRENDS, VIRAL_PRODUCTS } from '../data';
import { TrendingUp, Zap, Tag, Flame, ArrowUpRight, Search, PlusCircle, Check } from 'lucide-react';
import { InventoryItem, ViralProduct } from '../types';

const MarketAnalysis: React.FC = () => {
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());

  const handleImportToCRM = (product: ViralProduct) => {
    // 1. Get current inventory
    const savedItems = localStorage.getItem('vinted_inventory');
    const currentInventory: InventoryItem[] = savedItems ? JSON.parse(savedItems) : [];

    // 2. Create new item
    const newItem: InventoryItem = {
        id: Date.now().toString(),
        name: product.Nome_Produto_Curto,
        brand: product.Nicho_De_Mercado.split('/')[0].trim(), // Extract generic brand/niche
        buyPrice: product.Estimativa_Custo_BRL, // Using the property as EUR
        sellPrice: product.Estimativa_Venda_BRL, // Using the property as EUR
        status: 'listed',
        dateAdded: new Date().toLocaleDateString('pt-BR')
    };

    // 3. Save
    const updatedInventory = [newItem, ...currentInventory];
    localStorage.setItem('vinted_inventory', JSON.stringify(updatedInventory));

    // 4. UI Feedback
    const newSet = new Set(importedIds);
    newSet.add(product.ID_Interno);
    setImportedIds(newSet);
    
    // Optional: Could trigger a global event or context update here, 
    // but CRM component reads from localStorage on mount, so it works if user navigates away and back.
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Viral Finds Section (AI MODULE) */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl shadow-lg border border-indigo-700/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Flame size={120} className="text-indigo-500" />
        </div>
        <div className="p-6 border-b border-indigo-800/50 flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="text-orange-500 fill-orange-500 animate-pulse" size={20} />
              Oportunidades Virais (Espanha/Europa)
            </h2>
            <p className="text-indigo-200 text-sm mt-1">Detectado pelo Módulo de Inserção de Dados (MID) - Arbitragem AliExpress &gt; Vinted ES</p>
          </div>
          <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full border border-indigo-400 animate-pulse">
            AO VIVO • MADRID
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {VIRAL_PRODUCTS.map((product) => {
                const isImported = importedIds.has(product.ID_Interno);
                return (
                <div key={product.ID_Interno} className="bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-700 p-4 hover:border-indigo-500 transition-all group flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-900/30 px-2 py-0.5 rounded">
                            {product.Nicho_De_Mercado}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Search size={10} />
                            {product.Plataforma_Pico}
                        </div>
                    </div>
                    <h3 className="font-bold text-white text-lg mb-1 group-hover:text-indigo-300 transition-colors">{product.Nome_Produto_Curto}</h3>
                    <p className="text-xs text-slate-400 mb-3 italic flex-1">"{product.Motivo_Principal_Viral}"</p>
                    
                    <div className="bg-slate-900 rounded p-2 mb-3 border border-slate-800">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">Custo (AliExpress)</span>
                            <span className="text-slate-500">Venda (Vinted)</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span className="text-slate-300">€{product.Estimativa_Custo_BRL.toFixed(2)}</span>
                            <span className="text-emerald-400">€{product.Estimativa_Venda_BRL.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div className="text-xs text-indigo-200 bg-indigo-900/20 p-2 rounded border border-indigo-900/30 flex gap-2 mb-3">
                        <ArrowUpRight size={14} className="flex-shrink-0 mt-0.5" />
                        {product.Acao_Estrategica_Recomendada}
                    </div>

                    <button 
                        onClick={() => handleImportToCRM(product)}
                        disabled={isImported}
                        className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                            isImported 
                            ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/50 cursor-default' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-indigo-500/20'
                        }`}
                    >
                        {isImported ? (
                            <>
                                <Check size={14} /> Integrado ao CRM
                            </>
                        ) : (
                            <>
                                <PlusCircle size={14} /> Integrar ao Estoque
                            </>
                        )}
                    </button>
                </div>
            )})}
        </div>
      </div>

      {/* Top Products Section */}
      <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/30">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="text-yellow-500 fill-yellow-500" size={20} />
              Top Produtos Vinted (Alta Rotatividade)
            </h2>
            <p className="text-slate-400 text-sm mt-1">Foque nestes itens para liquidez rápida na plataforma.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900 text-slate-300 font-semibold uppercase text-xs">
              <tr>
                <th className="p-4">Categoria / Marca</th>
                <th className="p-4">Compra (Alvo)</th>
                <th className="p-4">Venda (Média)</th>
                <th className="p-4">Margem</th>
                <th className="p-4">Velocidade</th>
                <th className="p-4">Dica Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {TOP_PRODUCTS.map((product, idx) => (
                <tr key={idx} className="hover:bg-slate-700/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-100">{product.category}</div>
                    <div className="text-slate-500 text-xs">{product.brand}</div>
                  </td>
                  <td className="p-4 text-emerald-400 font-medium">{product.buyPrice}</td>
                  <td className="p-4 text-slate-200">{product.sellPrice}</td>
                  <td className="p-4">
                    <span className="bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded-full text-xs font-bold border border-emerald-900/50">
                      {product.margin}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                      product.velocity === 'Explosiva' 
                      ? 'bg-red-900/30 text-red-400 border-red-900/50' 
                      : 'bg-blue-900/30 text-blue-400 border-blue-900/50'
                    }`}>
                      {product.velocity}
                    </span>
                  </td>
                  <td className="p-4 text-xs italic max-w-xs text-slate-500">{product.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trends Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-500" />
            Tendências Atuais (Trends)
          </h3>
          <div className="space-y-4">
            {MARKET_TRENDS.map((trend, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-700">
                <div className="mt-1"><Tag size={16} className="text-teal-500" /></div>
                <div>
                  <div className="font-bold text-slate-100">{trend.niche}</div>
                  <div className="text-sm text-slate-400">{trend.trend}</div>
                  <div className="text-xs text-slate-500 mt-1">Ticket Médio: {trend.avgTicket}</div>
                  <div className="text-xs text-teal-500 mt-1 font-medium">💡 {trend.tip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-sm p-6 border border-slate-700">
          <h3 className="text-lg font-bold mb-4">Estratégia de Precificação</h3>
          <ul className="space-y-4 text-sm text-slate-300">
            <li className="flex gap-3">
              <span className="bg-teal-600 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white">1</span>
              <div>
                <strong className="text-white">Regra dos 20%:</strong> Sempre liste 20% acima do preço mínimo que você aceita. O comprador do Vinted AMA negociar. Se quer 50€, anuncie por 60€-65€.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-teal-600 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white">2</span>
              <div>
                <strong className="text-white">Psicologia do Frete:</strong> Itens leves (camisetas) vendem mais rápido se o preço for ligeiramente menor para compensar o frete.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-teal-600 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white">3</span>
              <div>
                <strong className="text-white">Bundles Ativos:</strong> Sempre ative o desconto progressivo (10%/15%). Isso aumenta seu ticket médio e economiza tempo de envio.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-teal-600 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white">4</span>
              <div>
                <strong className="text-white">Horário Nobre:</strong> Domingo à noite (20h-22h) e Terça-feira à noite são picos de tráfego. Publique ou dê "UP" nestes horários.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;
