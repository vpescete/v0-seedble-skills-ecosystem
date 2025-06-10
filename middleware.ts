import { NextResponse, NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/static") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  try {
    // Create a response object that we can modify
    const response = NextResponse.next()

    // Get the session from the request cookies
    const cookieStore = {
      get: (key: string) => {
        const cookie = request.cookies.get(key)
        return cookie ? { value: cookie.value } : undefined
      }
    }
    const supabase = createServerSupabaseClient(cookieStore)
    const { data: { session }, error } = await supabase.auth.getSession()

    // Log session state for debugging
    console.log("Middleware - Session state:", {
      hasSession: !!session,
      path: request.nextUrl.pathname,
      error: error?.message,
      cookies: request.cookies.getAll().map(c => ({
        name: c.name,
        value: c.value.substring(0, 10) + "..." // Only log first 10 chars for security
      }))
    })

    // If no session and not on auth page, redirect to sign in
    if (!session && !request.nextUrl.pathname.startsWith("/auth")) {
      console.log("No session, redirecting to sign in")
      return NextResponse.redirect(new URL("/auth/sign-in", request.url))
    }

    // If has session and on auth page, redirect to home
    if (session && request.nextUrl.pathname.startsWith("/auth")) {
      console.log("Has session, redirecting to home")
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Add session info to response headers for debugging
    response.headers.set("x-session-exists", session ? "true" : "false")
    if (session?.user) {
      response.headers.set("x-user-id", session.user.id)
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    // On error, redirect to sign in
    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)"
  ]
}
