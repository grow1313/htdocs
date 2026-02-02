import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// Conectar Hotmart (configurar webhook)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { hotmartId, webhookToken, email } = await request.json()

    if (!hotmartId || !webhookToken) {
      return NextResponse.json(
        { error: 'Hotmart ID e Webhook Token são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se já existe integração ativa
    const existingIntegration = await prisma.integration.findFirst({
      where: {
        userId: session.user.id,
        platform: 'HOTMART',
        isActive: true,
      },
    })

    if (existingIntegration) {
      // Atualizar integração existente
      const updated = await prisma.integration.update({
        where: { id: existingIntegration.id },
        data: {
          accessToken: webhookToken,
          config: JSON.stringify({
            hotmartId,
            email,
            connectedAt: new Date().toISOString(),
          }),
        },
      })
      return NextResponse.json({ success: true, integration: updated, action: 'updated' })
    }

    // Criar nova integração
    const integration = await prisma.integration.create({
      data: {
        userId: session.user.id,
        platform: 'HOTMART',
        accessToken: webhookToken, // Token para validar webhooks
        config: JSON.stringify({
          hotmartId,
          email,
          connectedAt: new Date().toISOString(),
        }),
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, integration, action: 'created' })
  } catch (error) {
    console.error('Erro ao conectar Hotmart:', error)
    return NextResponse.json(
      { error: 'Erro ao conectar Hotmart' },
      { status: 500 }
    )
  }
}

// Webhook da Hotmart - Recebe eventos de vendas (POST)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    console.log('📦 Webhook Hotmart recebido:', JSON.stringify(body, null, 2))

    // Estrutura do webhook Hotmart
    const event = body.event
    const data = body.data

    if (!event || !data) {
      return NextResponse.json({ success: true, message: 'No event data' })
    }

    // Validar webhook token (opcional)
    const hotmartSignature = request.headers.get('X-Hotmart-Hottok')
    
    // Tipos de eventos Hotmart:
    // PURCHASE_COMPLETE - Compra aprovada
    // PURCHASE_CANCELED - Compra cancelada
    // PURCHASE_REFUNDED - Compra reembolsada
    // PURCHASE_DELAYED - Pagamento em análise
    // PURCHASE_APPROVED - Compra aprovada (mesmo que COMPLETE)
    // PURCHASE_CHARGEBACK - Chargeback

    switch (event) {
      case 'PURCHASE_COMPLETE':
      case 'PURCHASE_APPROVED':
        await processPurchaseComplete(data)
        break
      case 'PURCHASE_CANCELED':
      case 'PURCHASE_REFUNDED':
        await processPurchaseCanceled(data)
        break
      case 'PURCHASE_DELAYED':
        await processPurchaseDelayed(data)
        break
      default:
        console.log(`Evento não tratado: ${event}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro no webhook Hotmart:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}

// Processar compra aprovada
async function processPurchaseComplete(data: any) {
  try {
    const buyerEmail = data.buyer?.email
    const buyerName = data.buyer?.name
    const productName = data.product?.name
    const productId = data.product?.id
    const transactionId = data.purchase?.transaction
    const price = data.purchase?.price?.value || 0
    const status = data.purchase?.status
    const approvedDate = data.purchase?.approved_date

    console.log('✅ Compra aprovada:', { buyerEmail, productName, price, transactionId })

    // Buscar integração Hotmart ativa
    const integration = await prisma.integration.findFirst({
      where: {
        platform: 'HOTMART',
        isActive: true,
      },
    })

    if (!integration) {
      console.warn('Nenhuma integração Hotmart ativa encontrada')
      return
    }

    // Buscar funil do usuário
    let funnel = await prisma.funnel.findFirst({
      where: { userId: integration.userId },
      include: { stages: true },
    })
    if (funnel && !funnel.stages) {
      funnel.stages = [];
    }

    if (!funnel) {
      // Criar funil padrão
      funnel = await prisma.funnel.create({
        data: {
          userId: integration.userId,
          name: 'Funil Principal',
          description: 'Funil de vendas criado automaticamente',
          startDate: new Date(),
          stages: {
            create: [
              { name: 'Lead', order: 1 },
              { name: 'Qualificado', order: 2 },
              { name: 'Checkout', order: 3 },
              { name: 'Pago', order: 4 },
            ],
          },
        },
        include: { stages: true },
      }) as typeof funnel & { stages: any[] }
    }

    // Estágio final (Pago)
    const paidStage = funnel.stages.find((s: any) => s.name === 'Pago') || funnel.stages[funnel.stages.length - 1]

    // Criar evento de venda
    await prisma.funnelEvent.create({
      data: {
        funnelId: funnel.id,
        stageId: paidStage.id,
        eventType: 'hotmart_purchase_complete',
        timestamp: approvedDate ? new Date(approvedDate * 1000) : new Date(),
        metadata: JSON.stringify({
          buyerEmail,
          buyerName,
          productName,
          productId,
          transactionId,
          price,
          status,
          approvedDate,
          source: 'hotmart',
        }),
      },
    })

    console.log('✅ Venda registrada no funil:', transactionId)
  } catch (error) {
    console.error('Erro ao processar compra aprovada:', error)
  }
}

// Processar compra cancelada/reembolsada
async function processPurchaseCanceled(data: any) {
  try {
    const transactionId = data.purchase?.transaction

    console.log('❌ Compra cancelada:', transactionId)

    // Buscar evento original e marcar como cancelado
    const existingEvent = await prisma.funnelEvent.findFirst({
      where: {
        eventType: 'hotmart_purchase_complete',
        metadata: {
          contains: transactionId,
        },
      },
    })

    if (existingEvent) {
      const metadata = typeof existingEvent.metadata === 'string'
        ? JSON.parse(existingEvent.metadata)
        : existingEvent.metadata

      await prisma.funnelEvent.update({
        where: { id: existingEvent.id },
        data: {
          metadata: JSON.stringify({
            ...metadata,
            status: 'canceled',
            canceledAt: new Date().toISOString(),
          }),
        },
      })
    }
  } catch (error) {
    console.error('Erro ao processar cancelamento:', error)
  }
}

// Processar compra em análise (checkout iniciado)
async function processPurchaseDelayed(data: any) {
  try {
    const buyerEmail = data.buyer?.email
    const transactionId = data.purchase?.transaction

    console.log('⏳ Checkout iniciado:', transactionId)

    const integration = await prisma.integration.findFirst({
      where: {
        platform: 'HOTMART',
        isActive: true,
      },
    })

    if (!integration) return

    const funnel = await prisma.funnel.findFirst({
      where: { userId: integration.userId },
      include: { stages: true },
    })

    if (!funnel) return

    // Estágio de Checkout
    const checkoutStage = funnel.stages.find((s: any) => s.name === 'Checkout') || funnel.stages[2]

    // Criar evento de checkout iniciado
    await prisma.funnelEvent.create({
      data: {
        funnelId: funnel.id,
        stageId: checkoutStage.id,
        eventType: 'hotmart_checkout_started',
        timestamp: new Date(),
        metadata: JSON.stringify({
          buyerEmail,
          transactionId,
          status: 'delayed',
          source: 'hotmart',
        }),
      },
    })
  } catch (error) {
    console.error('Erro ao processar checkout:', error)
  }
}

// Verificar status da integração (GET)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const integration = await prisma.integration.findFirst({
      where: {
        userId: session.user.id,
        platform: 'HOTMART',
        isActive: true,
      },
    })

    if (!integration) {
      return NextResponse.json({
        connected: false,
        message: 'Hotmart não conectado',
      })
    }

    const config = typeof integration.config === 'string'
      ? JSON.parse(integration.config)
      : integration.config

    return NextResponse.json({
      connected: true,
      hotmartId: config.hotmartId,
      email: config.email,
      connectedAt: config.connectedAt,
    })
  } catch (error) {
    console.error('Erro ao verificar Hotmart:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar integração' },
      { status: 500 }
    )
  }
}
