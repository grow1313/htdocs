'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface WebhookLog {
  id: string
  platform: string
  event: string
  method: string
  endpoint: string
  statusCode: number
  duration: number | null
  error: string | null
  createdAt: string
  payload?: string
  response?: string
  headers?: string
}

interface WebhookStats {
  total: number
  errorCount: number
  successCount: number
  platformStats: Array<{ platform: string; _count: number }>
}

export default function WebhooksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<WebhookLog[]>([])
  const [stats, setStats] = useState<WebhookStats | null>(null)
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null)
  const [filter, setFilter] = useState({
    platform: 'all',
    status: 'all',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchLogs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, filter])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams()
      if (filter.platform !== 'all') params.append('platform', filter.platform)
      if (filter.status !== 'all') params.append('status', filter.status)
      
      const response = await fetch(`/api/webhooks/logs?${params.toString()}`)
      const data = await response.json()
      
      setLogs(data.logs || [])
      setStats({
        total: data.total,
        errorCount: data.errorCount,
        successCount: data.successCount,
        platformStats: data.platformStats,
      })
    } catch (error) {
      console.error('Erro ao buscar logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearOldLogs = async (days: number) => {
    if (!confirm(`Tem certeza que deseja remover logs com mais de ${days} dias?`)) {
      return
    }

    try {
      const response = await fetch(`/api/webhooks/logs?days=${days}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      alert(data.message)
      fetchLogs()
    } catch (error) {
      console.error('Erro ao limpar logs:', error)
      alert('Erro ao limpar logs')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR')
  }

  const getStatusColor = (statusCode: number) => {
    if (statusCode < 300) return 'text-green-600 bg-green-100'
    if (statusCode < 400) return 'text-blue-600 bg-blue-100'
    if (statusCode < 500) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'WHATSAPP':
        return '💬'
      case 'HOTMART':
        return '🛒'
      case 'META_ADS':
        return '📘'
      default:
        return '🔔'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando webhooks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Voltar
              </button>
              <h1 className="text-2xl font-bold text-gray-900">🔔 Webhooks</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/analytics"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                📊 Analytics
              </Link>
              <Link
                href="/settings"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                ⚙️ Configurações
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Webhooks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sucesso</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{stats.successCount}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Erros</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{stats.errorCount}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taxa de Erro</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.total > 0 ? ((stats.errorCount / stats.total) * 100).toFixed(1) : '0'}%
              </p>
            </div>
          </div>
        )}

        {/* Filtros e Ações */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plataforma
                </label>
                <select
                  value={filter.platform}
                  onChange={(e) => setFilter({ ...filter, platform: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="META_ADS">Facebook Ads</option>
                  <option value="HOTMART">Hotmart</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos</option>
                  <option value="success">Sucesso</option>
                  <option value="error">Erro</option>
                </select>
              </div>

              <button
                onClick={fetchLogs}
                className="mt-6 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                🔄 Atualizar
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => clearOldLogs(7)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Limpar 7d
              </button>
              <button
                onClick={() => clearOldLogs(30)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Limpar 30d
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Webhooks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Plataforma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Duração
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      Nenhum webhook registrado ainda
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="flex items-center gap-2">
                          <span>{getPlatformIcon(log.platform)}</span>
                          <span className="font-medium">{log.platform}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.event}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-mono text-xs">
                          {log.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded font-semibold ${getStatusColor(log.statusCode)}`}>
                          {log.statusCode}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.duration ? `${log.duration}ms` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detalhes do Webhook</h2>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Informações Gerais */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Informações</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Plataforma</p>
                    <p className="font-medium dark:text-white">{getPlatformIcon(selectedLog.platform)} {selectedLog.platform}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Evento</p>
                    <p className="font-medium dark:text-white">{selectedLog.event}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Método</p>
                    <p className="font-medium dark:text-white">{selectedLog.method}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                    <p className={`font-semibold ${selectedLog.statusCode < 400 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {selectedLog.statusCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duração</p>
                    <p className="font-medium dark:text-white">{selectedLog.duration ? `${selectedLog.duration}ms` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Data/Hora</p>
                    <p className="font-medium dark:text-white">{formatDate(selectedLog.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Erro (se houver) */}
              {selectedLog.error && (
                <div>
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">Erro</h3>
                  <pre className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 overflow-x-auto text-sm dark:text-red-200">
                    {selectedLog.error}
                  </pre>
                </div>
              )}

              {/* Payload */}
              {selectedLog.payload && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payload</h3>
                  <pre className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded p-4 overflow-x-auto text-sm dark:text-gray-200">
                    {JSON.stringify(JSON.parse(selectedLog.payload), null, 2)}
                  </pre>
                </div>
              )}

              {/* Response */}
              {selectedLog.response && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Resposta</h3>
                  <pre className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded p-4 overflow-x-auto text-sm dark:text-gray-200">
                    {JSON.stringify(JSON.parse(selectedLog.response), null, 2)}
                  </pre>
                </div>
              )}

              {/* Headers */}
              {selectedLog.headers && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Headers</h3>
                  <pre className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded p-4 overflow-x-auto text-sm dark:text-gray-200">
                    {JSON.stringify(JSON.parse(selectedLog.headers), null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="p-6 border-t dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
