import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do NOT remove this. It refreshes session if expired.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Simple Route Protection:
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                           request.nextUrl.pathname.startsWith('/marketplace') ||
                           request.nextUrl.pathname.startsWith('/calendar') ||
                           request.nextUrl.pathname.startsWith('/communities') ||
                           request.nextUrl.pathname.startsWith('/barter') ||
                           request.nextUrl.pathname.startsWith('/recruitment') ||
                           request.nextUrl.pathname.startsWith('/admin')

  const isAuthRoute = request.nextUrl.pathname === '/' || 
                      request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/signup')

  if (!user && isDashboardRoute) {
    // Redirect to login (root page)
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    // Redirect to home dashboard
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
