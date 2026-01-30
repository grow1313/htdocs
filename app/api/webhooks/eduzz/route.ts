// app/api/webhooks/eduzz/route.ts
import { NextResponse } from 'next/server'
import { getEduzzWebhooks } from '@/lib/eduzz'

export async function POST(request: Request) {
  try {
    // Recebe e processa o webhook da Eduzz
    const body = await request.json()
    // TODO: Salvar no banco, processar evento, etc.
    const result = await getEduzzWebhooks()
    return NextResponse.json({ success: true, received: body, result })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar webhook Eduzz' }, { status: 500 })
  }
}
