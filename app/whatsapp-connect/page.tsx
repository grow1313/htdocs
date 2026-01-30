'use client'

import { useState } from 'react'
import { MessageCircle, CheckCircle, AlertCircle, Loader2, Smartphone } from 'lucide-react'

export default function WhatsAppConnection() {
  const [step, setStep] = useState<'intro' | 'qrcode' | 'success'>('intro')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [checkingStatus, setCheckingStatus] = useState(false)

  const generateQRCode = async () => {
    setLoading(true)
    setError('')

    try {
      // Simular conexão para demonstração
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Conectar automaticamente no modo demo
      const response = await fetch('/api/integrations/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: '5511999999999',
          method: 'demo',
        }),
      })

      if (response.ok) {
        setStep('success')
      } else {
        throw new Error('Erro na conexão demo')
      }
    } catch (err) {
      setError('Erro ao conectar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const startConnectionCheck = () => {
    setCheckingStatus(true)
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/integrations/whatsapp')
        const data = await response.json()
        if (data.connected) {
          clearInterval(interval)
          setStep('success')
          setCheckingStatus(false)
        }
      } catch (err) {
        console.error('Erro:', err)
      }
    }, 3000)

    setTimeout(() => {
      clearInterval(interval)
      setCheckingStatus(false)
    }, 300000)
  }

  const connectWithPhone = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Digite um número válido')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/integrations/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/\D/g, ''),
          method: 'simple',
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erro ao conectar')
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'intro') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Conectar WhatsApp</h1>
              <p className="text-gray-600">Escolha como deseja conectar</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="border-2 border-green-200 rounded-xl p-6 hover:border-green-400 transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">🔥 Conexão Demo (Recomendado)</h3>
                  <p className="text-gray-600 mb-4">
                    Conecte em modo demonstração para testar a plataforma<br />
                    <span className="text-green-600 font-medium">✓ Sem configuração • ✓ Instantâneo • ✓ Perfeito para testes</span>
                  </p>
                  <button
                    onClick={generateQRCode}
                    disabled={loading}
                    className="bg-green-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      '✨ Conectar Modo Demo'
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    * Modo demo gera dados simulados para você explorar a plataforma
                  </p>
                </div>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-xl p-6 opacity-50">
              <h3 className="text-lg font-semibold mb-2">🔒 Conexão Real (Em Breve)</h3>
              <p className="text-sm text-gray-600 mb-4">Requer WhatsApp Business API oficial</p>
              <div className="flex gap-3">
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <button
                  disabled={true}
                  className="bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed"
                >
                  Em Breve
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-800">
              <strong>💡 Sobre o Modo Demo:</strong> Perfeito para explorar todas as funcionalidades da plataforma sem precisar conectar WhatsApp real. Os dados são simulados mas representam o comportamento real do sistema.
            </p>
          </div>
          
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mt-4">
            <p className="text-xs text-gray-600">
              <strong>📱 Para conexão real:</strong> É necessário integração com WhatsApp Business API oficial ou usar bibliotecas como <code className="bg-white px-1 rounded">whatsapp-web.js</code>. Entre em contato para implementação em produção.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'qrcode') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Escaneie o QR Code</h2>
            <p className="text-gray-600">Abra o WhatsApp no celular</p>
          </div>

          <div className="bg-white border-4 border-gray-200 rounded-2xl p-8 mb-6">
            <div className="flex justify-center">
              {qrCode ? (
                <img src={qrCode} alt="QR Code" className="w-72 h-72" />
              ) : (
                <div className="w-72 h-72 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {checkingStatus && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <p className="text-sm text-blue-800">Aguardando escaneamento...</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-3">📱 Como escanear:</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="font-bold text-green-600">1.</span>
                <span>Abra o WhatsApp</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-green-600">2.</span>
                <span>Toque em <strong>⋮ → Aparelhos conectados</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-green-600">3.</span>
                <span>Toque em <strong>Conectar aparelho</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-green-600">4.</span>
                <span>Aponte para o QR Code</span>
              </li>
            </ol>
          </div>

          <button
            onClick={() => {
              setStep('intro')
              setCheckingStatus(false)
            }}
            className="w-full py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            ← Voltar
          </button>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h2 className="text-3xl font-bold mb-4">🎉 WhatsApp Conectado!</h2>
          <p className="text-gray-600 mb-8">Conexão realizada com sucesso!</p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-green-900 mb-3">✅ Agora você pode:</h3>
            <ul className="text-sm text-green-800 space-y-2 text-left max-w-md mx-auto">
              <li>✓ Rastrear mensagens recebidas</li>
              <li>✓ Ver conversas em tempo real</li>
              <li>✓ Enviar mensagens pela plataforma</li>
              <li>✓ Acompanhar métricas</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <a
              href="/dashboard"
              className="bg-green-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-green-700 transition"
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
