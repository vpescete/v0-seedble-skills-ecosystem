import { NextResponse } from "next/server"
import { suggestSkillsForRole } from "@/lib/ai-service"

export async function POST(request: Request) {
  try {
    const { role, experience } = await request.json()

    if (!role) {
      return NextResponse.json({ error: "Ruolo richiesto" }, { status: 400 })
    }

    const suggestions = await suggestSkillsForRole(role, experience || "mid-level")

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Errore nella generazione dei suggerimenti:", error)
    return NextResponse.json({ error: "Errore del server" }, { status: 500 })
  }
}
