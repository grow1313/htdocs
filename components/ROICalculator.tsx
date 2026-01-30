import { DollarSign, TrendingUp, Percent } from 'lucide-react'

interface ROICalculatorProps {
  faturamento: number
  gastosAds: number
  custoProduto: number
  vendas: number
}

export default function ROICalculator({ 
  faturamento, 
  gastosAds, 
  custoProduto, 
  vendas 
}: ROICalculatorProps) {
  const custoTotal = gastosAds + (custoProduto * vendas)
  const lucroLiquido = faturamento - custoTotal
  const roi = gastosAds > 0 ? ((lucroLiquido / gastosAds) * 100) : 0
  const margemLucro = faturamento > 0 ? ((lucroLiquido / faturamento) * 100) : 0

  return (
  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white max-w-md mx-auto w-full">
      <h2 className="text-2xl font-bold mb-6">Calculadora de Lucro Real</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm">Faturamento</span>
          </div>
          <p className="text-2xl font-bold">
            R$ {faturamento.toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm">Custos Totais</span>
          </div>
          <p className="text-2xl font-bold">
            R$ {custoTotal.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs opacity-80 mt-1">
            Ads: R$ {gastosAds.toLocaleString('pt-BR')} | Produto: R$ {(custoProduto * vendas).toLocaleString('pt-BR')}
          </p>
        </div>
      </div>

      <div className="bg-white/30 backdrop-blur rounded-lg p-6 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-6 h-6" />
          <span className="text-lg">Lucro Líquido</span>
        </div>
        <p className={`text-5xl font-bold ${lucroLiquido >= 0 ? 'text-green-100' : 'text-red-300'}`}>
          R$ {Math.abs(lucroLiquido).toLocaleString('pt-BR')}
        </p>
        {lucroLiquido < 0 && (
          <p className="text-sm text-red-200 mt-2">⚠️ Operação no prejuízo</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-5 h-5" />
            <span className="text-sm">ROI</span>
          </div>
          <p className="text-3xl font-bold">{roi.toFixed(0)}%</p>
          <p className="text-xs opacity-80 mt-1">
            {roi > 0 ? `R$ ${(roi / 100).toFixed(2)} para cada R$ 1 investido` : 'Sem retorno positivo'}
          </p>
        </div>

        <div className="bg-white/20 backdrop-blur rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-5 h-5" />
            <span className="text-sm">Margem de Lucro</span>
          </div>
          <p className="text-3xl font-bold">{margemLucro.toFixed(1)}%</p>
          <p className="text-xs opacity-80 mt-1">
            {margemLucro >= 30 ? '✅ Margem saudável' : margemLucro >= 15 ? '⚠️ Margem aceitável' : '❌ Margem baixa'}
          </p>
        </div>
      </div>
    </div>
  )
}
