// app/monetizze-connect/page.tsx
import React from 'react'

export default function MonetizzeConnect() {
  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Conectar Monetizze</h1>
      <p className="mb-6">Insira suas credenciais da Monetizze para integrar vendas e webhooks.</p>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Consumer Key</label>
          <input type="text" name="consumerKey" className="border rounded px-3 py-2 w-full" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Consumer Secret</label>
          <input type="text" name="consumerSecret" className="border rounded px-3 py-2 w-full" required />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Conectar</button>
      </form>
    </div>
  )
}
