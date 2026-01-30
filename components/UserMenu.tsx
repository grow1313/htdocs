"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function UserMenu() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold text-gray-700 dark:text-white">
        {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
      </div>
      <Link
        href="/pagamento?plan=pro"
        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition font-semibold ml-2"
        title="Assinar plano PRO"
      >
        <span role="img" aria-label="Coroa" className="text-base">👑</span>
        Assinar Plano
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="ml-2 px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
        title="Sair da conta"
      >
        Sair
      </button>
    </div>
  );
}
