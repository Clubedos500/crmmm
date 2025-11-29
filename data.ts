
import { ProductMetric, DailyTask, MarketTrend, ViralProduct } from './types';

export const TOP_PRODUCTS: ProductMetric[] = [
    { category: 'Sneakers', brand: 'Nike (Air Force 1, Dunk, Jordan)', buyPrice: '30€ - 50€', sellPrice: '70€ - 120€', margin: '40% - 60%', velocity: 'Explosiva', notes: 'Limpe bem, troque cadarços, boas fotos.' },
    { category: 'Workwear', brand: 'Carhartt (Detroit, Double Knee)', buyPrice: '40€ - 60€', sellPrice: '100€ - 180€', margin: '50% - 150%', velocity: 'Alta', notes: 'Desgaste natural é valorizado (vintage).' },
    { category: 'Sportswear Vintage', brand: 'Adidas (Swoosh antigo), Nike 90s', buyPrice: '10€ - 20€', sellPrice: '40€ - 60€', margin: '150% - 300%', velocity: 'Alta', notes: 'Moletons e Corta-ventos.' },
    { category: 'Outdoor', brand: 'The North Face (Puffer, Fleece)', buyPrice: '50€ - 80€', sellPrice: '120€ - 200€', margin: '60% - 100%', velocity: 'Alta', notes: 'Verifique autenticidade com cuidado.' },
    { category: 'Denim', brand: 'Levi\'s (501, 550)', buyPrice: '15€ - 25€', sellPrice: '40€ - 65€', margin: '80% - 150%', velocity: 'Média', notes: 'Medidas exatas são cruciais.' },
    { category: 'Luxury Entry', brand: 'Ralph Lauren (Camisas/Malhas)', buyPrice: '15€ - 25€', sellPrice: '45€ - 70€', margin: '100% - 150%', velocity: 'Média', notes: 'Foque em cores neutras e logo pequeno.' },
    { category: 'Fast Fashion (Novo)', brand: 'Zara (Coleções virais esgotadas)', buyPrice: '10€ - 20€', sellPrice: '30€ - 50€', margin: '50% - 100%', velocity: 'Explosiva', notes: 'Apenas itens com etiqueta (NWT) ou virais do TikTok.' },
];

export const MARKET_TRENDS: MarketTrend[] = [
    { niche: 'Y2K / 2000s', trend: 'Baby tees, calças cargo, óculos rápidos', avgTicket: '25€', tip: 'Use hashtags #y2k #2000s #vintage.' },
    { niche: 'Gorpcore', trend: 'Arc\'teryx, Salomon, Patagônia', avgTicket: '120€', tip: 'Foque em funcionalidade e impermeabilidade.' },
    { niche: 'Old Money', trend: 'Suéteres nos ombros, linho, Ralph Lauren', avgTicket: '60€', tip: 'Estética limpa, fotos em ambiente claro.' },
    { niche: 'Football Shirts', trend: 'Camisas de times retrô (90s/00s)', avgTicket: '50€', tip: 'Verifique originalidade das etiquetas internas.' },
];

export const VIRAL_PRODUCTS: ViralProduct[] = [
    {
        "ID_Interno": "ES_GEN_001",
        "Nome_Produto_Curto": "Bolso Bimba y Lola (Réplica/Outlet)",
        "Nicho_De_Mercado": "Moda España / Acessórios",
        "Motivo_Principal_Viral": "Alta demanda por modelos 'Bandolera' esgotados em loja.",
        "Acao_Estrategica_Recomendada": "Comprar no AliExpress (AAA+) ou Outlet e revender como 'Novo s/ etiqueta'.",
        "Plataforma_Pico": "Vinted ES / Wallapop",
        "Estimativa_Venda_BRL": 65.00, // Actually treating as EUR in UI
        "Estimativa_Custo_BRL": 18.00 // Actually treating as EUR in UI
    },
    {
        "ID_Interno": "ES_GEN_002",
        "Nome_Produto_Curto": "Projetor Portátil HY300 (4K)",
        "Nicho_De_Mercado": "Tech / Gadgets",
        "Motivo_Principal_Viral": "Viral no TikTok Espanha como 'Cinema em Casa Barato'.",
        "Acao_Estrategica_Recomendada": "Dropshipping reverso: Comprar 5un no Ali e enviar rápido localmente.",
        "Plataforma_Pico": "TikTok ES",
        "Estimativa_Venda_BRL": 75.00,
        "Estimativa_Custo_BRL": 32.00
    },
    {
        "ID_Interno": "ES_GEN_003",
        "Nome_Produto_Curto": "Vestido Zara Satinado (Viral)",
        "Nicho_De_Mercado": "Fast Fashion",
        "Motivo_Principal_Viral": "Esgotado nas lojas de Madrid/Barcelona. Revenda com ágio.",
        "Acao_Estrategica_Recomendada": "Monitorar reposição no site Zara às 08:00 e listar imediatamente.",
        "Plataforma_Pico": "Instagram",
        "Estimativa_Venda_BRL": 45.00,
        "Estimativa_Custo_BRL": 29.95
    },
    {
        "ID_Interno": "ES_GEN_004",
        "Nome_Produto_Curto": "Lego Flowers (Bouquet)",
        "Nicho_De_Mercado": "Decoração / Hobby",
        "Motivo_Principal_Viral": "Presente muito popular para casais. Versões 'compatíveis' vendem bem.",
        "Acao_Estrategica_Recomendada": "Vender a versão 'Blocos Compatíveis' deixando claro que não é Lego.",
        "Plataforma_Pico": "Vinted ES",
        "Estimativa_Venda_BRL": 35.00,
        "Estimativa_Custo_BRL": 12.00
    },
    {
        "ID_Interno": "ES_GEN_005",
        "Nome_Produto_Curto": "Camisa Futebol Retro (Real/Barça 90s)",
        "Nicho_De_Mercado": "Bloke Core",
        "Motivo_Principal_Viral": "Tendência 'Bloke Core' fortíssima na Europa.",
        "Acao_Estrategica_Recomendada": "Fornecedores asiáticos (DHGate/Ali) -> Venda local com entrega rápida.",
        "Plataforma_Pico": "Vinted / Depop",
        "Estimativa_Venda_BRL": 45.00,
        "Estimativa_Custo_BRL": 15.00
    }
];


export const ROADMAP_DATA: DailyTask[] = [
    {
        day: 1,
        phase: 'Fase 1: Capital Inicial (0€ -> 200€)',
        focus: 'Inventário Próprio',
        tasks: ['Vasculhar guarda-roupa próprio e de familiares.', 'Separar 20 itens não usados.', 'Limpar, passar e preparar itens.', 'Pesquisar preço de mercado de cada item.'],
        goal: 'Listar 10 itens sem custo.'
    },
    {
        day: 2,
        phase: 'Fase 1: Capital Inicial',
        focus: 'Fotos e Listagem',
        tasks: ['Tirar fotos com luz natural (fundo neutro).', 'Criar descrições detalhadas (medidas, defeitos).', 'Publicar entre 18h e 21h (horário nobre).', 'Ativar descontos de bundle (2 itens -10%, 3 itens -15%).'],
        goal: 'Primeiras 5 vendas ou 50€ em caixa.'
    },
    {
        day: 5,
        phase: 'Fase 1: Capital Inicial',
        focus: 'Levantamento de Caixa',
        tasks: ['Revisar preços de itens não vendidos.', 'Enviar ofertas para quem curtiu (favoritos).', 'Compartilhar perfil em grupos de nicho.', 'Sacar primeiros lucros para saldo Vinted.'],
        goal: 'Atingir 150€-200€ de banca.'
    },
    {
        day: 8,
        phase: 'Fase 2: Arbitragem (200€ -> 1.000€)',
        focus: 'Sourcing Agressivo',
        tasks: ['Buscar "Lotes" ou "Bundles" mal precificados.', 'Procurar erros de digitação (ex: "Jorden" em vez de "Jordan").', 'Negociar agressivamente (ofertar 60% do valor).', 'Focar em marcas de alta liquidez (Nike, Carhartt).'],
        goal: 'Comprar 10 peças com potencial de 2x.'
    },
    {
        day: 15,
        phase: 'Fase 3: Escala (1.000€ -> 3.000€)',
        focus: 'Automação e Volume',
        tasks: ['Estabelecer rotina de 30 min de sourcing a cada 4 horas.', 'Usar bots ou filtros salvos para alertas imediatos.', 'Reinvestir 100% do lucro.', 'Diversificar para vinted de outros países (França/Espanha).'],
        goal: 'Giro de estoque de 48h.'
    },
    {
        day: 25,
        phase: 'Fase 4: Alta Performance (3.000€ -> 10.000€)',
        focus: 'High Ticket & Flipping Rápido',
        tasks: ['Focar em itens acima de 100€ (margem absoluta maior).', 'Comprar lotes de fechamento de lojas.', 'Paid Ads (Boost) em itens com margem >50€.', 'Análise diária de ROI.'],
        goal: 'Vendas diárias de 500€.'
    },
    {
        day: 30,
        phase: 'Fase Final',
        focus: 'Consolidação',
        tasks: ['Balanço final.', 'Separar lucro líquido.', 'Planejar mês seguinte.', 'Criar sistema de sourcing delegado (opcional).'],
        goal: '10.000€ de Faturamento Bruto Acumulado.'
    }
];
