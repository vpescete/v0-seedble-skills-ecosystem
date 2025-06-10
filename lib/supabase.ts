import { createClient } from "@supabase/supabase-js"

// These environment variables need to be set in your project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a singleton instance for client-side usage
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        storageKey: "supabase.auth.token",
        storage: {
          getItem: (key) => {
            try {
              const value = document.cookie
                .split("; ")
                .find((row) => row.startsWith(`${key}=`))
                ?.split("=")[1]
              return value ? decodeURIComponent(value) : null
            } catch (error) {
              console.error("Error getting item from cookies:", error)
              return null
            }
          },
          setItem: (key, value) => {
            try {
              document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`
            } catch (error) {
              console.error("Error setting item in cookies:", error)
            }
          },
          removeItem: (key) => {
            try {
              document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax`
            } catch (error) {
              console.error("Error removing item from cookies:", error)
            }
          }
        }
      }
    })
  }
  return supabaseClient
}

// For server components
export const createServerSupabaseClient = (cookieStore: { get: (key: string) => { value: string } | undefined }) => {
  const supabaseAuthToken = cookieStore.get("supabase.auth.token")?.value

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        storageKey: "supabase.auth.token",
        storage: {
          getItem: (key) => {
            try {
              if (key === "supabase.auth.token") {
                return supabaseAuthToken || null
              }
              return null
            } catch (error) {
              console.error("Error getting item from cookies:", error)
              return null
            }
          },
          setItem: (key, value) => {
            // No-op on server side
          },
          removeItem: (key) => {
            // No-op on server side
          }
        }
      }
    }
  )
}
