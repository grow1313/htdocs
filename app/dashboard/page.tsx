"use client";
import UserMenu from '@/components/UserMenu'

import { useEffect, useState } from 'react'
import { MessageCircle, TrendingUp, DollarSign, ArrowRight, Lightbulb, Users, ShoppingCart, CheckCircle, XCircle, Settings, Download, Calendar } from 'lucide-react'
import DateFilter from '@/components/DateFilter'
import PeriodComparison from '@/components/PeriodComparison'
import AlertSystem, { Alert } from '@/components/AlertSystem'
import ROICalculator from '@/components/ROICalculator'
import AISuggestions from '@/components/AISuggestions'
import TrendChart from '@/components/charts/TrendChart'
import ComparisonChart from '@/components/charts/ComparisonChart'
import FunnelVisualization from '@/components/charts/FunnelVisualization'
import GoalsTracker from '@/components/GoalsTracker'
import NotificationCenter from '@/components/NotificationCenter'
import CampaignSelector from '@/components/CampaignSelector'
import ThemeToggle from '@/components/ThemeToggle'
import Link from 'next/link'

export default function Dashboard() {
      // ...
    // Buscar dados reais do Facebook
    const fetchFacebookMetrics = async () => {
      try {
        setLoadingFacebook(true)
          const periodMap: Record<string, string> = {
            'today': 'today',
            '7days': 'last_7d',
            '30days': 'last_30d',
          }
          const period = periodMap[selectedPeriod] || 'last_30d'
          let url = `/api/facebook/metrics?period=${period}`
        if (selectedCampaign) {
          url += `&campaignId=${selectedCampaign}`
        }
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setFacebookData(data)
        } else {
          // Dados mock
          setFacebookData({
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
      } catch (error) {
        console.error('Erro ao buscar métricas Facebook:', error)
        // Dados mock
        setFacebookData({
          cpm: 'R$ 45.20',
          roi: '3.2x',
          cpc: 'R$ 2.15',
          impressoes: '125.4k',
          cliques: 1854,
          gastos: 'R$ 3.987',
          ctr: '1.48%',
          frequencia: '2.3',
          connected: false,
        })
      } finally {
        setLoadingFacebook(false)
      }
    }
  const [viewMode, setViewMode] = useState<'produtor' | 'gestor'>('produtor')
  const [selectedPeriod, setSelectedPeriod] = useState('7days')
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' })
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  const [selectedCampaignName, setSelectedCampaignName] = useState<string>('Todas as Campanhas')
  const [whatsappData, setWhatsappData] = useState<any>(null)
  const [facebookData, setFacebookData] = useState<any>(null)
  const [hotmartData, setHotmartData] = useState<any>(null)
  const [loadingWhatsApp, setLoadingWhatsApp] = useState(true)
  const [loadingFacebook, setLoadingFacebook] = useState(true)
  const [loadingHotmart, setLoadingHotmart] = useState(true)
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'CPC Acima da Meta',
      message: 'Seu CPC está em R$ 2.15, acima da meta de R$ 2.00. Considere otimizar seus anúncios.',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'error',
      title: 'Muitos Checkouts Abandonados',
      message: '97 checkouts foram abandonados (28%). Configure recuperação de carrinho.',
      timestamp: new Date()
    }
  ])

  // Buscar dados reais do WhatsApp
  useEffect(() => {
    const fetchWhatsAppMetrics = async () => {
      try {
        setLoadingWhatsApp(true)
        const response = await fetch('/api/whatsapp/metrics')
        if (response.ok) {
          const data = await response.json()
          setWhatsappData(data)
        useEffect(() => {
          const fetchWhatsAppMetrics = async () => {
            try {
              setLoadingWhatsApp(true)
              const response = await fetch('/api/whatsapp/metrics')
              if (response.ok) {
                const data = await response.json()
                setWhatsappData(data)
              } else {
                // Se der erro, usa dados mock
                setWhatsappData({
                  conversasIniciadas: 0,
                  conversasNaoTerminadas: 0,
                  leadsQualificados: 0,
                  mediaConversasDia: 0,
                  taxaResposta: '0%',
                  tempoMedioResposta: '0min',
                })
              }
            } catch (error) {
              console.error('Erro ao buscar métricas WhatsApp:', error)
              // Dados mock em caso de erro
              setWhatsappData({
                conversasIniciadas: 1245,
                conversasNaoTerminadas: 458,
                leadsQualificados: 342,
                mediaConversasDia: 178,
                taxaResposta: '73%',
                tempoMedioResposta: '4.2min',
              })
            } finally {
              setLoadingWhatsApp(false)
            }
          }
          fetchWhatsAppMetrics()
          // Atualizar a cada 30 segundos
          const interval = setInterval(fetchWhatsAppMetrics, 30000)
          return () => clearInterval(interval)
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

  // Mapeamento de períodos para API do Facebook
  const periodMap: Record<string, string> = {
    'today': 'today',
    '7days': 'last_7d',
    '30days': 'last_30d',
  }
  const period = periodMap[selectedPeriod] || 'last_30d'

  // Adiciona campaignId à URL se uma campanha específica estiver selecionada
  // Se selectedCampaign for null, busca dados de todas as campanhas (agregado)
  const campaignParam = selectedCampaign ? `&campaignId=${selectedCampaign}` : ''
  // ...restante do código...
        } else {
          // Dados mock
          setFacebookData({
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
      } catch (error) {
        console.error('Erro ao buscar métricas Facebook:', error)
        // Dados mock
        setFacebookData({
          cpm: 'R$ 45.20',
          roi: '3.2x',
          cpc: 'R$ 2.15',
          impressoes: '125.4k',
          cliques: 1854,
          gastos: 'R$ 3.987',
          ctr: '1.48%',
          frequencia: '2.3',
          connected: false,
        })
      } finally {
        setLoadingFacebook(false)
      }
    }

    fetchFacebookMetrics()
    // Atualizar quando mudar o período ou campanha
    const interval = setInterval(fetchFacebookMetrics, 60000) // 1 minuto
    return () => clearInterval(interval)
  }, [selectedPeriod, selectedCampaign])

  // Buscar dados reais do Hotmart
  useEffect(() => {
    const fetchHotmartMetrics = async () => {
      try {
        setLoadingHotmart(true)
        const response = await fetch('/api/hotmart/metrics')
        if (response.ok) {
          const data = await response.json()
          setHotmartData(data)
        } else {
          setHotmartData({
            checkoutsIniciados: 0,
            checkoutsNaoTerminados: 0,
            pagamentosConfirmados: 0,
            taxaConversaoCheckout: '0%',
            ticketMedio: 'R$ 0',
            faturamento: 'R$ 0',
            connected: false,
          })
        }
      } catch (error) {
        console.error('Erro ao buscar métricas Hotmart:', error)
        setHotmartData({
          checkoutsIniciados: 342,
          checkoutsNaoTerminados: 97,
          pagamentosConfirmados: 245,
          taxaConversaoCheckout: '71.6%',
          ticketMedio: 'R$ 147',
          faturamento: 'R$ 36.015',
          connected: false,
        })
      } finally {
        setLoadingHotmart(false)
      }
    }

    fetchHotmartMetrics()
    const interval = setInterval(fetchHotmartMetrics, 60000) // 1 minuto
    return () => clearInterval(interval)
  }, [])

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  // Dados para comparação
  const comparisonData = {
    current: {
      vendas: 245,
      faturamento: 36015,
      leads: 1245,
      conversao: 19.7
    },
    previous: {
      vendas: 198,
      faturamento: 29106,
      leads: 1089,
      conversao: 18.2
    }
  }

  const handleExportPDF = async () => {
    try {
      const startDate = customDateRange.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      const endDate = customDateRange.end || new Date().toISOString()
      
      const url = `/api/reports/export-pdf?startDate=${startDate}&endDate=${endDate}`
      
      // Abrir PDF em nova aba
      window.open(url, '_blank')
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      alert('Erro ao gerar relatório. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sistema de Alertas */}
      <AlertSystem alerts={alerts} onDismiss={dismissAlert} />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-whatsapp-light" />
              <div>
                <h1 className="text-lg font-bold dark:text-white">Dashboard - Funil de Vendas</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Visão completa do seu lançamento</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Central de Notificações */}
              <NotificationCenter />

              {/* Botão Webhooks */}
              <Link
                href="/webhooks"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                🔔 Webhooks
              </Link>

              {/* Botão Analytics */}
              <Link
                href="/analytics"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                📊 Analytics
              </Link>

              {/* Botão Exportar */}
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <Download className="w-3 h-3" />
                PDF
              </button>

              {/* Botão Configurações */}
              <Link
                href="/settings"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <Settings className="w-3 h-3" />
                Config
              </Link>

              {/* Toggle Dark Mode */}
              <ThemeToggle />

              {/* Seletor de Modo */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('produtor')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                    viewMode === 'produtor'
                      ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Produtor
                </button>
                <button
                  onClick={() => setViewMode('gestor')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                    viewMode === 'gestor'
                      ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  Gestor
                </button>
              </div>
              
              {/* Área do usuário com botão de sair */}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        {/* Filtro de Data */}
        <div className="mb-4">
          <DateFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            customDateRange={customDateRange}
            onCustomDateChange={(start, end) => setCustomDateRange({ start, end })}
          />
        </div>

        {/* Seletor de Campanha */}
        <div className="mb-6">
          <CampaignSelector 
            onSelectCampaign={(campaignId, campaignName) => {
              setSelectedCampaign(campaignId)
              setSelectedCampaignName(campaignName || 'Todas as Campanhas')
            }}
          />
        </div>

        {/* Comparação de Períodos */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <PeriodComparison
            current={comparisonData.current.vendas}
            previous={comparisonData.previous.vendas}
            label="Vendas"
            format="number"
          />
          <PeriodComparison
            current={comparisonData.current.faturamento}
            previous={comparisonData.previous.faturamento}
            label="Faturamento"
            format="currency"
          />
          <PeriodComparison
            current={comparisonData.current.leads}
            previous={comparisonData.previous.leads}
            label="Leads Gerados"
            format="number"
          />
          <PeriodComparison
            current={comparisonData.current.conversao}
            previous={comparisonData.previous.conversao}
            label="Taxa Conversão"
            format="percentage"
          />
        </div>

        {/* Cards Conectados em Fluxo - Facebook, WhatsApp, Hotmart */}
        <div className="flex items-start justify-center gap-2 mb-4 overflow-x-auto pb-2">
          
          {/* FACEBOOK ADS */}
          <div className="flex-shrink-0 w-64">
            <div className="bg-white dark:bg-gray-800 border-2 border-blue-400 dark:border-blue-500 rounded-lg shadow-lg overflow-hidden transition-colors">
              {/* Header */}
              <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-2 border-b border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-gray-600">dados</div>
                    <div className="text-sm font-bold text-blue-600">facebook</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-500">Campanha:</div>
                    <div className="text-xs font-semibold text-blue-700 max-w-[120px] truncate" title={selectedCampaignName}>
                      {selectedCampaignName}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Conteúdo */}
              <div className="p-3">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">f</span>
                  </div>
                </div>
                
                {/* Métricas */}
                {loadingFacebook ? (
                  <div className="text-center py-4">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Carregando...</p>
                  </div>
                ) : facebookData ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                        <div className="text-[10px] text-gray-600 dark:text-gray-400">CPM</div>
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{facebookData.cpm}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                        <div className="text-[10px] text-gray-600 dark:text-gray-400">ROI</div>
                        <div className="text-sm font-bold text-green-600 dark:text-green-400">{facebookData.roi}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                        <div className="text-[10px] text-gray-600 dark:text-gray-400">CPC</div>
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{facebookData.cpc}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                        <div className="text-[10px] text-gray-600 dark:text-gray-400">CTR</div>
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{facebookData.ctr}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                        <div className="text-[10px] text-gray-600 dark:text-gray-400">Impressões</div>
                        <div className="text-xs font-bold dark:text-white">{facebookData.impressoes}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                        <div className="text-[10px] text-gray-600 dark:text-gray-400">Cliques</div>
                        <div className="text-xs font-bold dark:text-white">{facebookData.cliques}</div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                      <div className="text-[10px] text-gray-600 dark:text-gray-400">Total Investido</div>
                      <div className="text-lg font-bold text-blue-700 dark:text-blue-400">{facebookData.gastos}</div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600">Nenhum dado disponível</p>
                    <Link href="/facebook-connect" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                      Conectar Facebook Ads
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Sugestão */}
              <div className="border-t-2 border-blue-400 dark:border-blue-500 bg-yellow-50 dark:bg-yellow-900/20 p-2">
                <div className="flex items-start gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Sugestão:</span> Seu CPC está acima da média. Teste novos criativos.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seta */}
          <div className="flex items-center justify-center h-96">
            <ArrowRight className="w-8 h-8 text-gray-400" />
          </div>

          {/* WHATSAPP */}
          <div className="flex-shrink-0 w-64">
            <div className="bg-white dark:bg-gray-800 border-2 border-green-400 dark:border-green-500 rounded-lg shadow-lg overflow-hidden transition-colors">
              {/* Header */}
              <div className="bg-green-50 dark:bg-green-900/30 px-3 py-2 border-b border-green-200 dark:border-green-700">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">dados</div>
                <div className="text-sm font-bold text-green-600 dark:text-green-400">whatsapp</div>
              </div>
              
              {/* Conteúdo */}
              <div className="p-3">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-green-600 dark:text-green-400">W</span>
                  </div>
                </div>
                
                {/* Métricas */}
                <div className="space-y-2 mb-2">
                  {loadingWhatsApp ? (
                    <div className="text-center py-4">
                      <div className="animate-spin w-6 h-6 border-2 border-green-600 dark:border-green-400 border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Carregando...</p>
                    </div>
                  ) : whatsappData ? (
                    <>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                        <div className="text-[10px] text-gray-600 dark:text-gray-400">Conversas Iniciadas</div>
                        <div className="text-sm font-bold text-green-600 dark:text-green-400">{whatsappData.conversasIniciadas}</div>
                      </div>
                      
                      <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded border border-red-200 dark:border-red-700">
                        <div className="flex items-center gap-1 mb-1">
                          <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                          <span className="text-[10px] text-gray-600 dark:text-gray-400">Não Terminadas</span>
                        </div>
                        <div className="text-sm font-bold text-red-600 dark:text-red-400">{whatsappData.conversasNaoTerminadas}</div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded border border-green-200 dark:border-green-700">
                        <div className="flex items-center gap-1 mb-1">
                          <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                          <span className="text-[10px] text-gray-600 dark:text-gray-400">Leads Qualificados</span>
                        </div>
                        <div className="text-sm font-bold text-green-600 dark:text-green-400">{whatsappData.leadsQualificados}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                          <div className="text-[10px] text-gray-600 dark:text-gray-400">Média/Dia</div>
                          <div className="text-sm font-bold dark:text-white">{whatsappData.mediaConversasDia}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                          <div className="text-[10px] text-gray-600 dark:text-gray-400">Taxa Resp.</div>
                          <div className="text-sm font-bold dark:text-white">{whatsappData.taxaResposta}</div>
                        </div>
                      </div>
                </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Nenhum dado disponível</p>
                      <Link href="/whatsapp-connect" className="text-sm text-green-600 dark:text-green-400 hover:underline mt-2 inline-block">
                        Conectar WhatsApp
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sugestão */}
              <div className="border-t-2 border-green-400 dark:border-green-500 bg-yellow-50 dark:bg-yellow-900/20 p-2">
                <div className="flex items-start gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Sugestão:</span> Configure follow-up automático.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seta */}
          <div className="flex items-center justify-center h-96">
            <ArrowRight className="w-8 h-8 text-gray-400 dark:text-gray-600" />
          </div>

          {/* HOTMART - Checkout e Pagamento */}
          <div className="flex-shrink-0 w-64">
            <div className="bg-white dark:bg-gray-800 border-2 border-orange-400 dark:border-orange-500 rounded-lg shadow-lg overflow-hidden transition-colors">
              {/* Header */}
              <div className="bg-orange-50 dark:bg-orange-900/30 px-3 py-2 border-b border-orange-200 dark:border-orange-700">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">dados</div>
                <div className="text-sm font-bold text-orange-600 dark:text-orange-400">hotmart</div>
              </div>
              
              {/* Conteúdo */}
              <div className="p-3">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {/* Checkout */}
                  <div className="text-center">
                    <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-1">
                      <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">ch</span>
                    </div>
                    <div className="text-[10px] text-gray-600 dark:text-gray-400">Checkout</div>
                  </div>
                  
                  {/* Pagamento */}
                  <div className="text-center">
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-1">
                      <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-[10px] text-gray-600 dark:text-gray-400">Pagamento</div>
                  </div>
                </div>
                
                {/* Métricas */}
                {loadingHotmart ? (
                  <div className="text-center py-4">
                    <div className="animate-spin w-6 h-6 border-2 border-orange-600 dark:border-orange-400 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Carregando...</p>
                  </div>
                ) : hotmartData ? (
                  <>
                    <div className="space-y-2 mb-2">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                        <div className="text-[10px] text-gray-600 dark:text-gray-400">Checkouts Iniciados</div>
                        <div className="text-sm font-bold text-orange-600 dark:text-orange-400">{hotmartData.checkoutsIniciados}</div>
                      </div>
                      
                      <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded border border-red-200 dark:border-red-700">
                        <div className="flex items-center gap-1 mb-1">
                          <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                          <span className="text-[10px] text-gray-600 dark:text-gray-400">Checkouts Abandonados</span>
                        </div>
                        <div className="text-sm font-bold text-red-600 dark:text-red-400">{hotmartData.checkoutsNaoTerminados}</div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded border border-green-200 dark:border-green-700">
                        <div className="flex items-center gap-1 mb-1">
                          <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                          <span className="text-[10px] text-gray-600 dark:text-gray-400">Pagamentos Confirmados</span>
                        </div>
                        <div className="text-sm font-bold text-green-600 dark:text-green-400">{hotmartData.pagamentosConfirmados}</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                          <div className="text-[10px] text-gray-600 dark:text-gray-400">Taxa Conv.</div>
                          <div className="text-sm font-bold text-orange-600 dark:text-orange-400">{hotmartData.taxaConversaoCheckout}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                          <div className="text-[10px] text-gray-600 dark:text-gray-400">Ticket Médio</div>
                          <div className="text-sm font-bold dark:text-white">{hotmartData.ticketMedio}</div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded border-2 border-green-400 dark:border-green-600">
                        <div className="text-[10px] text-gray-600 dark:text-gray-400">Faturamento Total</div>
                        <div className="text-lg font-bold text-green-700 dark:text-green-400">{hotmartData.faturamento}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Nenhum dado disponível</p>
                    <Link href="/hotmart-connect" className="text-sm text-orange-600 dark:text-orange-400 hover:underline mt-2 inline-block">
                      Conectar Hotmart
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Sugestão */}
              <div className="border-t-2 border-orange-400 dark:border-orange-500 bg-yellow-50 dark:bg-yellow-900/20 p-2">
                <div className="flex items-start gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Sugestão:</span> Configure recuperação de carrinho.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sistema de Metas + Calculadora de ROI lado a lado */}
          <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch mb-8 min-h-[480px]">
            <div className="flex-1 flex h-full">
              <GoalsTracker metrics={{ whatsapp: whatsappData, facebook: facebookData, hotmart: hotmartData }} />
            </div>
            <div className="flex-1 flex h-full">
              <ROICalculator faturamento={36015} gastosAds={3987} custoProduto={50} vendas={245} />
            </div>
          </div>

        {/* Resumo Geral */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-700 dark:to-green-700 text-white rounded-xl shadow-lg p-6 transition-colors">
          <h2 className="text-2xl font-bold mb-4">Resumo do Funil</h2>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-sm opacity-90">Pessoas Alcançadas</div>
              <div className="text-3xl font-bold">125.4k</div>
            </div>
            <div>
              <div className="text-sm opacity-90">Conversas Iniciadas</div>
              <div className="text-3xl font-bold">1,245</div>
            </div>
            <div>
              <div className="text-sm opacity-90">Leads Qualificados</div>
              <div className="text-3xl font-bold">342</div>
            </div>
            <div>
              <div className="text-sm opacity-90">Vendas Confirmadas</div>
              <div className="text-3xl font-bold">245</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/30">
            <div className="flex justify-between items-center">
              <span className="text-sm">Taxa de Conversão Geral (Impressão → Venda)</span>
              <span className="text-2xl font-bold">0.19%</span>
            </div>
          </div>
        </div>

        {/* Sugestões de IA */}
        <div className="mt-6">
          <AISuggestions
            metrics={{
              whatsapp: whatsappData,
              facebook: facebookData,
              hotmart: hotmartData,
            }}
          />
        </div>

        {/* Seção de Analytics com Gráficos */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Analytics Avançados</h2>
          
          {/* Gráficos de Tendência */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TrendChart
              title="Tendência de Vendas (Últimos 7 dias)"
              data={[
                { date: '17/01', vendas: 28, receita: 8316 },
                { date: '18/01', vendas: 32, receita: 9520 },
                { date: '19/01', vendas: 35, receita: 10412 },
                { date: '20/01', vendas: 31, receita: 9222 },
                { date: '21/01', vendas: 38, receita: 11305 },
                { date: '22/01', vendas: 42, receita: 12495 },
                { date: '23/01', vendas: 39, receita: 11604 },
              ]}
              lines={[
                { dataKey: 'vendas', name: 'Vendas', color: '#10b981' },
                { dataKey: 'receita', name: 'Receita (R$)', color: '#3b82f6' },
              ]}
            />

            <TrendChart
              title="Performance de Campanhas"
              data={[
                { date: '17/01', cliques: 242, conversoes: 28 },
                { date: '18/01', cliques: 268, conversoes: 32 },
                { date: '19/01', cliques: 289, conversoes: 35 },
                { date: '20/01', cliques: 255, conversoes: 31 },
                { date: '21/01', cliques: 312, conversoes: 38 },
                { date: '22/01', cliques: 345, conversoes: 42 },
                { date: '23/01', cliques: 321, conversoes: 39 },
              ]}
              lines={[
                { dataKey: 'cliques', name: 'Cliques', color: '#6366f1' },
                { dataKey: 'conversoes', name: 'Conversões', color: '#ec4899' },
              ]}
            />
          </div>

          {/* Gráfico de Comparação */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ComparisonChart
              title="Comparação por Canal"
              data={[
                { name: 'Facebook Ads', investimento: 3987, retorno: 36015 },
                { name: 'Google Ads', investimento: 2450, retorno: 18200 },
                { name: 'Instagram', investimento: 1850, retorno: 12400 },
              ]}
              bars={[
                { dataKey: 'investimento', name: 'Investimento (R$)', color: '#ef4444' },
                { dataKey: 'retorno', name: 'Retorno (R$)', color: '#10b981' },
              ]}
            />

            <ComparisonChart
              title="Métricas por Produto"
              data={[
                { name: 'Produto A', vendas: 124, ticketMedio: 297 },
                { name: 'Produto B', vendas: 89, ticketMedio: 450 },
                { name: 'Produto C', vendas: 32, ticketMedio: 189 },
              ]}
              bars={[
                { dataKey: 'vendas', name: 'Vendas', color: '#8b5cf6' },
                { dataKey: 'ticketMedio', name: 'Ticket Médio (R$)', color: '#f59e0b' },
              ]}
            />
          </div>

          {/* Visualização do Funil */}
          <div className="mb-6">
            <FunnelVisualization
              title="Funil de Conversão Completo"
              stages={[
                { name: 'Impressões', value: 125400, color: '#3b82f6', icon: '👁️' },
                { name: 'Cliques no Anúncio', value: 2341, color: '#6366f1', icon: '👆' },
                { name: 'Conversas WhatsApp', value: 1247, color: '#10b981', icon: '💬' },
                { name: 'Checkouts Iniciados', value: 342, color: '#f59e0b', icon: '🛒' },
                { name: 'Vendas Confirmadas', value: 245, color: '#ec4899', icon: '✅' },
              ]}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
