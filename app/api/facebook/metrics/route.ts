import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getAdInsights } from '@/lib/facebook'
import { cache, generateCacheKey, CacheTTL } from '@/lib/cache'

// Buscar métricas do Facebook Ads para o dashboard
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'last_30d'
    const campaignId = searchParams.get('campaignId') || undefined

    // Verificar cache (incluindo campaignId na chave)
    const cacheKey = generateCacheKey(session.user.id, 'facebook-metrics', { period, campaignId })
    const cached = cache.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Buscar integração ativa
    const integration = await prisma.integration.findFirst({
      where: {
        userId: session.user.id,
        platform: 'META_ADS',
        isActive: true,
      },
    })

    if (!integration) {
      return NextResponse.json({
        cpm: 'R$ 0.00',
        roi: '0.0x',
        cpc: 'R$ 0.00',
        impressoes: '0',
        cliques: 0,
        gastos: 'R$ 0.00',
        ctr: '0%',
        frequencia: '0',
        connected: false,
      })
    }

    const config = typeof integration.config === 'string'
      ? JSON.parse(integration.config)
      : integration.config

    // Buscar insights da Meta Ads API (com ou sem filtro de campanha)
    const result = await getAdInsights(
      integration.accessToken,
      config.adAccountId,
      period,
      campaignId // Passa o ID da campanha se fornecido
    )

    if (!result.success || !result.data) {
      return NextResponse.json({
        cpm: 'R$ 0.00',
        roi: '0.0x',
        cpc: 'R$ 0.00',
        impressoes: '0',
        cliques: 0,
        gastos: 'R$ 0.00',
        ctr: '0%',
        frequencia: '0',
        connected: true,
        error: result.error,
      })
    }

    const data = result.data

    // Formatar valores
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)
    }

    const formatNumber = (value: number) => {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`
      }
      return value.toString()
    }

    // Calcular ROI estimado (baseado em conversões médias)
    // Aqui você pode integrar com dados reais de vendas do Hotmart
    const estimatedRevenue = data.clicks * 0.02 * 147 // 2% conversão, ticket médio R$147
    const roi = data.spend > 0 ? estimatedRevenue / data.spend : 0

    const response = {
      cpm: formatCurrency(data.cpm),
      roi: `${roi.toFixed(1)}x`,
      cpc: formatCurrency(data.cpc),
      impressoes: formatNumber(data.impressions),
      cliques: data.clicks,
      gastos: formatCurrency(data.spend),
      ctr: `${data.ctr.toFixed(2)}%`,
      frequencia: data.frequency.toFixed(1),
      connected: true,
      // Dados brutos para cálculos
      raw: {
        impressions: data.impressions,
        clicks: data.clicks,
        spend: data.spend,
        reach: data.reach,
      },
      data: {
        clicks: data.clicks,
        impressions: data.impressions,
        ctr: data.ctr,
        cpc: data.cpc,
        spend: data.spend,
      },
    }

    // Salvar no cache por 2 minutos
    cache.set(cacheKey, response, CacheTTL.MEDIUM)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Erro ao buscar métricas Facebook:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar métricas' },
      { status: 500 }
    )
  }
}
