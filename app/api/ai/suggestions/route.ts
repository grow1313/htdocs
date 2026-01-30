import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-mode',
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { metrics } = await request.json()

    // Se não houver API key, retornar sugestões demo
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-mode') {
      return NextResponse.json({
        suggestions: [
          {
            type: 'success',
            title: '🎯 Otimize suas Campanhas',
            description: 'Seu CTR de 5.17% está acima da média! Continue testando novos criativos para manter esse desempenho.',
            priority: 'medium',
          },
          {
            type: 'warning',
            title: '💰 Reduza o CPC',
            description: 'Seu CPC de R$ 0.53 pode ser otimizado. Teste segmentar audiências mais específicas e ajuste os lances.',
            priority: 'high',
          },
          {
            type: 'info',
            title: '📱 Melhore a Taxa de Resposta no WhatsApp',
            description: 'Com 87.3% de taxa de resposta, considere automatizar respostas para perguntas frequentes.',
            priority: 'low',
          },
          {
            type: 'success',
            title: '📈 ROI Positivo',
            description: 'Seu ROI está positivo! Considere escalar o investimento em 20% nas campanhas com melhor performance.',
            priority: 'high',
          },
        ],
        mode: 'demo',
      })
    }

    // Criar prompt para GPT-4
    const prompt = `Você é um especialista em marketing digital e vendas online. Analise as seguintes métricas de um funil de vendas e forneça 4 sugestões práticas e acionáveis:

**WhatsApp:**
- Conversas: ${metrics.whatsapp?.conversas || 0}
- Mensagens Enviadas: ${metrics.whatsapp?.mensagensEnviadas || 0}
- Mensagens Recebidas: ${metrics.whatsapp?.mensagensRecebidas || 0}
- Taxa de Resposta: ${metrics.whatsapp?.taxaResposta || 0}%

**Facebook Ads:**
- Impressões: ${metrics.facebook?.impressoes || 0}
- Cliques: ${metrics.facebook?.cliques || 0}
- CTR: ${metrics.facebook?.ctr || 0}%
- CPC: R$ ${metrics.facebook?.cpc || 0}
- Gastos: R$ ${metrics.facebook?.gastos || 0}

**Hotmart:**
- Vendas: ${metrics.hotmart?.vendas || 0}
- Ticket Médio: R$ ${metrics.hotmart?.ticketMedio || 0}
- Receita Total: R$ ${metrics.hotmart?.receita || 0}
- Taxa de Conversão: ${metrics.hotmart?.conversao || 0}%

Retorne APENAS um JSON válido no formato:
{
  "suggestions": [
    {
      "type": "success|warning|info|error",
      "title": "Título curto",
      "description": "Descrição prática e acionável",
      "priority": "high|medium|low"
    }
  ]
}

Foque em:
1. Identificar problemas críticos
2. Sugerir otimizações específicas
3. Destacar pontos positivos
4. Propor testes A/B ou ajustes de estratégia`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um consultor especializado em marketing digital e funis de vendas. Sempre responda em português do Brasil com sugestões práticas.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    })

    const response = completion.choices[0].message.content
    const aiSuggestions = JSON.parse(response || '{"suggestions": []}')

    return NextResponse.json({
      suggestions: aiSuggestions.suggestions || [],
      mode: 'ai',
      model: 'gpt-4o',
    })
  } catch (error: any) {
    console.error('Erro ao gerar sugestões de IA:', error)
    
    // Fallback para sugestões demo em caso de erro
    return NextResponse.json({
      suggestions: [
        {
          type: 'info',
          title: '🤖 IA Temporariamente Indisponível',
          description: 'Configure sua chave OpenAI nas variáveis de ambiente para ativar sugestões personalizadas por IA.',
          priority: 'low',
        },
        {
          type: 'warning',
          title: '📊 Analise suas Métricas',
          description: 'Compare seus resultados semanalmente para identificar tendências e oportunidades de melhoria.',
          priority: 'medium',
        },
      ],
      mode: 'fallback',
      error: error.message,
    })
  }
}
