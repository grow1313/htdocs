'use client'

import { ArrowRight } from 'lucide-react'

interface FunnelStage {
  name: string
  value: number
  color: string
  icon?: string
}

interface FunnelVisualizationProps {
  title: string
  stages: FunnelStage[]
}

export default function FunnelVisualization({ title, stages }: FunnelVisualizationProps) {
  const maxValue = stages[0]?.value || 1

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{title}</h3>
      
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const percentage = (stage.value / maxValue) * 100
          const conversionRate = index > 0 
            ? ((stage.value / stages[index - 1].value) * 100).toFixed(1)
            : 100

          return (
            <div key={index}>
              <div className="relative">
                {/* Barra do funil */}
                <div 
                  className="rounded-lg p-4 transition-all hover:shadow-md"
                  style={{
                    backgroundColor: stage.color + '20',
                    borderLeft: `4px solid ${stage.color}`,
                    width: `${Math.max(percentage, 20)}%`,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {stage.icon && (
                        <span className="text-2xl">{stage.icon}</span>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{stage.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {stage.value.toLocaleString('pt-BR')} pessoas
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: stage.color }}>
                        {percentage.toFixed(1)}%
                      </div>
                      {index > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {conversionRate}% conversão
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Seta entre estágios */}
                {index < stages.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Resumo */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">Taxa Geral</div>
            <div className="text-xl font-bold text-gray-900">
              {((stages[stages.length - 1].value / stages[0].value) * 100).toFixed(2)}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Drop-off Total</div>
            <div className="text-xl font-bold text-red-600">
              {(stages[0].value - stages[stages.length - 1].value).toLocaleString('pt-BR')}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Convertidos</div>
            <div className="text-xl font-bold text-green-600">
              {stages[stages.length - 1].value.toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
