'use client'

import { useState, useEffect } from 'react'
import { Facebook, CheckCircle, AlertCircle, Copy, ExternalLink, Zap } from 'lucide-react'

export default function FacebookConnect() {
  const [step, setStep] = useState<'intro' | 'token' | 'accounts' | 'success'>('intro')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [adAccounts, setAdAccounts] = useState<any[]>([])
  const [selectedAccount, setSelectedAccount] = useState('')
  const [credentials, setCredentials] = useState({
    appId: '',
    appSecret: '',
  })

  const handleValidateToken = async () => {
    if (!accessToken) {
      setError('Insira o Access Token')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Validar token
      const validateResponse = await fetch(
        `https://graph.facebook.com/v18.0/me?access_token=${accessToken}`
      )
      const validateData = await validateResponse.json()

      if (!validateResponse.ok) {
        throw new Error(validateData.error?.message || 'Token inválido')
      }

      // Buscar contas de anúncios
      const accountsResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name,account_status,currency&access_token=${accessToken}`
      )
      const accountsData = await accountsResponse.json()

      if (!accountsResponse.ok) {
        throw new Error(accountsData.error?.message || 'Erro ao buscar contas')
      }

      if (!accountsData.data || accountsData.data.length === 0) {
        throw new Error('Nenhuma conta de anúncios encontrada. Verifique suas permissões.')
      }

      setAdAccounts(accountsData.data)
      setStep('accounts')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar token')
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async () => {
    if (!selectedAccount) {
      setError('Selecione uma conta de anúncios')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/integrations/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          adAccountId: selectedAccount.replace('act_', ''),
          appId: credentials.appId,
          appSecret: credentials.appSecret,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao conectar')
      }

      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar Facebook Ads')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'intro') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Facebook className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Conectar Facebook Ads</h1>
              <p className="text-gray-600">Integre suas campanhas do Facebook/Instagram</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Requisitos</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Conta Meta for Developers</li>
                <li>• App criado (ou usar token de teste)</li>
                <li>• Permissões: ads_read, ads_management</li>
                <li>• Conta de anúncios ativa</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6" />
                <h3 className="text-xl font-bold">Opção Rápida - Token de Teste</h3>
              </div>
              <p className="text-sm mb-4 opacity-90">
                Para começar rapidamente, você pode usar o Access Token Debugger do Meta para gerar um token de teste válido por 24h-60 dias.
              </p>
              <a
                href="https://developers.facebook.com/tools/explorer/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                <ExternalLink className="w-4 h-4" />
                Gerar Token de Teste
              </a>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">💡 Dicas</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Use o Graph API Explorer para gerar tokens</li>
                <li>• Selecione as permissões: ads_read, ads_management</li>
                <li>• Troque por token de longa duração (60 dias)</li>
                <li>• Salve App ID e App Secret para renovação automática</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('token')}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Começar Integração
              </button>
              <a
                href="https://developers.facebook.com/docs/marketing-apis/get-started"
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

  if (step === 'token') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Passo 1: Inserir Access Token</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook/Meta Access Token *
              </label>
              <textarea
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="EAAxxxxxxxxxx..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Cole o Access Token gerado no Graph API Explorer ou Meta for Developers
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App ID (opcional)
                </label>
                <input
                  type="text"
                  value={credentials.appId}
                  onChange={(e) => setCredentials({ ...credentials, appId: e.target.value })}
                  placeholder="123456789012345"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Para trocar por token de longa duração
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App Secret (opcional)
                </label>
                <input
                  type="password"
                  value={credentials.appSecret}
                  onChange={(e) => setCredentials({ ...credentials, appSecret: e.target.value })}
                  placeholder="abc123..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Para trocar por token de longa duração
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Como gerar o Access Token:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Acesse <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noopener noreferrer" className="underline">Graph API Explorer</a></li>
                <li>Selecione seu App ou use &quot;Graph API Explorer&quot;</li>
                <li>Clique em &quot;Permissions&quot; e adicione: <code className="bg-white px-1 rounded">ads_read</code>, <code className="bg-white px-1 rounded">ads_management</code></li>
                <li>Clique em &quot;Generate Access Token&quot;</li>
                <li>Autorize o App</li>
                <li>Copie o token gerado</li>
              </ol>
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
                onClick={handleValidateToken}
                disabled={loading || !accessToken}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Validando...' : 'Validar Token →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'accounts') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Passo 2: Selecionar Conta de Anúncios</h2>

          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">
                Token válido! {adAccounts.length} conta(s) de anúncios encontrada(s).
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Escolha a conta de anúncios:
              </label>
              <div className="space-y-3">
                {adAccounts.map((account) => (
                  <label
                    key={account.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedAccount === account.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="adAccount"
                      value={account.id}
                      checked={selectedAccount === account.id}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-medium">{account.name}</div>
                      <div className="text-sm text-gray-600">
                        ID: {account.id} • {account.currency} • Status: {account.account_status === 1 ? '✅ Ativa' : '❌ Inativa'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep('token')}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
                disabled={loading}
              >
                Voltar
              </button>
              <button
                onClick={handleConnect}
                disabled={loading || !selectedAccount}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Conectando...' : 'Conectar Conta'}
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
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-blue-600" />
          </div>

          <h2 className="text-3xl font-bold mb-4">Facebook Ads Conectado!</h2>
          <p className="text-gray-600 mb-8">
            Sua conta do Facebook Ads foi conectada com sucesso. <br />
            Agora você pode visualizar suas métricas em tempo real.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-3">✅ O que acontece agora:</h3>
            <ul className="text-sm text-blue-800 space-y-2 text-left max-w-md mx-auto">
              <li>• Métricas das campanhas são sincronizadas</li>
              <li>• Dashboard atualiza automaticamente (CPM, CPC, CTR, ROI)</li>
              <li>• Você pode visualizar impressões, cliques e gastos</li>
              <li>• Alertas são gerados se métricas estiverem fora do esperado</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <a
              href="/dashboard"
              className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Ir para Dashboard
            </a>
            <a
              href="/settings"
              className="px-8 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Configurações
            </a>
          </div>
        </div>
      </div>
    )
  }

  return null
}
