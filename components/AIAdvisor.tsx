import React, { useState } from 'react';
import { generateGeminiResponse } from '../services/gemini';
import { Sparkles, Send, Loader2, Copy } from 'lucide-react';

const AIAdvisor: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'strategy' | 'listing'>('strategy');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse('');
    
    try {
      let finalPrompt = '';
      if (mode === 'strategy') {
        finalPrompt = `Atue como um especialista em vendas no Vinted. O usuário tem a seguinte dúvida ou situação específica: "${prompt}". Forneça uma resposta curta, estratégica e focada em lucro/velocidade de venda. Responda em Português.`;
      } else {
        finalPrompt = `Atue como um especialista em SEO para Vinted. Melhore a seguinte descrição de produto para maximizar a visibilidade e vendas: "${prompt}". Inclua: 1. Título otimizado, 2. Descrição persuasiva (com medidas se não tiver), 3. Hashtags relevantes, 4. Preço sugerido (se houver info suficiente). Responda em Português.`;
      }

      const result = await generateGeminiResponse(finalPrompt);
      setResponse(result);
    } catch (error) {
      setResponse('Erro ao conectar com o consultor. Verifique sua chave API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in h-full">
      {/* Input Section */}
      <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700 flex flex-col h-full">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-purple-500 fill-purple-900/20" />
            Consultor IA Vinted
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Use a inteligência artificial para otimizar suas listagens ou tirar dúvidas de negociação.
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setMode('strategy')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'strategy' ? 'bg-slate-900 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
          >
            Estratégia & Dúvidas
          </button>
          <button 
            onClick={() => setMode('listing')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'listing' ? 'bg-slate-900 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
          >
            Gerador de Listagem
          </button>
        </div>

        <textarea
          className="w-full flex-1 p-4 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none text-slate-200 placeholder-slate-500"
          placeholder={mode === 'strategy' ? "Ex: Achei um lote de 10 camisas Ralph Lauren por 100€. Vale a pena? Como vender rápido?" : "Ex: Tênis Nike Air Force 1 branco usado tamanho 42, um pouco sujo na sola mas sem rasgos..."}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:shadow-none"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
            {loading ? 'Analisando...' : 'Gerar Resposta'}
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col h-full relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Sparkles size={120} className="text-white" />
        </div>
        
        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
          Resultado da Análise
        </h3>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {response ? (
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="whitespace-pre-wrap font-light text-slate-200 leading-relaxed">
                {response}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
              <Sparkles size={48} className="mb-4" />
              <p className="text-center text-sm">A resposta do especialista aparecerá aqui.</p>
            </div>
          )}
        </div>

        {response && (
            <button 
                onClick={() => navigator.clipboard.writeText(response)}
                className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Copiar"
            >
                <Copy size={16} />
            </button>
        )}
      </div>
    </div>
  );
};

export default AIAdvisor;