'use client'

import { useState } from 'react'
import { ShoppingCart, CheckCircle, AlertCircle, Copy, ExternalLink, Webhook } from 'lucide-react'

export default function HotmartConnect() {
  const [step, setStep] = useState<'intro' | 'config' | 'success'>('intro')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [credentials, setCredentials] = useState({
    hotmartId: '',
    email: '',
    webhookToken: '',
  })

  const webhookUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/integrations/hotmart`
    : ''

  const handleConnect = async () => {
    if (!credentials.hotmartId || !credentials.webhookToken) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/integrations/hotmart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao conectar')
      }

      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar Hotmart')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (step === 'intro') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Conectar Hotmart</h1>
              <p className="text-gray-600">Integre suas vendas e checkouts</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">📋 Como funciona</h3>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Recebe webhooks de vendas em tempo real</li>
                <li>• Rastreia checkouts iniciados e abandonados</li>
                <li>• Calcula faturamento e ticket médio</li>
                <li>• Sincroniza automaticamente com o dashboard</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Webhook className="w-6 h-6" />
                <h3 className="text-xl font-bold">Integração via Webhook</h3>
              </div>
              <p className="text-sm mb-4 opacity-90">
                A Hotmart envia notificações automáticas sempre que uma venda é realizada, 
                um checkout é iniciado ou um pagamento é confirmado.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📌 Você vai precisar:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Acesso ao painel Hotmart (produtor)</li>
                <li>• Hotmart ID (código do seu produto)</li>
                <li>• Token de segurança do webhook</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('config')}
                className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition"
              >
                Começar Integração
              </button>
              <a
                href="https://developers.hotmart.com/docs/pt-BR/v1/webhooks/introduction/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <ExternalLink className="w-4 h-4" />
                Documentação
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'config') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Configurar Webhook Hotmart</h2>

          <div className="space-y-6">
            {/* Webhook URL */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                1. Configure o Webhook URL na Hotmart
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={webhookUrl}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white font-mono text-sm"
                />
                <button
                  onClick={() => copyToClipboard(webhookUrl)}
                  className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>• Acesse: Hotmart → Ferramentas → Webhooks</p>
                <p>• Cole esta URL no campo &quot;URL de Postback&quot;</p>
                <p>• Marque os eventos: <strong>Compra aprovada, Compra cancelada, Compra em análise</strong></p>
              </div>
            </div>

            {/* Credenciais */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                2. Hotmart ID (Código do Produto) *
              </label>
              <input
                type="text"
                value={credentials.hotmartId}
                onChange={(e) => setCredentials({ ...credentials, hotmartId: e.target.value })}
                placeholder="123456"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Encontre em: Hotmart → Produtos → Detalhes do Produto
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. E-mail do Produtor
              </label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                E-mail cadastrado na Hotmart (opcional)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                4. Webhook Token (Token de Segurança) *
              </label>
              <input
                type="password"
                value={credentials.webhookToken}
                onChange={(e) => setCredentials({ ...credentials, webhookToken: e.target.value })}
                placeholder="seu_token_secreto_123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Crie um token único para validar os webhooks (ex: uma senha aleatória)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">💡 Dica</h4>
              <p className="text-sm text-yellow-800">
                Após configurar o webhook na Hotmart, faça uma venda teste para verificar 
                se os dados estão chegando corretamente no dashboard.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-3">Eventos rastreados:</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>✅ <strong>PURCHASE_COMPLETE</strong> - Pagamento confirmado</li>
                <li>⏳ <strong>PURCHASE_DELAYED</strong> - Checkout iniciado (análise)</li>
                <li>❌ <strong>PURCHASE_CANCELED</strong> - Compra cancelada</li>
                <li>💰 <strong>PURCHASE_REFUNDED</strong> - Reembolso processado</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('intro')}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
                disabled={loading}
              >
                Voltar
              </button>
              <button
                onClick={handleConnect}
                disabled={loading || !credentials.hotmartId || !credentials.webhookToken}
                className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Conectando...' : 'Salvar Configuração'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-orange-600" />
          </div>

          <h2 className="text-3xl font-bold mb-4">Hotmart Conectada!</h2>
          <p className="text-gray-600 mb-8">
            Configuração salva com sucesso. <br />
            Agora configure o webhook no painel da Hotmart.
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-orange-900 mb-3">📋 Próximos passos:</h3>
            <ol className="text-sm text-orange-800 space-y-2 text-left max-w-md mx-auto list-decimal list-inside">
              <li>Acesse o painel Hotmart</li>
              <li>Vá em <strong>Ferramentas → Webhooks</strong></li>
              <li>Cole a URL do webhook: <code className="bg-white px-2 py-0.5 rounded text-xs">{webhookUrl}</code></li>
              <li>Selecione os eventos de compra</li>
              <li>Salve e teste com uma venda</li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-green-900 mb-3">✅ Quando funcionar:</h3>
            <ul className="text-sm text-green-800 space-y-2 text-left max-w-md mx-auto">
              <li>• Vendas aparecem automaticamente no dashboard</li>
              <li>• Checkouts são rastreados em tempo real</li>
              <li>• Faturamento é calculado automaticamente</li>
              <li>• Métricas são atualizadas instantaneamente</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <a
              href="/dashboard"
              className="bg-orange-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-orange-700 transition"
            >
              Ir para Dashboard
            </a>
            <a
              href="https://app-vlc.hotmart.com/tools/webhooks"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <ExternalLink className="w-4 h-4" />
              Configurar na Hotmart
            </a>
          </div>
        </div>
      </div>
    )
  }

  return null
}
