import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    '/',
    '/login',
    '/register',
  ]

  // Rotas de API públicas
  const publicApiRoutes = [
    '/api/auth',
    '/api/integrations/whatsapp', // Webhook público
    '/api/integrations/hotmart', // Webhook público
  ]

  // Verificar se é rota pública
  const isPublicRoute = publicRoutes.includes(pathname)
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route))

  // Se for rota pública, permitir acesso
  if (isPublicRoute || isPublicApiRoute) {
    return NextResponse.next()
  }

  // Verificar se usuário está autenticado
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Se não estiver autenticado e tentar acessar rota protegida
  if (!token) {
    // Se for API, retornar 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Se for página, redirecionar para login
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Se estiver autenticado e tentar acessar login/register, redirecionar para dashboard
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Permitir acesso
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}
