import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cache, generateCacheKey, CacheTTL } from '@/lib/cache'

// Buscar métricas do WhatsApp para o dashboard
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar cache
    const cacheKey = generateCacheKey(session.user.id, 'whatsapp-metrics')
    const cached = cache.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Buscar funil do usuário
    const funnel = await prisma.funnel.findFirst({
      where: { userId: session.user.id },
      include: { stages: true },
    })

    if (!funnel) {
      return NextResponse.json({
        conversasIniciadas: 0,
        conversasNaoTerminadas: 0,
        leadsQualificados: 0,
        mediaConversasDia: 0,
        taxaResposta: '0%',
        tempoMedioResposta: '0min',
      })
    }

    const now = new Date()
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Total de conversas iniciadas (últimos 30 dias)
    const conversasIniciadas = await prisma.funnelEvent.count({
      where: {
        funnelId: funnel.id,
        eventType: 'whatsapp_conversation_started',
        timestamp: {
          gte: last30Days,
        },
      },
    })

    // Conversas nos últimos 7 dias para calcular média/dia
    const conversasUltimos7Dias = await prisma.funnelEvent.count({
      where: {
        funnelId: funnel.id,
        eventType: 'whatsapp_conversation_started',
        timestamp: {
          gte: last7Days,
        },
      },
    })

    const mediaConversasDia = Math.round(conversasUltimos7Dias / 7)

    // Buscar todas as conversas para análise
    const allConversations = await prisma.funnelEvent.findMany({
      where: {
        funnelId: funnel.id,
        eventType: 'whatsapp_conversation_started',
        timestamp: {
          gte: last30Days,
        },
      },
    })

    // Analisar conversas
    let conversasNaoTerminadas = 0
    let leadsQualificados = 0
    let totalResponseTimes = 0
    let responsesCount = 0

    for (const conversation of allConversations) {
      const metadata = typeof conversation.metadata === 'string'
        ? JSON.parse(conversation.metadata)
        : conversation.metadata

      const interactions = metadata.interactions || []
      
      // Conta conversas não terminadas (última interação há mais de 24h)
      if (metadata.lastInteraction) {
        const lastInteractionDate = new Date(metadata.lastInteraction)
        const hoursSinceLastInteraction = (now.getTime() - lastInteractionDate.getTime()) / (1000 * 60 * 60)
        
        if (hoursSinceLastInteraction > 24 && interactions.length < 5) {
          conversasNaoTerminadas++
        }
      }

      // Conta leads qualificados (conversas com mais de 3 interações)
      if (interactions.length >= 3) {
        leadsQualificados++
      }

      // Calcula tempo médio de resposta
      for (let i = 1; i < interactions.length; i++) {
        const prev = interactions[i - 1]
        const curr = interactions[i]
        
        // Se anterior foi do cliente (inbound) e atual foi nossa resposta (outbound)
        if (prev.direction === 'inbound' && curr.direction === 'outbound') {
          const prevTime = new Date(prev.timestamp).getTime()
          const currTime = new Date(curr.timestamp).getTime()
          const responseTime = (currTime - prevTime) / (1000 * 60) // em minutos
          
          totalResponseTimes += responseTime
          responsesCount++
        }
      }
    }

    const tempoMedioResposta = responsesCount > 0 
      ? Math.round(totalResponseTimes / responsesCount) 
      : 0

    const taxaResposta = conversasIniciadas > 0
      ? Math.round((responsesCount / conversasIniciadas) * 100)
      : 0

    const result = {
      conversasIniciadas,
      conversasNaoTerminadas,
      leadsQualificados,
      mediaConversasDia,
      taxaResposta: `${taxaResposta}%`,
      tempoMedioResposta: `${tempoMedioResposta}min`,
    }

    // Salvar no cache por 2 minutos
    cache.set(cacheKey, result, CacheTTL.MEDIUM)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao buscar métricas WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar métricas' },
      { status: 500 }
    )
  }
}
