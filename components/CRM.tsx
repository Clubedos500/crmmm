import React, { useState, useEffect, useRef } from 'react';
import { InventoryItem, Expense } from '../types';
import { Plus, Trash2, CheckCircle, Package, ShoppingBag, Edit2, X, AlertTriangle, Save, Filter, Download, Upload, RefreshCw, Wallet, MinusCircle } from 'lucide-react';

const CRM: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filter, setFilter] = useState<'all' | 'listed' | 'sold' | 'expenses'>('all');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Estados para Modais e Edição
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [sellingItem, setSellingItem] = useState<InventoryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);

  // Ref para input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado temporário para formulários
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    buyPrice: '',
    sellPrice: ''
  });

  const [sellingForm, setSellingForm] = useState({
    sellPrice: '',
    extraCosts: ''
  });

  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category: 'packaging' as Expense['category']
  });

  // Carregar dados
  useEffect(() => {
    const savedItems = localStorage.getItem('vinted_inventory');
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems));
      } catch (e) {
        console.error("Erro ao carregar inventário", e);
      }
    }
    const savedExpenses = localStorage.getItem('vinted_expenses');
    if (savedExpenses) {
        try {
            setExpenses(JSON.parse(savedExpenses));
        } catch (e) {
            console.error("Erro ao carregar despesas", e);
        }
    }
  }, []);

  // Salvar dados
  useEffect(() => {
    if (items.length >= 0) {
        localStorage.setItem('vinted_inventory', JSON.stringify(items));
        setLastSaved(new Date());
    }
  }, [items]);

  useEffect(() => {
      if (expenses.length >= 0) {
          localStorage.setItem('vinted_expenses', JSON.stringify(expenses));
          setLastSaved(new Date());
      }
  }, [expenses]);

  // --- Handlers ---

  const handleOpenAdd = () => {
    setFormData({ name: '', brand: '', buyPrice: '', sellPrice: '' });
    setIsAdding(true);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.buyPrice) return;

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: formData.name,
      brand: formData.brand,
      buyPrice: parseFloat(formData.buyPrice.replace(',', '.')) || 0,
      sellPrice: parseFloat(formData.sellPrice.replace(',', '.')) || 0,
      status: 'listed',
      dateAdded: new Date().toLocaleDateString('pt-BR')
    };

    setItems([newItem, ...items]);
    setIsAdding(false);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
      e.preventDefault();
      if (!expenseForm.description || !expenseForm.amount) return;

      const newExpense: Expense = {
          id: Date.now().toString(),
          description: expenseForm.description,
          amount: parseFloat(expenseForm.amount.replace(',', '.')) || 0,
          category: expenseForm.category,
          date: new Date().toLocaleDateString('pt-BR')
      };

      setExpenses([newExpense, ...expenses]);
      setExpenseForm({ description: '', amount: '', category: 'packaging' });
      setIsAddingExpense(false);
      setFilter('expenses'); // Switch to expenses view to see the new entry
  }

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      brand: item.brand,
      buyPrice: item.buyPrice.toString(),
      sellPrice: item.sellPrice.toString()
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setItems(items.map(item => 
      item.id === editingItem.id 
        ? {
            ...item,
            name: formData.name,
            brand: formData.brand,
            buyPrice: parseFloat(formData.buyPrice.replace(',', '.')) || 0,
            sellPrice: parseFloat(formData.sellPrice.replace(',', '.')) || 0
          }
        : item
    ));
    setEditingItem(null);
  };

  const handleOpenSale = (item: InventoryItem) => {
    if (item.status === 'sold') {
      setItems(items.map(i => i.id === item.id ? { ...i, status: 'listed', dateSold: undefined, extraCosts: undefined } : i));
      return;
    }
    setSellingItem(item);
    setSellingForm({
      sellPrice: item.sellPrice.toString(),
      extraCosts: '0'
    });
  };

  const handleConfirmSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellingItem) return;

    const finalSellPrice = parseFloat(sellingForm.sellPrice.replace(',', '.')) || sellingItem.sellPrice;
    const extraCosts = parseFloat(sellingForm.extraCosts.replace(',', '.')) || 0;

    setItems(items.map(item => 
      item.id === sellingItem.id
        ? {
            ...item,
            status: 'sold',
            sellPrice: finalSellPrice,
            extraCosts: extraCosts,
            dateSold: new Date().toLocaleDateString('pt-BR')
          }
        : item
    ));
    setSellingItem(null);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setItems(items.filter(item => item.id !== deletingId));
      setDeletingId(null);
    }
  };

  const confirmDeleteExpense = () => {
      if (deletingExpenseId) {
          setExpenses(expenses.filter(exp => exp.id !== deletingExpenseId));
          setDeletingExpenseId(null);
      }
  }

  // --- Backup Functions ---
  
  const exportData = () => {
    const backupData = {
        inventory: items,
        expenses: expenses
    };
    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vinted_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        
        // Check if it's the new format (object with inventory/expenses) or old format (array)
        let newItems: InventoryItem[] = [];
        let newExpenses: Expense[] = [];

        if (Array.isArray(parsed)) {
            newItems = parsed; // Legacy support
        } else if (parsed.inventory) {
            newItems = parsed.inventory;
            newExpenses = parsed.expenses || [];
        } else {
            throw new Error("Formato inválido");
        }
            
        if(confirm(`ATENÇÃO: Isso substituirá seu dados atuais. Deseja continuar?`)) {
            setItems(newItems);
            setExpenses(newExpenses);
            alert("Dados restaurados com sucesso!");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo. Certifique-se de que é um JSON válido.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  // --- Calculations ---
  const totalInvested = items.reduce((acc, item) => acc + item.buyPrice, 0);
  
  // Calculate revenue and costs properly considering extraCosts on items
  const soldItems = items.filter(item => item.status === 'sold');
  
  const totalSoldRevenue = soldItems.reduce((acc, item) => acc + item.sellPrice, 0);
  const totalSoldCost = soldItems.reduce((acc, item) => acc + item.buyPrice + (item.extraCosts || 0), 0);
  
  const totalOperationalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);

  const grossProfit = totalSoldRevenue - totalSoldCost;
  const netProfit = grossProfit - totalOperationalExpenses;
  
  const profitMargin = totalSoldRevenue > 0 
    ? ((grossProfit / totalSoldRevenue) * 100).toFixed(1) 
    : '0';

  // Combine and sort items + expenses for the 'all' view
  const getDisplayData = () => {
    if (filter === 'all') {
        const normalizedItems = items.map(i => ({ type: 'item', data: i, date: i.dateAdded, id: i.id }));
        const normalizedExpenses = expenses.map(e => ({ type: 'expense', data: e, date: e.date, id: e.id }));
        return [...normalizedItems, ...normalizedExpenses].sort((a, b) => Number(b.id) - Number(a.id));
    }
    if (filter === 'expenses') return expenses.map(e => ({ type: 'expense', data: e, date: e.date, id: e.id }));
    
    // filtered items
    return items
        .filter(i => i.status === filter)
        .sort((a, b) => Number(b.id) - Number(a.id))
        .map(i => ({ type: 'item', data: i, date: i.dateAdded, id: i.id }));
  };

  const displayData = getDisplayData();

  // Calculate footer total
  const footerTotal = displayData.reduce((acc, row) => {
    if (row.type === 'expense') {
        return acc - (row.data as Expense).amount;
    } else {
        const item = row.data as InventoryItem;
        if (item.status === 'sold') {
            return acc + (item.sellPrice - item.buyPrice - (item.extraCosts || 0));
        }
        return acc;
    }
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="text-teal-500" />
            Gestão & Finanças
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Controle estoque e custos operacionais.</span>
            {lastSaved && (
                <span className="flex items-center text-xs text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-900/50">
                    <CheckCircle size={10} className="mr-1" /> Salvo auto
                </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
            {/* Backup Tools */}
            <div className="flex bg-slate-800 rounded-lg border border-slate-700 shadow-sm overflow-hidden">
                <button 
                    onClick={exportData}
                    className="p-2 text-slate-400 hover:bg-slate-700 hover:text-teal-400 border-r border-slate-700" 
                    title="Fazer Backup (Download)"
                >
                    <Download size={18} />
                </button>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-slate-400 hover:bg-slate-700 hover:text-blue-400" 
                    title="Restaurar Backup"
                >
                    <Upload size={18} />
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".json" 
                    onChange={importData} 
                />
            </div>

            <button 
                onClick={() => setIsAddingExpense(true)}
                className="bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all"
            >
                <MinusCircle size={18} /> Registrar Despesa
            </button>

            <button 
                onClick={handleOpenAdd}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-lg transition-all"
            >
                <Plus size={18} /> Novo Item
            </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Investimento (Estoque)</div>
          <div className="text-xl md:text-2xl font-bold text-white">€{totalInvested.toFixed(2)}</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Custos Operacionais</div>
          <div className="text-xl md:text-2xl font-bold text-amber-500">€{totalOperationalExpenses.toFixed(2)}</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Lucro Líquido Real</div>
          <div className={`text-xl md:text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {netProfit >= 0 ? '+' : ''}€{netProfit.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Lucro Vendas - Despesas</div>
        </div>
        <div className="bg-teal-900/20 p-4 rounded-xl border border-teal-900/30 shadow-sm">
          <div className="text-teal-400 text-[10px] uppercase font-bold tracking-wider">Margem (Vendas)</div>
          <div className="text-xl md:text-2xl font-bold text-teal-400">{profitMargin}%</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-1 overflow-x-auto">
        {(['all', 'listed', 'sold', 'expenses'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              filter === f 
                ? 'bg-slate-800 border border-b-0 border-slate-700 text-teal-400' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {f === 'all' ? 'Todos os Itens' : f === 'listed' ? 'À Venda' : f === 'sold' ? 'Vendidos' : 'Despesas Extras'}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-slate-800 rounded-b-xl rounded-tr-xl border border-slate-700 shadow-sm overflow-hidden min-h-[300px]">
        
        {/* VIEW: EXPENSES TABLE ONLY (When filter is explicitly 'expenses') */}
        {filter === 'expenses' ? (
             <div className="overflow-x-auto">
                {expenses.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                        <Wallet size={48} className="mb-4 opacity-20" />
                        <p>Nenhuma despesa registrada.</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-red-900/20 text-red-400 font-semibold uppercase text-xs">
                        <tr>
                        <th className="p-4">Descrição</th>
                        <th className="p-4">Categoria</th>
                        <th className="p-4">Data</th>
                        <th className="p-4 text-right">Valor</th>
                        <th className="p-4 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {expenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-slate-700/50 transition-colors">
                            <td className="p-4 font-medium text-slate-200">{exp.description}</td>
                            <td className="p-4">
                                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-xs border border-slate-600 capitalize">
                                    {exp.category === 'packaging' ? 'Embalagem' : exp.category === 'marketing' ? 'Marketing/Ads' : exp.category === 'shipping' ? 'Frete' : 'Outros'}
                                </span>
                            </td>
                            <td className="p-4 text-slate-500">{exp.date}</td>
                            <td className="p-4 text-right font-bold text-red-500">- €{exp.amount.toFixed(2)}</td>
                            <td className="p-4 text-center">
                                <button 
                                    onClick={() => setDeletingExpenseId(exp.id)}
                                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                                    title="Excluir Despesa"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                )}
             </div>
        ) : (
            // VIEW: UNIFIED / INVENTORY TABLE
            <div className="overflow-x-auto">
                {displayData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                    <Package size={48} className="mb-4 opacity-20" />
                    <p>Nenhum item encontrado.</p>
                </div>
                ) : (
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-xs">
                    <tr>
                        <th className="p-4">Produto</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-right">Compra</th>
                        <th className="p-4 text-right">Venda</th>
                        <th className="p-4 text-right">Lucro Bruto</th>
                        <th className="p-4 text-center">ROI</th>
                        <th className="p-4 text-center">Ações</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                    {displayData.map((row) => {
                        
                        // RENDER EXPENSE ROW
                        if (row.type === 'expense') {
                            const exp = row.data as Expense;
                            return (
                                <tr key={exp.id} className="bg-red-900/10 hover:bg-red-900/20 transition-colors">
                                    <td className="p-4 font-medium text-slate-300">
                                        {exp.description}
                                        <div className="text-xs text-slate-500 capitalize">{exp.category === 'packaging' ? 'Embalagem' : exp.category === 'marketing' ? 'Marketing' : exp.category === 'shipping' ? 'Frete' : 'Outros'}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-red-900/40 text-red-400">
                                            DESPESA
                                        </span>
                                    </td>
                                    <td className="p-4 text-right text-slate-600">-</td>
                                    <td className="p-4 text-right text-slate-600">-</td>
                                    <td className="p-4 text-right font-bold text-red-400">-€{exp.amount.toFixed(2)}</td>
                                    <td className="p-4 text-center text-slate-600">-</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => setDeletingExpenseId(exp.id)}
                                                className="p-2 bg-slate-700 border border-slate-600 text-slate-400 rounded-lg hover:bg-red-900/30 hover:text-red-400 hover:border-red-900/50 transition-colors shadow-sm"
                                                title="Excluir"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }

                        // RENDER ITEM ROW
                        const item = row.data as InventoryItem;
                        const profit = item.sellPrice - item.buyPrice - (item.extraCosts || 0);
                        const isSold = item.status === 'sold';
                        
                        // ROI CALCULATION
                        const roi = item.buyPrice === 0 
                            ? Infinity 
                            : ((profit) / item.buyPrice) * 100;

                        // ROI BADGE COLOR LOGIC
                        let roiBadge = <span className="text-slate-600">-</span>;
                        if (isSold) {
                            if (roi === Infinity) {
                                roiBadge = (
                                    <div className="inline-flex px-2 py-0.5 rounded-md border border-purple-900/50 bg-purple-900/20 items-center gap-1.5 shadow-sm text-purple-400">
                                        <span className="text-[9px] uppercase tracking-widest opacity-70 border-r border-purple-700 pr-1.5 font-bold">ROI</span>
                                        <span className="text-xs font-extrabold">∞</span>
                                    </div>
                                );
                            } else {
                                let badgeColor = '';
                                let borderColor = '';
                                let textColor = '';
                                let separatorColor = '';
                                
                                if (roi < 30) {
                                    badgeColor = 'bg-yellow-900/20';
                                    borderColor = 'border-yellow-900/30';
                                    textColor = 'text-yellow-500';
                                    separatorColor = 'border-yellow-700';
                                } else if (roi < 100) {
                                    badgeColor = 'bg-blue-900/20';
                                    borderColor = 'border-blue-900/30';
                                    textColor = 'text-blue-400';
                                    separatorColor = 'border-blue-700';
                                } else {
                                    badgeColor = 'bg-emerald-900/20';
                                    borderColor = 'border-emerald-900/30';
                                    textColor = 'text-emerald-400';
                                    separatorColor = 'border-emerald-700';
                                }
                                
                                roiBadge = (
                                    <div className={`inline-flex px-2 py-0.5 rounded-md border items-center gap-1.5 shadow-sm transition-all hover:scale-105 cursor-default ${badgeColor} ${borderColor} ${textColor}`}>
                                        <span className={`text-[9px] uppercase tracking-widest opacity-70 border-r pr-1.5 font-bold ${separatorColor}`}>ROI</span>
                                        <span className="text-xs font-extrabold">{roi > 0 ? '+' : ''}{roi.toFixed(0)}%</span>
                                    </div>
                                );
                            }
                        }

                        return (
                        <tr key={item.id} className={`hover:bg-slate-700/30 transition-colors ${isSold ? 'bg-slate-900/50' : ''}`}>
                            <td className="p-4 max-w-[200px]">
                            <div className={`font-medium truncate ${isSold ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{item.name}</div>
                            <div className="text-xs text-slate-500 truncate">{item.brand}</div>
                            </td>
                            <td className="p-4 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                isSold ? 'bg-emerald-900/30 text-emerald-400' : 'bg-blue-900/30 text-blue-400 border border-blue-900/50'
                            }`}>
                                {isSold ? 'Vendido' : 'Anunciado'}
                            </span>
                            </td>
                            <td className="p-4 text-right font-medium text-slate-500">€{item.buyPrice.toFixed(2)}</td>
                            <td className="p-4 text-right font-medium text-slate-200">
                            {isSold ? (
                                <span className="text-emerald-500 font-bold">€{item.sellPrice.toFixed(2)}</span>
                            ) : (
                                <span className="text-slate-500">meta: {item.sellPrice.toFixed(2)}</span>
                            )}
                            </td>
                            <td className={`p-4 text-right`}>
                                <span className={`font-bold ${profit >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                                    {isSold ? (
                                        <>
                                            {profit >= 0 ? '+' : ''}€{profit.toFixed(2)}
                                        </>
                                    ) : '-'}
                                </span>
                            </td>
                            <td className="p-4 text-center">
                                {roiBadge}
                            </td>
                            <td className="p-4">
                            <div className="flex justify-center gap-1">
                                <button 
                                onClick={() => handleOpenSale(item)}
                                className={`p-2 rounded-lg transition-colors shadow-sm border ${
                                    isSold 
                                    ? 'bg-slate-700 border-slate-600 text-slate-500 hover:text-slate-300' 
                                    : 'bg-emerald-900/20 border-emerald-900/30 text-emerald-500 hover:bg-emerald-900/40'
                                }`}
                                title={isSold ? "Marcar como não vendido" : "Marcar como Vendido"}
                                >
                                {isSold ? <X size={16} /> : <CheckCircle size={16} />}
                                </button>
                                
                                <button 
                                onClick={() => handleOpenEdit(item)}
                                className="p-2 bg-slate-700 border border-slate-600 text-slate-400 rounded-lg hover:bg-slate-600 hover:text-blue-400 transition-colors shadow-sm"
                                title="Editar"
                                >
                                <Edit2 size={16} />
                                </button>

                                <button 
                                onClick={() => setDeletingId(item.id)}
                                className="p-2 bg-slate-700 border border-slate-600 text-slate-400 rounded-lg hover:bg-red-900/30 hover:text-red-400 hover:border-red-900/50 transition-colors shadow-sm"
                                title="Excluir"
                                >
                                <Trash2 size={16} />
                                </button>
                            </div>
                            </td>
                        </tr>
                        );
                    })}
                    </tbody>
                    <tfoot className="bg-slate-700/50 font-bold text-slate-300 border-t-2 border-slate-700">
                        <tr>
                            <td colSpan={4} className="p-4 text-right uppercase text-xs tracking-wider">Total (Página Atual):</td>
                            <td className={`p-4 text-right text-lg ${footerTotal >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                                {footerTotal >= 0 ? '+' : ''}€{footerTotal.toFixed(2)}
                            </td>
                            <td colSpan={2}></td>
                        </tr>
                    </tfoot>
                </table>
                )}
            </div>
        )}
      </div>

      {/* --- MODAIS --- */}

      {/* Modal Adicionar/Editar ITEM */}
      {(isAdding || editingItem) && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-700">
            <div className="bg-slate-900 p-4 flex justify-between items-center text-white border-b border-slate-700">
              <h3 className="font-bold flex items-center gap-2">
                {editingItem ? <Edit2 size={18} /> : <Plus size={18} />}
                {editingItem ? 'Editar Item' : 'Adicionar Novo Item'}
              </h3>
              <button onClick={() => { setIsAdding(false); setEditingItem(null); }} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={editingItem ? handleSaveEdit : handleSaveNew} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome do Produto</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder-slate-600"
                  placeholder="Ex: Nike Air Force 1"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Marca</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder-slate-600"
                  placeholder="Ex: Nike"
                  value={formData.brand}
                  onChange={e => setFormData({...formData, brand: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Preço Compra (€)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder-slate-600"
                    placeholder="0.00"
                    value={formData.buyPrice}
                    onChange={e => setFormData({...formData, buyPrice: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">{editingItem ? 'Preço Venda (Alvo)' : 'Preço Venda (Alvo)'}</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-white placeholder-slate-600"
                    placeholder="0.00"
                    value={formData.sellPrice}
                    onChange={e => setFormData({...formData, sellPrice: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-all mt-4 shadow-lg">
                {editingItem ? 'Salvar Alterações' : 'Adicionar ao Estoque'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Adicionar DESPESA */}
      {isAddingExpense && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-700">
            <div className="bg-red-700 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2">
                <MinusCircle size={18} />
                Registrar Despesa / Custo
              </h3>
              <button onClick={() => setIsAddingExpense(false)} className="text-red-200 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Descrição</label>
                <input 
                  autoFocus
                  required
                  type="text" 
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-white placeholder-slate-600"
                  placeholder="Ex: Embalagens correio"
                  value={expenseForm.description}
                  onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Categoria</label>
                    <select 
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-white"
                        value={expenseForm.category}
                        onChange={e => setExpenseForm({...expenseForm, category: e.target.value as any})}
                    >
                        <option value="packaging">Embalagem</option>
                        <option value="marketing">Marketing/Ads</option>
                        <option value="shipping">Frete (Custo)</option>
                        <option value="other">Outros</option>
                    </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Valor (€)</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-white placeholder-slate-600"
                    placeholder="0.00"
                    value={expenseForm.amount}
                    onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all mt-4 shadow-lg">
                Registrar Gasto
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Venda */}
      {sellingItem && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-700">
            <div className="bg-emerald-700 p-4 text-white text-center">
              <CheckCircle size={40} className="mx-auto mb-2 opacity-90" />
              <h3 className="font-bold text-lg">Parabéns pela Venda!</h3>
              <p className="text-emerald-100 text-sm">{sellingItem.name}</p>
            </div>
            <form onSubmit={handleConfirmSale} className="p-6">
              <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2 text-center">
                    Por quanto você vendeu?
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500 font-bold">€</span>
                    <input 
                      autoFocus
                      required
                      type="number" 
                      step="0.01"
                      className="w-full pl-8 p-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-lg font-bold text-center text-white"
                      value={sellingForm.sellPrice}
                      onChange={e => setSellingForm({...sellingForm, sellPrice: e.target.value})}
                    />
                  </div>
              </div>

              <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 text-center">
                    Custos Extras (Frete/Taxas)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 font-bold text-sm">€</span>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full pl-8 p-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-center text-white placeholder-slate-600"
                      value={sellingForm.extraCosts}
                      onChange={e => setSellingForm({...sellingForm, extraCosts: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 text-center mt-1">Este valor será descontado do seu lucro.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={() => setSellingItem(null)}
                  className="py-2.5 rounded-lg border border-slate-600 text-slate-400 font-medium hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="py-2.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-md"
                >
                  Confirmar Lucro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Exclusão */}
      {(deletingId || deletingExpenseId) && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center border border-slate-700">
            <div className="w-12 h-12 bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-900/50">
              <Trash2 size={24} />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">
                {deletingExpenseId ? 'Excluir esta despesa?' : 'Excluir este item?'}
            </h3>
            <p className="text-slate-400 text-sm mb-6">Esta ação não pode ser desfeita.</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => { setDeletingId(null); setDeletingExpenseId(null); }}
                className="py-2.5 rounded-lg border border-slate-600 text-slate-400 font-medium hover:bg-slate-700 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={deletingExpenseId ? confirmDeleteExpense : confirmDelete}
                className="py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-md"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CRM;