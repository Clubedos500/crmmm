
export interface ProductMetric {
    category: string;
    brand: string;
    buyPrice: string;
    sellPrice: string;
    margin: string;
    velocity: 'Alta' | 'Média' | 'Explosiva';
    notes: string;
}

export interface DailyTask {
    day: number;
    phase: string;
    focus: string;
    tasks: string[];
    goal: string;
}

export interface MarketTrend {
    niche: string;
    trend: string;
    avgTicket: string;
    tip: string;
}

export interface InventoryItem {
    id: string;
    name: string;
    brand: string;
    buyPrice: number;
    sellPrice: number; // Preço alvo se listado, preço final se vendido
    status: 'listed' | 'sold';
    dateAdded: string;
    dateSold?: string;
    // Added extraCosts to track shipping/fees
    extraCosts?: number;
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    category: 'packaging' | 'marketing' | 'shipping' | 'other';
    date: string;
}

export interface Mission {
    id: string;
    title: string;
    xpReward: number;
    completed: boolean;
    type: 'listing' | 'price' | 'logistics' | 'engagement';
}

export interface GameState {
    level: number;
    currentXP: number;
    xpToNextLevel: number;
    lastLoginDate: string;
    streak: number;
    missions: Mission[];
}

export interface ViralProduct {
    ID_Interno: string;
    Nome_Produto_Curto: string;
    Nicho_De_Mercado: string;
    Motivo_Principal_Viral: string;
    Acao_Estrategica_Recomendada: string;
    Plataforma_Pico: string;
    Estimativa_Venda_BRL: number;
    Estimativa_Custo_BRL: number;
}

export enum AppView {
    DASHBOARD = 'DASHBOARD',
    MARKET_DATA = 'MARKET_DATA',
    ROADMAP = 'ROADMAP',
    AI_ADVISOR = 'AI_ADVISOR',
    CRM = 'CRM',
    GAMIFICATION = 'GAMIFICATION'
}
