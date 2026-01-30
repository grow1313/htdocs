import Link from 'next/link'
import { ArrowRight, BarChart3, MessageCircle, TrendingUp, Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* BG embaçado e com contraste */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: 'url(/lp-bg.png)',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
          backgroundSize: 'cover',
          filter: 'blur(10px) contrast(0.7) brightness(1.1)',
          opacity: 0.18,
        }}
      />
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-8 h-8 text-whatsapp-light" />
          <span className="text-2xl font-bold">WhatsApp Funnel</span>
        </div>
        <nav className="flex gap-6">
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            Entrar
          </Link>
          <Link 
            href="/register" 
            className="bg-whatsapp-light text-white px-4 py-2 rounded-lg hover:bg-whatsapp-dark transition"
          >
            Começar Grátis
          </Link>
        </nav>
      </header>


      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
          Descubra Onde Seu Lançamento <br />
          <span className="text-whatsapp-light">Está Perdendo Vendas</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Visualize todo o funil de vendas no WhatsApp em um único painel. 
          Do anúncio até o pagamento. Simples, visual e direto ao ponto.
        </p>
        {/* Botão removido conforme solicitado */}
      </section>

      {/* Planos e Preços - logo após o Hero */}
      <section className="w-full bg-gray-50 pt-2 pb-12 px-4 border-b border-gray-200">
        <div className="max-w-3xl mx-auto text-center mb-1">
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
            <a href="/register?plan=start" className="w-full bg-whatsapp-light text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-whatsapp-dark transition text-center">
              Ver onde estou errando
            </a>
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
            <a href="/register?plan=pro" className="w-full bg-whatsapp-light text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-whatsapp-dark transition text-center">
              Parar de perder venda
            </a>
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
            <a href="/register?plan=scale" className="w-full bg-whatsapp-light text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-whatsapp-dark transition text-center">
              Escalar com dados
            </a>
          </div>
        </div>
        <div className="max-w-3xl mx-auto text-center mt-10 text-gray-600 text-sm">
          Os planos são definidos pelo volume de conversas analisadas. Todos incluem inteligência artificial.
        </div>
      </section>
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            O Problema Que Você Enfrenta Hoje
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-red-400 text-lg mb-2">📊 Facebook Ads</div>
              <p className="text-gray-300">Cliques e custo separados</p>
            </div>
            <div className="text-center">
              <div className="text-red-400 text-lg mb-2">💬 WhatsApp</div>
              <p className="text-gray-300">Conversas sem visão do todo</p>
            </div>
            <div className="text-center">
              <div className="text-red-400 text-lg mb-2">💳 Pagamentos</div>
              <p className="text-gray-300">Vendas desconectadas</p>
            </div>
          </div>
          <p className="text-center text-2xl font-bold mt-12 text-yellow-400">
            Dados espalhados = Dinheiro perdido
          </p>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">
          Tudo em um Único Painel
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <BarChart3 className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Funil Visual</h3>
            <p className="text-gray-600">
              Veja cada etapa do anúncio até a venda de forma clara
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <TrendingUp className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Taxa de Conversão</h3>
            <p className="text-gray-600">
              Percentuais precisos de cada etapa do funil
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <MessageCircle className="w-12 h-12 text-whatsapp-light mb-4" />
            <h3 className="text-xl font-bold mb-2">WhatsApp Integrado</h3>
            <p className="text-gray-600">
              Rastreie conversas e qualificação de leads
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Zap className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Alertas Inteligentes</h3>
            <p className="text-gray-600">
              Receba avisos de gargalos em tempo real
            </p>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 WhatsApp Funnel. Todos os direitos reservados.
          </p>
          <div className="mt-4 space-x-6">
            <Link href="/termos" className="text-gray-400 hover:text-white">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="text-gray-400 hover:text-white">
              Política de Privacidade
            </Link>
            <Link href="/lgpd" className="text-gray-400 hover:text-white">
              LGPD
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
