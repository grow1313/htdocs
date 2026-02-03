'use client'

import { useState, useEffect, useCallback } from 'react'
import { Lightbulb, Sparkles, TrendingUp, AlertTriangle, Info, CheckCircle, RefreshCw } from 'lucide-react'

interface Suggestion {
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

interface AISuggestionsProps {
  metrics: {
    whatsapp?: any
    facebook?: any
    hotmart?: any
  }
}

export default function AISuggestions({ metrics }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'ai' | 'demo' | 'basic'>('demo')


  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics }),
      })
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
        setMode(data.mode || 'demo')
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error)
    } finally {
      setLoading(false)
    }
  }, [metrics])

  useEffect(() => {
    fetchSuggestions()
  }, [fetchSuggestions])

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500'
      case 'warning':
        return 'border-l-yellow-500'
      case 'error':
        return 'border-l-red-500'
      default:
        return 'border-l-blue-500'
    }
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-blue-100 text-blue-700',
    }
    
    const labels = {
      high: 'Alta',
      medium: 'Média',
      low: 'Baixa',
    }

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[priority as keyof typeof colors]}`}>
        {labels[priority as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Sugestões de IA</h3>
            <p className="text-sm text-gray-600">
              {mode === 'ai' ? '✨ Powered by GPT-4' : mode === 'demo' ? '🎯 Modo Demo' : '📊 Análise Básica'}
            </p>
          </div>
        </div>
        
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Carregando...' : 'Atualizar'}
        </button>
      </div>

      <div className="space-y-3">
        {loading && suggestions.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-4 border-l-4 ${getBorderColor(suggestion.type)} shadow-sm hover:shadow-md transition`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getIcon(suggestion.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                    {getPriorityBadge(suggestion.priority)}
                  </div>
                  <p className="text-sm text-gray-600">{suggestion.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Nenhuma sugestão disponível no momento.</p>
          </div>
        )}
      </div>

      {mode === 'demo' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            💡 <strong>Modo Demo:</strong> Configure sua chave OpenAI em <code className="bg-yellow-100 px-1 rounded">.env</code> 
            para ativar sugestões personalizadas com GPT-4.
          </p>
        </div>
      )}
    </div>
  )
}
