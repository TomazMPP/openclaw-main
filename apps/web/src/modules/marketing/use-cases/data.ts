interface UseCase {
  readonly slug: string;
  readonly title: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly headline: string;
  readonly description: string;
  readonly benefits: readonly string[];
  readonly examples: readonly string[];
}

export const USE_CASES: readonly UseCase[] = [
  {
    slug: "openclaw-para-atendimento-ao-cliente",
    title: "Atendimento ao Cliente",
    metaTitle: "OpenClaw para Atendimento ao Cliente | Automatize Suporte 24/7",
    metaDescription:
      "Use o OpenClaw para automatizar o atendimento ao cliente via Telegram. Respostas instantâneas 24/7, resolução de tickets e satisfação garantida.",
    headline: "Atendimento ao cliente automatizado com IA, 24 horas por dia",
    description:
      "Seu cliente não espera. Com o OpenClaw, você cria um agente de IA que responde dúvidas, resolve problemas e encaminha casos complexos automaticamente pelo Telegram.",
    benefits: [
      "Respostas instantâneas a qualquer hora do dia ou da noite",
      "Redução de até 80% no volume de tickets manuais",
      "Escalonamento automático para atendentes humanos quando necessário",
      "Histórico completo de conversas para análise",
    ],
    examples: [
      "Responder perguntas frequentes sobre produtos e serviços",
      "Verificar status de pedidos e entregas",
      "Processar trocas e devoluções automaticamente",
      "Coletar feedback pós-atendimento",
    ],
  },
  {
    slug: "openclaw-para-gerenciar-email",
    title: "Gerenciamento de E-mail",
    metaTitle: "OpenClaw para Gerenciar E-mail | Organize sua Caixa de Entrada com IA",
    metaDescription:
      "Automatize a leitura, resumo e resposta de e-mails com IA usando o OpenClaw. Economize horas por dia na gestão da sua caixa de entrada.",
    headline: "Nunca mais perca um e-mail importante",
    description:
      "O OpenClaw lê, resume e prioriza seus e-mails automaticamente. Receba resumos diários no Telegram e rascunhos de respostas prontos para enviar.",
    benefits: [
      "Resumo automático de e-mails longos em segundos",
      "Priorização inteligente por urgência e importância",
      "Rascunhos de resposta gerados por IA no seu tom de voz",
      "Alertas no Telegram para e-mails críticos",
    ],
    examples: [
      "Resumir newsletters e relatórios diários",
      "Redigir respostas para clientes automaticamente",
      "Filtrar spam e e-mails irrelevantes",
      "Organizar e-mails por projeto ou cliente",
    ],
  },
  {
    slug: "openclaw-para-vendas",
    title: "Vendas",
    metaTitle: "OpenClaw para Vendas | Automatize Prospecção e Follow-ups",
    metaDescription:
      "Aumente suas vendas com IA. O OpenClaw automatiza prospecção, qualificação de leads e follow-ups pelo Telegram.",
    headline: "Venda mais com um assistente de IA que nunca descansa",
    description:
      "O OpenClaw qualifica leads, envia follow-ups automáticos e mantém seu pipeline organizado. Tudo pelo Telegram, sem precisar de CRM complexo.",
    benefits: [
      "Qualificação automática de leads 24/7",
      "Follow-ups automáticos que não esquecem ninguém",
      "Pesquisa de prospects automatizada",
      "Relatórios de pipeline direto no Telegram",
    ],
    examples: [
      "Qualificar leads com perguntas automatizadas",
      "Enviar propostas personalizadas por IA",
      "Acompanhar negociações em andamento",
      "Gerar relatórios de vendas semanais",
    ],
  },
  {
    slug: "openclaw-para-telegram",
    title: "Telegram",
    metaTitle: "OpenClaw para Telegram | Crie Bots Inteligentes com IA",
    metaDescription:
      "Crie bots inteligentes para Telegram com IA em 30 segundos. O OpenClaw permite automatizar atendimento, vendas e suporte sem programação.",
    headline: "Transforme seu Telegram em uma máquina de produtividade",
    description:
      "O OpenClaw se integra nativamente ao Telegram. Em 30 segundos você tem um agente de IA rodando, respondendo mensagens e executando tarefas automaticamente.",
    benefits: [
      "Setup em 30 segundos, sem código",
      "Integração nativa com Telegram Bot API",
      "Suporte a grupos, canais e mensagens diretas",
      "Processamento de texto, imagens e documentos",
    ],
    examples: [
      "Bot de atendimento para grupos de clientes",
      "Assistente pessoal para gestão de tarefas",
      "Bot de vendas com catálogo de produtos",
      "Moderador inteligente para comunidades",
    ],
  },
  {
    slug: "openclaw-para-suporte-tecnico",
    title: "Suporte Técnico",
    metaTitle: "OpenClaw para Suporte Técnico | Resolução Automatizada com IA",
    metaDescription:
      "Automatize o suporte técnico com IA usando o OpenClaw. Resolução de problemas, troubleshooting e escalonamento automático 24/7.",
    headline: "Suporte técnico de nível 1 totalmente automatizado",
    description:
      "O OpenClaw resolve problemas técnicos comuns automaticamente, guia usuários por troubleshooting e só escala para humanos quando realmente necessário.",
    benefits: [
      "Troubleshooting automatizado passo a passo",
      "Base de conhecimento que aprende com cada interação",
      "Escalonamento inteligente com contexto completo",
      "Redução drástica no tempo médio de resolução",
    ],
    examples: [
      "Guiar reset de senha e configurações",
      "Diagnosticar problemas de conexão",
      "Explicar erros e sugerir soluções",
      "Coletar logs e informações para o time técnico",
    ],
  },
  {
    slug: "openclaw-para-marketing",
    title: "Marketing",
    metaTitle: "OpenClaw para Marketing | Crie Conteúdo e Analise Dados com IA",
    metaDescription:
      "Automatize tarefas de marketing com IA. O OpenClaw cria conteúdo, monitora concorrentes e gera relatórios automaticamente.",
    headline: "Seu assistente de marketing que trabalha 24/7",
    description:
      "Do rascunho de posts ao monitoramento de concorrentes, o OpenClaw automatiza as tarefas repetitivas de marketing para você focar na estratégia.",
    benefits: [
      "Criação de conteúdo para redes sociais em segundos",
      "Monitoramento automático de concorrentes",
      "Relatórios de performance sob demanda",
      "Ideias de campanha baseadas em tendências",
    ],
    examples: [
      "Redigir posts para Instagram, LinkedIn e Twitter",
      "Criar calendário editorial automaticamente",
      "Analisar sentimento de marca nas redes",
      "Gerar relatórios de ROI de campanhas",
    ],
  },
  {
    slug: "openclaw-para-financeiro",
    title: "Financeiro",
    metaTitle: "OpenClaw para Financeiro | Automatize Controle Financeiro com IA",
    metaDescription:
      "Use IA para automatizar tarefas financeiras. O OpenClaw rastreia despesas, gera relatórios e controla orçamentos pelo Telegram.",
    headline: "Controle financeiro automatizado com inteligência artificial",
    description:
      "O OpenClaw organiza suas finanças automaticamente: rastreia despesas, gera notas fiscais, calcula impostos e envia alertas de orçamento.",
    benefits: [
      "Rastreamento automático de despesas e receitas",
      "Alertas de orçamento em tempo real",
      "Cálculos tributários automatizados",
      "Relatórios financeiros sob demanda no Telegram",
    ],
    examples: [
      "Categorizar despesas automaticamente",
      "Gerar relatórios de fluxo de caixa",
      "Calcular impostos e contribuições",
      "Alertar sobre contas a vencer",
    ],
  },
  {
    slug: "openclaw-para-rh",
    title: "Recursos Humanos",
    metaTitle: "OpenClaw para RH | Automatize Processos de RH com IA",
    metaDescription:
      "Automatize processos de RH com IA. O OpenClaw ajuda com recrutamento, onboarding e gestão de pessoas pelo Telegram.",
    headline: "RH mais eficiente com automação inteligente",
    description:
      "O OpenClaw automatiza tarefas repetitivas de RH: triagem de currículos, agendamento de entrevistas, onboarding de novos colaboradores e muito mais.",
    benefits: [
      "Triagem automática de currículos por critérios",
      "Agendamento inteligente de entrevistas",
      "Onboarding automatizado para novos colaboradores",
      "Pesquisas de clima organizacional via Telegram",
    ],
    examples: [
      "Filtrar candidatos por requisitos da vaga",
      "Redigir descrições de vagas otimizadas",
      "Responder dúvidas de colaboradores sobre benefícios",
      "Coletar feedbacks de performance",
    ],
  },
  {
    slug: "openclaw-para-redes-sociais",
    title: "Redes Sociais",
    metaTitle: "OpenClaw para Redes Sociais | Automatize Gestão de Mídias Sociais",
    metaDescription:
      "Automatize a gestão de redes sociais com IA. O OpenClaw cria posts, monitora menções e engaja seguidores automaticamente.",
    headline: "Gestão de redes sociais no piloto automático",
    description:
      "O OpenClaw cria conteúdo, sugere hashtags, monitora menções da sua marca e até responde comentários — tudo automaticamente via Telegram.",
    benefits: [
      "Criação de conteúdo para múltiplas plataformas",
      "Sugestão inteligente de hashtags e horários",
      "Monitoramento de menções e sentimento",
      "Respostas automáticas a comentários e DMs",
    ],
    examples: [
      "Criar posts adaptados para cada rede social",
      "Monitorar o que falam da sua marca",
      "Sugerir tendências relevantes para seu nicho",
      "Gerar legendas otimizadas para engajamento",
    ],
  },
  {
    slug: "openclaw-para-produtividade",
    title: "Produtividade",
    metaTitle: "OpenClaw para Produtividade | Automatize Tarefas do Dia a Dia",
    metaDescription:
      "Aumente sua produtividade com IA. O OpenClaw automatiza tarefas do dia a dia: agenda, lembretes, resumos e organização pessoal.",
    headline: "Seu assistente pessoal de produtividade com IA",
    description:
      "O OpenClaw organiza seu dia automaticamente: gerencia sua agenda, envia lembretes, resume documentos e prioriza suas tarefas — tudo pelo Telegram.",
    benefits: [
      "Gestão inteligente de agenda e compromissos",
      "Lembretes automáticos de prazos e reuniões",
      "Resumo de documentos e artigos longos",
      "Priorização de tarefas baseada em urgência",
    ],
    examples: [
      "Planejar sua semana com base em prioridades",
      "Resumir atas de reunião automaticamente",
      "Lembrar de deadlines antes do prazo",
      "Organizar tarefas por projeto e contexto",
    ],
  },
] as const;

export const getUseCaseBySlug = (slug: string) =>
  USE_CASES.find((uc) => uc.slug === slug);
