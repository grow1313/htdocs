"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const planoParam = searchParams.get('plan');
  const plano = PLANOS[planoParam] || PLANOS['pro'];

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
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Erro ao iniciar pagamento.');
      }
    } catch (e) {
      setError('Erro ao conectar com Mercado Pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2">Pagamento</h1>
        <p className="text-gray-600 mb-6">Confira os detalhes do seu plano e finalize a assinatura.</p>
        <div className="mb-6 p-4 rounded-xl border border-gray-200 bg-gray-50">
          <div className="text-xl font-bold mb-1">{plano.nome}</div>
          <div className="text-3xl font-bold text-whatsapp-light mb-2">{plano.preco}</div>
          <div className="text-gray-600 text-sm mb-2">{plano.descricao}</div>
        </div>
        {/* Pagamento Mercado Pago real */}
        <button
          className="w-full bg-whatsapp-light text-white py-3 rounded-lg font-semibold hover:bg-whatsapp-dark transition mb-4 disabled:opacity-60"
          onClick={handleMercadoPago}
          disabled={loading}
        >
          {loading ? 'Redirecionando...' : 'Pagar com Mercado Pago'}
        </button>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <p className="text-xs text-gray-500 mt-4">
          Ao finalizar o pagamento, você terá acesso imediato à plataforma.
        </p>
        <Link href="/dashboard" className="block mt-6 text-whatsapp-light hover:underline text-sm">
          Voltar para o dashboard
        </Link>
      </div>
    </div>
  );
}
