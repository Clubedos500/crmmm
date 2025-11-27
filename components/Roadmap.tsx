import React, { useState, useEffect } from 'react';
import { ROADMAP_DATA } from '../data';
import { CheckCircle, AlertTriangle, Square, CheckSquare, RotateCcw } from 'lucide-react';

const Roadmap: React.FC = () => {
  // State to track completed tasks: key is "dayIndex-taskIndex"
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('vinted_roadmap_progress');
    if (savedProgress) {
      setCompletedTasks(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress and calculate percentage
  useEffect(() => {
    localStorage.setItem('vinted_roadmap_progress', JSON.stringify(completedTasks));
    
    // Calculate total tasks
    let totalTasks = 0;
    ROADMAP_DATA.forEach(day => totalTasks += day.tasks.length);
    
    // Calculate completed
    const completedCount = Object.values(completedTasks).filter(v => v).length;
    
    setProgress(Math.round((completedCount / totalTasks) * 100));
  }, [completedTasks]);

  const toggleTask = (dayIndex: number, taskIndex: number) => {
    const key = `${dayIndex}-${taskIndex}`;
    setCompletedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleReset = () => {
    if(confirm('Tem certeza que deseja resetar todo o progresso do checklist?')) {
        setCompletedTasks({});
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">Plano de Ação 30 Dias</h2>
            <p className="text-slate-400">Marque as tarefas conforme as executa para salvar seu progresso.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-48">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                    <span>Progresso</span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div className="bg-teal-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <button onClick={handleReset} className="p-2 text-slate-500 hover:text-red-400 transition-colors" title="Resetar Progresso">
                <RotateCcw size={18} />
            </button>
        </div>
      </div>

      <div className="grid gap-6">
        {ROADMAP_DATA.map((item, dayIdx) => (
          <div key={dayIdx} className={`bg-slate-800 rounded-xl border transition-all ${
              // Check if all tasks for this day are done
              item.tasks.every((_, tIdx) => completedTasks[`${dayIdx}-${tIdx}`]) 
              ? 'border-emerald-900/50 shadow-sm opacity-75' 
              : 'border-slate-700 shadow-sm'
          } overflow-hidden flex flex-col md:flex-row`}>
            
            <div className="bg-slate-900 p-6 md:w-48 flex flex-col items-center justify-center border-r border-slate-700 flex-shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dia</span>
              <span className="text-4xl font-extrabold text-teal-500">{item.day}</span>
              <span className="text-xs text-center mt-2 font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">{item.phase.split(':')[0]}</span>
            </div>
            
            <div className="p-6 flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{item.phase}</h3>
                <span className="inline-flex items-center text-sm font-semibold text-blue-300 bg-blue-900/30 px-3 py-1 rounded-full mt-2 md:mt-0">
                  Foco: {item.focus}
                </span>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <CheckCircle size={16} className="text-slate-500" />
                  Lista de Tarefas:
                </h4>
                <ul className="grid grid-cols-1 gap-3">
                  {item.tasks.map((task, tIdx) => {
                    const isCompleted = completedTasks[`${dayIdx}-${tIdx}`];
                    return (
                        <li 
                            key={tIdx} 
                            onClick={() => toggleTask(dayIdx, tIdx)}
                            className={`text-sm flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                isCompleted 
                                ? 'bg-emerald-900/10 border-emerald-900/30 text-emerald-400 line-through decoration-emerald-500/30' 
                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-teal-700 hover:bg-slate-700'
                            }`}
                        >
                        <div className={`mt-0.5 flex-shrink-0 ${isCompleted ? 'text-emerald-500' : 'text-slate-600'}`}>
                            {isCompleted ? <CheckSquare size={18} /> : <Square size={18} />}
                        </div>
                        {task}
                        </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
                <div>
                   <span className="text-xs text-slate-500 uppercase font-bold">Meta do Marco</span>
                   <p className="font-bold text-slate-200">{item.goal}</p>
                </div>
                {dayIdx > 3 && (
                   <div className="flex items-center text-amber-400 text-xs font-medium bg-amber-900/20 px-3 py-1 rounded-full border border-amber-900/30">
                     <AlertTriangle size={14} className="mr-1" /> Requer Reinvestimento
                   </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;