import React from 'react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Planos e Preços</h1>
        <p className="text-lg text-gray-600">Escolha o plano ideal para o seu volume de vendas no WhatsApp. Todos os planos incluem análise por IA.</p>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* START */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border border-gray-200">
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-xs font-semibold">IA Essencial</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">START</h2>
          <p className="text-gray-500 mb-6">Para quem está começando a vender no WhatsApp</p>
          <ul className="text-gray-700 text-sm mb-8 space-y-2 w-full">
            <li>✔️ Análise por IA do funil</li>
            <li>✔️ Até 500 conversas/mês</li>
            <li>✔️ Identificação de gargalos no WhatsApp</li>
            <li>✔️ Insights básicos</li>
            <li>✔️ 1 número de WhatsApp</li>
            <li>✔️ 1 funil ativo</li>
          </ul>
          <div className="text-3xl font-bold mb-4">R$ 97</div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Começar agora</button>
        </div>
        {/* PRO */}
        <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center border-4 border-blue-600 scale-105 relative z-10">
          <div className="mb-4">
            <span className="inline-block bg-blue-600 text-white rounded-full px-3 py-1 text-xs font-semibold">MAIS RECOMENDADO</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">PRO</h2>
          <p className="text-gray-500 mb-6">Para quem anuncia todos os dias</p>
          <ul className="text-gray-700 text-sm mb-8 space-y-2 w-full">
            <li>✔️ Análise completa por IA</li>
            <li>✔️ Até 3.000 conversas/mês</li>
            <li>✔️ Diagnóstico + sugestões acionáveis</li>
            <li>✔️ Comparação de períodos</li>
            <li>✔️ Até 3 números de WhatsApp</li>
            <li>✔️ Até 3 funis ativos</li>
          </ul>
          <div className="text-3xl font-bold mb-4">R$ 197</div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Quero esse plano</button>
        </div>
        {/* SCALE */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center border border-gray-200">
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-xs font-semibold">IA Avançada</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">SCALE</h2>
          <p className="text-gray-500 mb-6">Para operações maiores e agências</p>
          <ul className="text-gray-700 text-sm mb-8 space-y-2 w-full">
            <li>✔️ IA avançada com alertas automáticos</li>
            <li>✔️ 10.000+ conversas/mês</li>
            <li>✔️ Análise de tendências e quedas</li>
            <li>✔️ Histórico estendido</li>
            <li>✔️ Multiusuário</li>
            <li>✔️ WhatsApps e funis ilimitados</li>
          </ul>
          <div className="text-3xl font-bold mb-4">R$ 397</div>
          <button className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg font-semibold hover:bg-blue-200 transition">Falar com vendas</button>
        </div>
      </div>
      <div className="max-w-3xl mx-auto text-center mt-10 text-gray-600 text-sm">
        Os planos são definidos pelo volume de conversas analisadas. Todos incluem inteligência artificial.
      </div>
    </div>
  );
}
