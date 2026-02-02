// Integração Mercado Pago Checkout - Backend API Route
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { plan } = await req.json();

  // Defina os dados do plano conforme o seu sistema
  const plans = {
    start: { title: 'START', price: 97 },
    pro: { title: 'PRO', price: 197 },
    scale: { title: 'SCALE', price: 397 },
    lancamento: { title: 'Lançamento', price: 97 },
    profissional: { title: 'Profissional', price: 97 },
    agencia: { title: 'Agência', price: 197 },
  };
  const selected = plans[plan as keyof typeof plans] || plans['pro'];

  // Chave de acesso Mercado Pago (use variável de ambiente em produção)
  const MP_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!MP_TOKEN) {
    return NextResponse.json({ error: 'Chave Mercado Pago não configurada' }, { status: 500 });
  }

  // Criação da preferência de pagamento
  const preference = {
    items: [
      {
        title: selected.title,
        quantity: 1,
        currency_id: 'BRL',
        unit_price: selected.price,
      },
    ],
    payment_methods: {
      excluded_payment_types: [{ id: 'ticket' }], // Exemplo: exclui boleto
      installments: 1,
    },
    back_urls: {
      success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pagamento/sucesso`,
      failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pagamento/erro`,
      pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pagamento/pending`,
    },
    auto_return: 'approved',
  };

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MP_TOKEN}`,
    },
    body: JSON.stringify(preference),
  });

  const data = await response.json();
  if (!data.init_point) {
    return NextResponse.json({ error: 'Erro ao criar preferência Mercado Pago', details: data }, { status: 500 });
  }

  return NextResponse.json({ url: data.init_point });
}
