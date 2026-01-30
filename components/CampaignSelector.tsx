'use client'

import { useEffect, useState } from 'react'

interface Campaign {
  id: string
  campaignId: string
  name: string
  status: string
  isActive: boolean
  isDefault: boolean
  objective?: string
  budget?: number
  spend: number
}

interface CampaignSelectorProps {
  onSelectCampaign?: (campaignId: string | null, campaignName?: string) => void
}

export default function CampaignSelector({ onSelectCampaign }: CampaignSelectorProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async (forceSync = false) => {
    try {
      if (forceSync) setSyncing(true)
      else setLoading(true)

      const url = forceSync
        ? '/api/campaigns?sync=true'
        : '/api/campaigns'

      const response = await fetch(url)
      const data = await response.json()

      if (data.campaigns) {
        setCampaigns(data.campaigns)

        // Iniciar com "Todas as Campanhas" selecionado
        if (!forceSync && selectedCampaign === 'all') {
          if (onSelectCampaign) {
            onSelectCampaign(null, 'Todas as Campanhas')
          }
        } else {
          // Se foi um sync forçado, manter a seleção atual
          const current = data.campaigns.find((c: Campaign) => c.id === selectedCampaign)
          if (current && onSelectCampaign) {
            onSelectCampaign(current.campaignId, current.name)
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error)
    } finally {
      setLoading(false)
      setSyncing(false)
    }
  }

  const handleSelectCampaign = async (campaignId: string, facebookCampaignId: string | null, campaignName: string) => {
    try {
      // Se for "Todas", não precisa definir como padrão
      if (campaignId !== 'all') {
        await fetch('/api/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ campaignId }),
        })
      }

      setSelectedCampaign(campaignId)
      setShowDropdown(false)

      if (onSelectCampaign) {
        onSelectCampaign(facebookCampaignId, campaignName)
      }

      // Recarregar lista para atualizar flags (se não for "Todas")
      if (campaignId !== 'all') {
        fetchCampaigns()
      }
    } catch (error) {
      console.error('Erro ao selecionar campanha:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100'
      case 'PAUSED':
        return 'text-yellow-600 bg-yellow-100'
      case 'ARCHIVED':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Ativa'
      case 'PAUSED':
        return 'Pausada'
      case 'ARCHIVED':
        return 'Arquivada'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400"></div>
        Carregando campanhas...
      </div>
    )
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Nenhuma campanha encontrada. Configure Meta Ads em Configurações.
      </div>
    )
  }

  const selected = campaigns.find(c => c.id === selectedCampaign)
  const displayName = selectedCampaign === 'all' ? 'Todas as Campanhas' : (selected?.name || 'Selecione uma campanha')

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Campanha:
        </label>

        {/* Seletor */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-between gap-3 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition min-w-[300px]"
          >
            <div className="flex items-center gap-2 flex-1 text-left">
              <span className="font-medium text-gray-900">
                {displayName}
              </span>
              {selected && selectedCampaign !== 'all' && (
                <span className={`px-2 py-0.5 text-xs rounded font-medium ${getStatusColor(selected.status)}`}>
                  {getStatusText(selected.status)}
                </span>
              )}
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {/* Opção: Todas as Campanhas */}
                <button
                  onClick={() => handleSelectCampaign('all', null, 'Todas as Campanhas')}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-200 ${
                    selectedCampaign === 'all' ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          📊 Todas as Campanhas
                        </span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                          Agregado
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Visualizar dados de todas as campanhas combinadas
                      </div>
                    </div>
                    {selectedCampaign === 'all' && (
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>

                {campaigns.map((campaign) => (
                  <button
                    key={campaign.id}
                    onClick={() => handleSelectCampaign(campaign.id, campaign.campaignId, campaign.name)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition border-b border-gray-100 last:border-0 ${
                      campaign.id === selectedCampaign ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {campaign.name}
                          </span>
                          {campaign.isDefault && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                              Padrão
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className={`px-2 py-0.5 rounded font-medium ${getStatusColor(campaign.status)}`}>
                            {getStatusText(campaign.status)}
                          </span>
                          {campaign.objective && (
                            <span>Objetivo: {campaign.objective}</span>
                          )}
                          <span>Gasto: R$ {campaign.spend.toFixed(2)}</span>
                        </div>
                      </div>
                      {campaign.id === selectedCampaign && (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Botão Sincronizar */}
        <button
          onClick={() => fetchCampaigns(true)}
          disabled={syncing}
          className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          title="Sincronizar campanhas do Facebook"
        >
          <svg
            className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {syncing ? 'Sincronizando...' : 'Sincronizar'}
        </button>
      </div>

      {selected && selectedCampaign !== 'all' && (
        <div className="mt-2 text-xs text-gray-500">
          ID: {selected.campaignId}
          {selected.budget && selected.budget > 0 && (
            <span className="ml-3">Orçamento: R$ {selected.budget.toFixed(2)}</span>
          )}
        </div>
      )}
      {selectedCampaign === 'all' && campaigns.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          Mostrando dados agregados de {campaigns.length} {campaigns.length === 1 ? 'campanha' : 'campanhas'}
        </div>
      )}
    </div>
  )
}
