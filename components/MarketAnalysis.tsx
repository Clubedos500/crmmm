import React from 'react';
import { TOP_PRODUCTS, MARKET_TRENDS } from '../data';
import { TrendingUp, Zap, Tag } from 'lucide-react';

const MarketAnalysis: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Products Section */}
      <div className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/30">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="text-yellow-500 fill-yellow-500" size={20} />
              Top Produtos de Alta Rotatividade
            </h2>
            <p className="text-slate-400 text-sm mt-1">Foque nestes itens para liquidez rápida.</p>
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