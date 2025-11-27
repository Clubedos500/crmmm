import React, { useState, useEffect } from 'react';
import { GameState, Mission, InventoryItem } from '../types';
import { Trophy, Zap, CheckCircle, Target, TrendingUp, AlertTriangle, Star, ShieldAlert, RefreshCw, FastForward } from 'lucide-react';

const Gamification: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    currentXP: 0,
    xpToNextLevel: 1000,
    lastLoginDate: new Date().toLocaleDateString('pt-BR'),
    streak: 0,
    missions: []
  });

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [penaltyMessage, setPenaltyMessage] = useState<string | null>(null);

  // Load Game State
  useEffect(() => {
    const savedState = localStorage.getItem('vinted_gamification');
    const savedInventory = localStorage.getItem('vinted_inventory');
    const today = new Date().toLocaleDateString('pt-BR');

    let newState: GameState;

    if (savedState) {
      newState = JSON.parse(savedState);
      
      // Check for new day logic
      if (newState.lastLoginDate !== today) {
        // PENALTY CHECK: Check if previous missions were completed
        const incompleteMissions = newState.missions.filter(m => !m.completed);
        let penaltyXP = 0;
        
        if (incompleteMissions.length > 0) {
            penaltyXP = incompleteMissions.reduce((acc, m) => acc + (m.xpReward * 2), 0);
            newState.currentXP = Math.max(0, newState.currentXP - penaltyXP);
            setPenaltyMessage(`Você perdeu ${penaltyXP} XP por missões não completadas ontem!`);
            // Reset streak on failure
            newState.streak = 0; 
        } else {
            // Keep streak if all done (or valid logic)
            newState.streak += 1;
        }

        // Generate NEW Missions based on inventory state
        const inventory: InventoryItem[] = savedInventory ? JSON.parse(savedInventory) : [];
        newState.missions = generateDailyMissions(inventory);
        newState.lastLoginDate = today;
      }
    } else {
      // First time initialization
      newState = {
        level: 1,
        currentXP: 0,
        xpToNextLevel: 1000,
        lastLoginDate: today,
        streak: 1,
        missions: generateDailyMissions([])
      };
    }

    setGameState(newState);
    localStorage.setItem('vinted_gamification', JSON.stringify(newState));
  }, []);

  // Save State on Change
  useEffect(() => {
    localStorage.setItem('vinted_gamification', JSON.stringify(gameState));
  }, [gameState]);

  // --- Dynamic Mission Generator ---
  const generateDailyMissions = (inventory: InventoryItem[]): Mission[] => {
    const missions: Mission[] = [];
    const now = Date.now();
    
    // 1. Mission based on Old Inventory (Price Optimization)
    const oldItems = inventory.filter(i => {
        if (i.status === 'sold') return false;
        const [day, month, year] = i.dateAdded.split('/');
        const dateAdded = new Date(Number(year), Number(month) - 1, Number(day));
        const diffDays = Math.ceil(Math.abs(new Date().getTime() - dateAdded.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays > 30;
    });

    if (oldItems.length > 0) {
        missions.push({
            id: `${now}-opt`,
            title: `Otimização: Baixar preço de ${Math.min(2, oldItems.length)} item(s) antigo(s)`,
            xpReward: 150,
            completed: false,
            type: 'price'
        });
    }

    // 2. Logistics (Sold but maybe not shipped logic - simulation)
    const soldItems = inventory.filter(i => i.status === 'sold');
    if (soldItems.length > 0 && Math.random() > 0.5) {
        missions.push({
            id: `${now}-log`,
            title: 'Logística: Organizar envios pendentes',
            xpReward: 100,
            completed: false,
            type: 'logistics'
        });
    }

    // 3. Dynamic Listing Missions (Varied)
    const listingTemplates = [
        { title: 'Crescimento: Listar 1 novo item', xp: 50 },
        { title: 'Crescimento: Listar 3 novos itens', xp: 150 },
        { title: 'Crescimento: Listar 5 itens (Modo Hard)', xp: 350 },
        { title: 'Crescimento: Melhorar fotos de 2 anúncios', xp: 100 },
    ];
    // Randomly pick one listing mission
    const randomListing = listingTemplates[Math.floor(Math.random() * listingTemplates.length)];
    
    missions.push({
        id: `${now}-list`,
        title: randomListing.title,
        xpReward: randomListing.xp,
        completed: false,
        type: 'listing'
    });

    // 4. Dynamic Engagement Missions (Varied)
    const engagementTemplates = [
        { title: 'Engajamento: Enviar ofertas para 5 interessados', xp: 100 },
        { title: 'Engajamento: Compartilhar perfil em 2 grupos', xp: 80 },
        { title: 'Engajamento: Responder todas as mensagens pendentes', xp: 50 },
        { title: 'Engajamento: Dar "Up" em itens de maior valor', xp: 75 },
    ];
    // Randomly pick one engagement mission
    const randomEngagement = engagementTemplates[Math.floor(Math.random() * engagementTemplates.length)];

    missions.push({
        id: `${now}-eng`,
        title: randomEngagement.title,
        xpReward: randomEngagement.xp,
        completed: false,
        type: 'engagement'
    });

    return missions.slice(0, 4); // Max 4 missions
  };

  // --- Manual Trigger for "New Day" (Simulation) ---
  const handleSimulateNewDay = () => {
      if(!confirm("Isso irá simular a passagem de 24h. Missões não completadas gerarão penalidade e novas missões serão criadas. Continuar?")) return;

      const savedInventory = localStorage.getItem('vinted_inventory');
      const inventory: InventoryItem[] = savedInventory ? JSON.parse(savedInventory) : [];

      // Calculate Penalty
      const incompleteMissions = gameState.missions.filter(m => !m.completed);
      let penaltyXP = 0;
      let newStreak = gameState.streak;

      if (incompleteMissions.length > 0) {
          penaltyXP = incompleteMissions.reduce((acc, m) => acc + (m.xpReward * 2), 0);
          newStreak = 0; // Reset streak
          setPenaltyMessage(`Simulação: -${penaltyXP} XP (Missões falharam). Streak resetado.`);
      } else {
          newStreak += 1;
          setPenaltyMessage("Simulação: Novo dia! Sem penalidades.");
      }

      // Generate New Missions
      const newMissions = generateDailyMissions(inventory);

      setGameState(prev => ({
          ...prev,
          currentXP: Math.max(0, prev.currentXP - penaltyXP),
          streak: newStreak,
          missions: newMissions,
          lastLoginDate: new Date().toLocaleDateString('pt-BR') // Update date (conceptually)
      }));
  };

  const completeMission = (missionId: string) => {
    const missionIndex = gameState.missions.findIndex(m => m.id === missionId);
    if (missionIndex === -1 || gameState.missions[missionIndex].completed) return;

    const mission = gameState.missions[missionIndex];
    let newXP = gameState.currentXP + mission.xpReward;
    let newLevel = gameState.level;
    let newXPToNext = gameState.xpToNextLevel;

    // Check for Level Up
    if (newXP >= gameState.xpToNextLevel) {
        newLevel += 1;
        newXP = newXP - gameState.xpToNextLevel;
        newXPToNext = newLevel * 1000;
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
    }

    // Check for Daily Bonus (All completed)
    const otherMissionsCompleted = gameState.missions.filter(m => m.id !== missionId && m.completed).length;
    if (otherMissionsCompleted === gameState.missions.length - 1) {
        newXP += 50; // Bonus
    }

    const newMissions = [...gameState.missions];
    newMissions[missionIndex] = { ...mission, completed: true };

    setGameState({
        ...gameState,
        currentXP: newXP,
        level: newLevel,
        xpToNextLevel: newXPToNext,
        missions: newMissions
    });
  };

  const progressPercent = Math.min(100, (gameState.currentXP / gameState.xpToNextLevel) * 100);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Penalty Notification */}
      {penaltyMessage && (
          <div className="bg-red-900/20 border border-red-900/40 text-red-300 p-4 rounded-xl flex items-center gap-3 animate-bounce shadow-sm">
              <ShieldAlert />
              <div>
                  <h4 className="font-bold">Aviso do Sistema</h4>
                  <p className="text-sm">{penaltyMessage}</p>
              </div>
              <button onClick={() => setPenaltyMessage(null)} className="ml-auto text-xs underline hover:text-red-200">Fechar</button>
          </div>
      )}

      {/* Level Up Overlay */}
      {showLevelUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none">
              <div className="bg-gradient-to-br from-yellow-300 to-amber-500 p-10 rounded-3xl shadow-2xl text-center transform scale-110 animate-pulse">
                  <Trophy size={80} className="text-white mx-auto mb-4" />
                  <h2 className="text-4xl font-extrabold text-white mb-2">LEVEL UP!</h2>
                  <p className="text-yellow-900 font-bold text-xl">Você alcançou o Nível {gameState.level}</p>
              </div>
          </div>
      )}

      {/* Header Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden border border-slate-700">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Trophy size={200} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center border-4 border-slate-700 shadow-xl relative">
                    <span className="text-4xl font-black text-white">{gameState.level}</span>
                    {/* Badge Icon based on level */}
                    <div className="absolute -bottom-2 -right-2 bg-slate-800 p-1.5 rounded-full border border-slate-600">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    </div>
                </div>
                <span className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">Nível Atual</span>
            </div>

            <div className="flex-1 w-full">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h2 className="text-2xl font-bold">Vendedor {gameState.level < 5 ? 'Iniciante' : gameState.level < 10 ? 'Intermediário' : 'Expert'}</h2>
                        <p className="text-slate-400 text-sm">Continue completando missões para evoluir.</p>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-yellow-400">{gameState.currentXP}</span>
                        <span className="text-slate-500 text-sm"> / {gameState.xpToNextLevel} XP</span>
                    </div>
                </div>
                
                <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden border border-slate-600 shadow-inner">
                    <div 
                        className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full transition-all duration-700 ease-out relative"
                        style={{ width: `${progressPercent}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span>Progresso para Nível {gameState.level + 1}</span>
                    <span>{Math.round(progressPercent)}%</span>
                </div>
            </div>
        </div>
      </div>

      {/* Missions List */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-900/30">
            <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Target className="text-teal-500" />
                    Missões de Hoje
                </h3>
                <p className="text-sm text-slate-400">Complete até meia-noite para evitar penalidades!</p>
            </div>
            <div className="flex items-center gap-1 text-orange-400 bg-orange-900/20 px-3 py-1 rounded-full text-xs font-bold border border-orange-900/30">
                <Zap size={14} fill="currentColor" />
                Streak: {gameState.streak} dias
            </div>
          </div>

          <div className="divide-y divide-slate-700">
            {gameState.missions.map((mission) => (
                <div 
                    key={mission.id} 
                    onClick={() => completeMission(mission.id)}
                    className={`p-5 flex items-center gap-4 transition-all cursor-pointer group ${
                        mission.completed ? 'bg-emerald-900/10' : 'hover:bg-slate-700/50'
                    }`}
                >
                    <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all border-2
                        ${mission.completed 
                            ? 'bg-emerald-500 text-white border-emerald-500 scale-110' 
                            : 'bg-slate-700 text-slate-400 border-slate-600 group-hover:border-teal-400'}
                    `}>
                        <CheckCircle size={18} />
                    </div>
                    
                    <div className="flex-1">
                        <h4 className={`font-bold transition-colors ${mission.completed ? 'text-emerald-500 line-through opacity-50' : 'text-slate-200'}`}>
                            {mission.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                                mission.type === 'listing' ? 'bg-blue-900/30 text-blue-300' :
                                mission.type === 'price' ? 'bg-purple-900/30 text-purple-300' :
                                mission.type === 'engagement' ? 'bg-pink-900/30 text-pink-300' :
                                'bg-amber-900/30 text-amber-300'
                            }`}>
                                {mission.type}
                            </span>
                        </div>
                    </div>

                    <div className={`
                        font-bold text-sm px-3 py-1 rounded-full border flex items-center gap-1
                        ${mission.completed 
                            ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' 
                            : 'bg-slate-700 text-slate-400 border-slate-600'}
                    `}>
                        <Star size={12} fill="currentColor" />
                        +{mission.xpReward} XP
                    </div>
                </div>
            ))}
          </div>
          
          <div className="p-4 bg-slate-900/50 text-center text-xs text-slate-500 border-t border-slate-700">
              <span className="flex items-center justify-center gap-1">
                <AlertTriangle size={12} />
                Missões não completadas geram penalidade de 2x XP amanhã.
              </span>
          </div>
      </div>

      {/* Dev Tools / Simulation */}
      <div className="flex justify-center pt-8 opacity-50 hover:opacity-100 transition-opacity">
        <button 
            onClick={handleSimulateNewDay}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-300 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full transition-colors border border-slate-700"
            title="Avança o calendário em 1 dia, aplica penalidades e gera novas missões"
        >
            <FastForward size={14} />
            Simular Novo Dia (Debug)
        </button>
      </div>

    </div>
  );
};

export default Gamification;