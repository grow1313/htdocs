// app/eduzz-connect/page.tsx
import React from 'react'

export default function EduzzConnect() {
  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Conectar Eduzz</h1>
      <p className="mb-6">Insira suas credenciais da Eduzz para integrar vendas e webhooks.</p>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Email Eduzz</label>
          <input type="email" name="email" className="border rounded px-3 py-2 w-full" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Public Key</label>
          <input type="text" name="publicKey" className="border rounded px-3 py-2 w-full" required />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Conectar</button>
      </form>
    </div>
  )
}
