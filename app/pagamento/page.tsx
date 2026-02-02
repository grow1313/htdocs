"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';

const PLANOS = {
  start: {
    nome: 'START',
    preco: 'R$ 97',
    descricao: 'Plano para quem está começando a vender no WhatsApp',
  },
  pro: {
    nome: 'PRO',
    preco: 'R$ 197',
    descricao: 'Plano para quem anuncia todos os dias',
  },
  scale: {
    nome: 'SCALE',
    preco: 'R$ 397',
    descricao: 'Plano para operações maiores e agências',
  },
  lancamento: {
    nome: 'Lançamento',
    preco: 'R$ 97',
    descricao: 'Plano promocional de lançamento',
  },
  profissional: {
    nome: 'Profissional',
    preco: 'R$ 97/mês',
    descricao: 'Plano profissional para uso contínuo',
  },
  agencia: {
    nome: 'Agência',
    preco: 'R$ 197/mês',
    descricao: 'Plano para agências e multi-clientes',
  },
};

export default function PagamentoPage() {
  return (
    <Suspense>
      <PagamentoPageContent />
    </Suspense>
  );
}

function PagamentoPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planoParam = searchParams.get('plan');
  const plano = planoParam && PLANOS[planoParam as keyof typeof PLANOS] ? PLANOS[planoParam as keyof typeof PLANOS] : PLANOS['pro'];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!planoParam) {
      router.replace('/');
    }
  }, [planoParam, router]);

  const handleMercadoPago = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/pagamento/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planoParam }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        setError('Erro ao redirecionar para o pagamento');
      }
    } catch (err) {
      setError('Erro ao conectar com o Mercado Pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center dark:text-white">Pagamento</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">{plano.nome}</h2>
          <p className="text-lg font-bold text-green-600 mb-1">{plano.preco}</p>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{plano.descricao}</p>
        </div>
        <button
          onClick={handleMercadoPago}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition mb-2 disabled:opacity-60"
        >
          {loading ? 'Redirecionando...' : 'Pagar com Mercado Pago'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        <Link href="/" className="block text-center text-sm text-gray-500 mt-4 hover:underline">Voltar</Link>
      </div>
    </div>
  );
}
// ...existing code...
