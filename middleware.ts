import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabase = createServerSupabaseClient()

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not /auth/*, redirect to /auth/sign-in
  if (!session && !request.nextUrl.pathname.startsWith("/auth")) {
    const redirectUrl = new URL("/auth/sign-in", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in and the current path is /auth/*, redirect to /
  if (session && request.nextUrl.pathname.startsWith("/auth")) {
    const redirectUrl = new URL("/", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

// Specify which paths this middleware will run on
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
