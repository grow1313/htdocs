'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle, Settings, Database, Bell, Link as LinkIcon, Save, Check, Facebook, ShoppingCart, ExternalLink } from 'lucide-react'

export default function ConfigPage() {
  const [saved, setSaved] = useState(false)
  const [integrations, setIntegrations] = useState({
    facebook: false,
    whatsapp: false,
    hotmart: false,
  })
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState({
    // Metas
    metaVendas: 100,
    metaFaturamento: 15000,
    metaLeads: 500,
    
    // Alertas
    alertaCPCAlto: 3.00,
    alertaTaxaConversaoBaixa: 5,
    alertaCheckoutAbandonado: 30,
    
    // Custos
    custoProduto: 50,
    
    // Notificações
    emailAlertas: true,
    whatsappAlertas: false,
  })

  // Verificar status das integrações
  useEffect(() => {
    const checkIntegrations = async () => {
      try {
        const [fbRes, waRes, hmRes] = await Promise.all([
          fetch('/api/integrations/meta'),
          fetch('/api/integrations/whatsapp'),
          fetch('/api/integrations/hotmart'),
        ])

        const [fbData, waData, hmData] = await Promise.all([
          fbRes.json(),
          waRes.json(),
          hmRes.json(),
        ])

        setIntegrations({
          facebook: fbData?.connected || false,
          whatsapp: waData?.connected || false,
          hotmart: hmData?.connected || false,
        })
      } catch (error) {
        console.error('Erro ao verificar integrações:', error)
      }
    };
    checkIntegrations();
  }, []);

  const handleSave = () => {
    // Aqui você salvaria no banco de dados
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <MessageCircle className="w-6 h-6 text-whatsapp-light" />
                <span className="text-sm">← Voltar ao Dashboard</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/analytics" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <span className="text-sm">📊 Analytics</span>
              </Link>
              <Settings className="w-8 h-8 text-gray-600" />
              <h1 className="text-2xl font-bold">Configurações</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Integrações */}
        <section className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Integrações</h2>
            </div>
            <Link
              href="/test-integrations"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              🧪 Testar Credenciais
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-gray-600 mt-2">Verificando integrações...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Facebook Ads */}
              <div className={`flex items-center justify-between p-4 border-2 rounded-lg transition ${
                integrations.facebook ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Facebook className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Meta / Facebook Ads</h3>
                      {integrations.facebook && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          ✓ Conectado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {integrations.facebook 
                        ? 'Sua conta de anúncios está conectada' 
                        : 'Conecte sua conta de anúncios do Facebook'}
                    </p>
                  </div>
                </div>
                <Link
                  href="/facebook-connect"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    integrations.facebook
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {integrations.facebook ? 'Gerenciar' : 'Conectar'}
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* WhatsApp Business */}
              <div className={`flex items-center justify-between p-4 border-2 rounded-lg transition ${
                integrations.whatsapp ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">WhatsApp Business</h3>
                      {integrations.whatsapp && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          ✓ Conectado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {integrations.whatsapp 
                        ? 'WhatsApp Cloud API está ativo' 
                        : 'Integre com WhatsApp Cloud API'}
                    </p>
                  </div>
                </div>
                <Link
                  href="/whatsapp-connect"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    integrations.whatsapp
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {integrations.whatsapp ? 'Gerenciar' : 'Conectar'}
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Hotmart */}
              <div className={`flex items-center justify-between p-4 border-2 rounded-lg transition ${
                integrations.hotmart ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Hotmart</h3>
                      {integrations.hotmart && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          ✓ Conectado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {integrations.hotmart 
                        ? 'Webhook configurado e ativo' 
                        : 'Configure o webhook da Hotmart'}
                    </p>
                  </div>
                </div>
                <Link
                  href="/hotmart-connect"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    integrations.hotmart
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  {integrations.hotmart ? 'Gerenciar' : 'Conectar'}
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Dica */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Dica:</strong> Conecte todas as integrações para obter a visão completa do seu funil de vendas. 
              Cada plataforma fornece dados essenciais para otimizar suas campanhas.
            </p>
          </div>
        </section>

        {/* Metas + Calculadora lado a lado */}
        <div className="flex flex-col md:flex-row gap-6 mb-6 justify-center">
          {/* Metas */}
          <section className="bg-white rounded-xl shadow-sm border p-4 max-w-md w-full mx-auto">
            <div className="flex items-center gap-1 mb-2">
              <Database className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold">Metas do Lançamento</h2>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Meta de Vendas
                </label>
                <input
                  type="number"
                  value={config.metaVendas}
                  onChange={(e) => setConfig({...config, metaVendas: Number(e.target.value)})}
                  className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Meta de Faturamento (R$)
                </label>
                <input
                  type="number"
                  value={config.metaFaturamento}
                  onChange={(e) => setConfig({...config, metaFaturamento: Number(e.target.value)})}
                  className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Meta de Leads
                </label>
                <input
                  type="number"
                  value={config.metaLeads}
                  onChange={(e) => setConfig({...config, metaLeads: Number(e.target.value)})}
                  className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
            </div>
          </section>
          {/* Calculadora de Lucro Real */}
          <div className="max-w-md w-full mx-auto">
            {/* O componente ROICalculator é renderizado na dashboard, mas se quiser pode importar e usar aqui também */}
          </div>
        </div>

        {/* Custos */}
        <section className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Custos</h2>
          
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custo do Produto (R$)
            </label>
            <input
              type="number"
              value={config.custoProduto}
              onChange={(e) => setConfig({...config, custoProduto: Number(e.target.value)})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              step="0.01"
            />
            <p className="text-xs text-gray-500 mt-1">
              Usado para calcular lucro líquido e ROI real
            </p>
          </div>
        </section>

        {/* Alertas */}
        <section className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-bold">Configuração de Alertas</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alerta de CPC Alto (R$)
              </label>
              <input
                type="number"
                value={config.alertaCPCAlto}
                onChange={(e) => setConfig({...config, alertaCPCAlto: Number(e.target.value)})}
                className="w-full max-w-xs px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">
                Alertar quando CPC ultrapassar este valor
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alerta de Taxa de Conversão Baixa (%)
              </label>
              <input
                type="number"
                value={config.alertaTaxaConversaoBaixa}
                onChange={(e) => setConfig({...config, alertaTaxaConversaoBaixa: Number(e.target.value)})}
                className="w-full max-w-xs px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Alertar quando conversão cair abaixo deste valor
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alerta de Checkouts Abandonados (%)
              </label>
              <input
                type="number"
                value={config.alertaCheckoutAbandonado}
                onChange={(e) => setConfig({...config, alertaCheckoutAbandonado: Number(e.target.value)})}
                className="w-full max-w-xs px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Alertar quando taxa de abandono ultrapassar este valor
              </p>
            </div>
          </div>
        </section>

        {/* Notificações */}
        <section className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Notificações</h2>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.emailAlertas}
                onChange={(e) => setConfig({...config, emailAlertas: e.target.checked})}
                className="w-5 h-5 text-whatsapp-light rounded focus:ring-2 focus:ring-whatsapp-light"
              />
              <span className="text-sm font-medium">Receber alertas por email</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.whatsappAlertas}
                onChange={(e) => setConfig({...config, whatsappAlertas: e.target.checked})}
                className="w-5 h-5 text-whatsapp-light rounded focus:ring-2 focus:ring-whatsapp-light"
              />
              <span className="text-sm font-medium">Receber alertas por WhatsApp</span>
            </label>
          </div>
        </section>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              saved 
                ? 'bg-green-600 text-white' 
                : 'bg-whatsapp-light text-white hover:bg-whatsapp-dark'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                Salvo com sucesso!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Configurações
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  )
}
