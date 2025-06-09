import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getUserSkills } from "@/lib/data-service"
import { generateSkillInsights } from "@/lib/ai-service"

export async function GET() {
  try {
    // Crea un client Supabase per il server
    const supabase = createServerSupabaseClient()

    // Ottieni la sessione dell'utente
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
    }

    // Ottieni le competenze dell'utente
    const userSkills = await getUserSkills(session.user.id)

    if (userSkills.length === 0) {
      return NextResponse.json({
        insights: [
          {
            title: "Complete Your First Assessment",
            description: "You haven't completed a skills assessment yet. Start now to get personalized insights.",
            action: "Start Assessment",
            priority: "high",
          },
        ],
      })
    }

    // Genera insights basati sulle competenze
    const insights = await generateSkillInsights(userSkills)

    return NextResponse.json({ insights })
  } catch (error) {
    console.error("Errore nella generazione degli insights:", error)
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
