import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const endDate = searchParams.get('endDate') || new Date().toISOString()

    // Buscar dados das integrações
    const [whatsappIntegration, metaIntegration, hotmartIntegration] = await Promise.all([
      prisma.integration.findFirst({
        where: { userId: session.user.id, platform: 'WHATSAPP', isActive: true },
      }),
      prisma.integration.findFirst({
        where: { userId: session.user.id, platform: 'META_ADS', isActive: true },
      }),
      prisma.integration.findFirst({
        where: { userId: session.user.id, platform: 'HOTMART', isActive: true },
      }),
    ])

    // Dados mockados das métricas
    const whatsappData = {
      conversas: 1247,
      mensagensEnviadas: 3521,
      mensagensRecebidas: 2894,
      taxaResposta: 87.3,
    }

    const facebookData = {
      impressoes: 45230,
      cliques: 2341,
      ctr: 5.17,
      custoTotal: 1250.0,
      cpc: 0.53,
    }

    const hotmartData = {
      vendas: 89,
      ticketMedio: 297.5,
      receitaTotal: 26477.5,
      conversao: 3.8,
    }

    // Criar PDF
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.setTextColor(59, 130, 246) // blue-500
    doc.text('Relatório de Métricas', 14, 20)
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Período: ${new Date(startDate).toLocaleDateString('pt-BR')} - ${new Date(endDate).toLocaleDateString('pt-BR')}`, 14, 28)
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 34)
    doc.text(`Usuário: ${session.user.email}`, 14, 40)

    let yPosition = 50

    // WhatsApp Section
    if (whatsappIntegration) {
      doc.setFontSize(14)
      doc.setTextColor(34, 197, 94) // green-500
      doc.text('📱 WhatsApp', 14, yPosition)
      
      yPosition += 10

      autoTable(doc, {
        startY: yPosition,
        head: [['Métrica', 'Valor']],
        body: [
          ['Conversas Ativas', whatsappData.conversas.toLocaleString('pt-BR')],
          ['Mensagens Enviadas', whatsappData.mensagensEnviadas.toLocaleString('pt-BR')],
          ['Mensagens Recebidas', whatsappData.mensagensRecebidas.toLocaleString('pt-BR')],
          ['Taxa de Resposta', `${whatsappData.taxaResposta}%`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94] },
      })

      yPosition = (doc as any).lastAutoTable.finalY + 15
    }

    // Facebook Ads Section
    if (metaIntegration) {
      doc.setFontSize(14)
      doc.setTextColor(59, 130, 246) // blue-500
      doc.text('📊 Facebook Ads', 14, yPosition)
      
      yPosition += 10

      autoTable(doc, {
        startY: yPosition,
        head: [['Métrica', 'Valor']],
        body: [
          ['Impressões', facebookData.impressoes.toLocaleString('pt-BR')],
          ['Cliques', facebookData.cliques.toLocaleString('pt-BR')],
          ['CTR (Taxa de Cliques)', `${facebookData.ctr}%`],
          ['Custo Total', `R$ ${facebookData.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
          ['CPC (Custo por Clique)', `R$ ${facebookData.cpc.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
      })

      yPosition = (doc as any).lastAutoTable.finalY + 15
    }

    // Hotmart Section
    if (hotmartIntegration) {
      // Adicionar nova página se necessário
      if (yPosition > 220) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.setTextColor(249, 115, 22) // orange-500
      doc.text('💰 Hotmart', 14, yPosition)
      
      yPosition += 10

      autoTable(doc, {
        startY: yPosition,
        head: [['Métrica', 'Valor']],
        body: [
          ['Total de Vendas', hotmartData.vendas.toLocaleString('pt-BR')],
          ['Ticket Médio', `R$ ${hotmartData.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
          ['Receita Total', `R$ ${hotmartData.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
          ['Taxa de Conversão', `${hotmartData.conversao}%`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [249, 115, 22] },
      })

      yPosition = (doc as any).lastAutoTable.finalY + 15
    }

    // Resumo Geral
    if (yPosition > 200) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(139, 92, 246) // purple-500
    doc.text('📈 Resumo Geral', 14, yPosition)
    
    yPosition += 10

    const roi = ((hotmartData.receitaTotal - facebookData.custoTotal) / facebookData.custoTotal) * 100
    const custoAquisicao = facebookData.custoTotal / hotmartData.vendas

    autoTable(doc, {
      startY: yPosition,
      head: [['Indicador', 'Valor']],
      body: [
        ['ROI (Retorno sobre Investimento)', `${roi.toFixed(2)}%`],
        ['CAC (Custo de Aquisição)', `R$ ${custoAquisicao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
        ['Conversão Geral', `${((hotmartData.vendas / facebookData.cliques) * 100).toFixed(2)}%`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246] },
    })

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    }

    // Gerar PDF como buffer
    const pdfBuffer = doc.output('arraybuffer')

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatório PDF' },
      { status: 500 }
    )
  }
}
