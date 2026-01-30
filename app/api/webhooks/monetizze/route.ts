// app/api/webhooks/monetizze/route.ts
import { NextResponse } from 'next/server'
import { getMonetizzeWebhooks } from '@/lib/monetizze'

export async function POST(request: Request) {
  try {
    // Recebe e processa o webhook da Monetizze
    const body = await request.json()
    // TODO: Salvar no banco, processar evento, etc.
    const result = await getMonetizzeWebhooks()
    return NextResponse.json({ success: true, received: body, result })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar webhook Monetizze' }, { status: 500 })
  }
}
