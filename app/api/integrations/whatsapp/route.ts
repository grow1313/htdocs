import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Conectar WhatsApp Business Account
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { accessToken, phoneNumberId, businessAccountId, webhookUrl } = await request.json()

    // Valida se já existe integração ativa
    const existingIntegration = await prisma.integration.findFirst({
      where: {
        userId: session.user.id,
        platform: 'WHATSAPP',
        isActive: true,
      },
    })

    if (existingIntegration) {
      // Atualiza integração existente
      const updated = await prisma.integration.update({
        where: { id: existingIntegration.id },
        data: {
          accessToken,
          config: JSON.stringify({
            phoneNumberId,
            businessAccountId,
            webhookUrl,
            connectedAt: new Date().toISOString(),
          }),
        },
      })
      return NextResponse.json({ success: true, integration: updated, action: 'updated' })
    }

    // Cria nova integração
    const integration = await prisma.integration.create({
      data: {
        userId: session.user.id,
        platform: 'WHATSAPP',
        accessToken: accessToken || 'demo-token-' + Date.now(),
        config: JSON.stringify({
          phoneNumberId: phoneNumberId || 'demo',
          businessAccountId: businessAccountId || 'demo',
          webhookUrl: webhookUrl || 'demo',
          connectedAt: new Date().toISOString(),
        }),
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, integration, action: 'created' })
  } catch (error) {
    console.error('Erro ao conectar WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erro ao conectar WhatsApp' },
      { status: 500 }
    )
  }
}

// Verificação do Webhook (GET) - Meta usa isso para verificar o endpoint
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  console.log('Webhook verification:', { mode, token: token?.substring(0, 10) + '...' })

  // Verificação do webhook pela Meta
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('✅ Webhook verificado com sucesso')
    return new NextResponse(challenge, { status: 200 })
  }

  console.error('❌ Falha na verificação do webhook')
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// Processar mensagens recebidas via Webhook (PUT)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    
    console.log('📩 Webhook recebido:', JSON.stringify(body, null, 2))

    // Estrutura do webhook do WhatsApp Cloud API
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    if (!value) {
      return NextResponse.json({ success: true, message: 'No value in webhook' })
    }

    // Processar mensagens recebidas
    if (value.messages && value.messages.length > 0) {
      for (const message of value.messages) {
        await processIncomingMessage(message, value.metadata)
      }
    }

    // Processar status de mensagens enviadas
    if (value.statuses && value.statuses.length > 0) {
      for (const status of value.statuses) {
        await processMessageStatus(status, value.metadata)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao processar webhook WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}

// Processar mensagem recebida
async function processIncomingMessage(message: any, metadata: any) {
  try {
    const phoneNumberId = metadata.phone_number_id
    const from = message.from // número do cliente
    const messageId = message.id
    const timestamp = parseInt(message.timestamp) * 1000
    const messageType = message.type
    const messageBody = message.text?.body || message.interactive?.button_reply?.title || ''

    console.log('📨 Mensagem recebida:', { from, messageType, messageBody })

    // Buscar integração ativa
    const integration = await prisma.integration.findFirst({
      where: {
        platform: 'WHATSAPP',
        isActive: true,
      },
    })

    if (!integration) {
      console.warn('Nenhuma integração WhatsApp ativa encontrada')
      return
    }

    const config = typeof integration.config === 'string' 
      ? JSON.parse(integration.config) 
      : integration.config

    if (config.phoneNumberId !== phoneNumberId) {
      console.warn('Phone number ID não corresponde')
      return
    }

    // Buscar ou criar funil padrão do usuário
    let funnel = await prisma.funnel.findFirst({
      where: { userId: integration.userId },
      include: { stages: true },
    })

    if (!funnel) {
      // Criar funil padrão
      funnel = await prisma.funnel.create({
        data: {
          userId: integration.userId,
          name: 'Funil Principal',
          description: 'Funil de vendas criado automaticamente',
          stages: {
            create: [
              { name: 'Lead', order: 1 },
              { name: 'Qualificado', order: 2 },
              { name: 'Negociação', order: 3 },
              { name: 'Fechado', order: 4 },
            ],
          },
        },
        include: { stages: true },
      })
    }

    // Verificar se já existe conversa ativa para este número
    let existingEvent = await prisma.funnelEvent.findFirst({
      where: {
        funnelId: funnel.id,
        metadata: {
          path: '$.whatsappNumber',
          equals: from,
        },
      },
      orderBy: { timestamp: 'desc' },
    })

    if (existingEvent) {
      // Atualizar evento existente - adicionar interação
      const currentMetadata = typeof existingEvent.metadata === 'string'
        ? JSON.parse(existingEvent.metadata)
        : existingEvent.metadata

      const interactions = currentMetadata.interactions || []
      interactions.push({
        messageId,
        type: messageType,
        body: messageBody,
        timestamp: new Date(timestamp).toISOString(),
        direction: 'inbound',
      })

      await prisma.funnelEvent.update({
        where: { id: existingEvent.id },
        data: {
          metadata: JSON.stringify({
            ...currentMetadata,
            interactions,
            lastInteraction: new Date(timestamp).toISOString(),
            messageCount: interactions.length,
          }),
        },
      })

      console.log('✅ Conversa atualizada:', from)
    } else {
      // Criar novo evento - nova conversa iniciada
      const leadStage = funnel.stages.find((s: any) => s.order === 1)
      
      await prisma.funnelEvent.create({
        data: {
          funnelId: funnel.id,
          stageId: leadStage!.id,
          eventType: 'whatsapp_conversation_started',
          timestamp: new Date(timestamp),
          metadata: JSON.stringify({
            whatsappNumber: from,
            phoneNumberId,
            interactions: [{
              messageId,
              type: messageType,
              body: messageBody,
              timestamp: new Date(timestamp).toISOString(),
              direction: 'inbound',
            }],
            firstContact: new Date(timestamp).toISOString(),
            lastInteraction: new Date(timestamp).toISOString(),
            messageCount: 1,
            source: 'whatsapp',
          }),
        },
      })

      console.log('✅ Nova conversa criada:', from)
    }
  } catch (error) {
    console.error('Erro ao processar mensagem recebida:', error)
  }
}

// Processar status de mensagem enviada
async function processMessageStatus(status: any, metadata: any) {
  try {
    const messageId = status.id
    const statusType = status.status // sent, delivered, read, failed
    const timestamp = parseInt(status.timestamp) * 1000
    const recipient = status.recipient_id

    console.log('📊 Status de mensagem:', { messageId, statusType, recipient })

    // Aqui você pode atualizar o status das mensagens enviadas
    // Por exemplo, marcar como lida, entregue, etc.
  } catch (error) {
    console.error('Erro ao processar status de mensagem:', error)
  }
}
