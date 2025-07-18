import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    const isLoginPage = pathname === '/login'
    const isPublic =
        isLoginPage ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon')

    if (!token && !isPublic) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && isLoginPage) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}
export const config = {
    matcher: ['/((?!_next|favicon.ico).*)'],
}
