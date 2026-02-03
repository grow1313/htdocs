'use client'

import React, { useState, useEffect } from 'react'
import { Target, Plus, X, TrendingUp, Calendar, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react'

interface Goal {
  id: string
  title: string
  description?: string
  targetValue: number
  currentValue: number
  metric: string
  platform?: string
  startDate: string
  endDate: string
  isActive: boolean
  isCompleted: boolean
  completedAt?: string
}

interface GoalsTrackerProps {
  metrics: {
    whatsapp?: any
    facebook?: any
    hotmart?: any
  }
}

export default function GoalsTracker({ metrics }: GoalsTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '',
    metric: 'sales',
    platform: 'ALL',
    endDate: '',
  })

  const metricOptions = [
    { value: 'sales', label: 'Vendas', icon: '💰' },
    { value: 'revenue', label: 'Receita (R$)', icon: '💵' },
    { value: 'leads', label: 'Leads/Conversas', icon: '👥' },
    { value: 'conversions', label: 'Conversões', icon: '✅' },
    { value: 'clicks', label: 'Cliques', icon: '👆' },
  ]

  const fetchGoals = React.useCallback(async () => {
    try {
      const response = await fetch('/api/goals')
      if (response.ok) {
        const data = await response.json()
        setGoals(data.goals || [])
      }
    } catch (error) {
      console.error('Erro ao buscar metas:', error)
    }
  }, [])

  const checkGoals = React.useCallback(async () => {
    try {
      await fetch('/api/goals/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics }),
      })
      // Recarregar metas após verificação
      fetchGoals()
    } catch (error) {
      console.error('Erro ao verificar metas:', error)
    }
  }, [metrics, fetchGoals])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  useEffect(() => {
    // Verificar metas quando métricas mudarem
    if (goals.length > 0 && metrics) {
      checkGoals()
    }
  }, [metrics, checkGoals, goals.length])

  const createGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowModal(false)
        setFormData({
          title: '',
          description: '',
          targetValue: '',
          metric: 'sales',
          platform: 'ALL',
          endDate: '',
        })
        fetchGoals()
      }
    } catch (error) {
      console.error('Erro ao criar meta:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteGoal = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta meta?')) return

    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchGoals()
      }
    } catch (error) {
      console.error('Erro ao deletar meta:', error)
    }
  }

  const getProgress = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100)
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  const getMetricLabel = (metric: string) => {
    return metricOptions.find((m) => m.value === metric)?.label || metric
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors max-w-md mx-auto w-full flex-1 flex flex-col justify-between min-h-[520px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500 p-2 rounded-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Metas e Objetivos</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Acompanhe seu progresso</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
        >
          <Plus className="w-4 h-4" />
          Nova Meta
        </button>
      </div>

      {/* Lista de Metas */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg font-medium">Nenhuma meta criada</p>
            <p className="text-sm">Crie sua primeira meta para começar a acompanhar!</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = getProgress(goal)
            const daysRemaining = getDaysRemaining(goal.endDate)
            const metricOption = metricOptions.find((m) => m.value === goal.metric)

            return (
              <div
                key={goal.id}
                className={`border rounded-lg p-4 ${
                  goal.isCompleted
                    ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700'
                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{metricOption?.icon}</span>
                      <h4 className="font-bold text-gray-900 dark:text-white">{goal.title}</h4>
                      {goal.isCompleted && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    {goal.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{goal.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{getMetricLabel(goal.metric)}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {daysRemaining > 0 ? `${daysRemaining} dias restantes` : 'Prazo expirado'}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Barra de Progresso */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">
                      {goal.currentValue.toLocaleString('pt-BR')} de {goal.targetValue.toLocaleString('pt-BR')}
                    </span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        goal.isCompleted
                          ? 'bg-green-500 dark:bg-green-400'
                          : progress >= 75
                          ? 'bg-purple-500 dark:bg-purple-400'
                          : progress >= 50
                          ? 'bg-blue-500 dark:bg-blue-400'
                          : 'bg-yellow-500 dark:bg-yellow-400'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {goal.isCompleted && (
                  <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Meta atingida em {new Date(goal.completedAt!).toLocaleDateString('pt-BR')}!
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Modal de Criar Meta */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nova Meta</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={createGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título da Meta *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Alcançar 100 vendas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={2}
                  placeholder="Descrição opcional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Métrica *
                </label>
                <select
                  required
                  value={formData.metric}
                  onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {metricOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Alvo *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Final *
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50"
                >
                  {loading ? 'Criando...' : 'Criar Meta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
