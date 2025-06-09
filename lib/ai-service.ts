import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { UserSkill, Skill } from "./types"

// Genera insights personalizzati basati sulle competenze dell'utente
export async function generateSkillInsights(userSkills: (UserSkill & { skill: Skill })[]) {
  try {
    // Prepara i dati delle competenze in un formato adatto per l'AI
    const skillsData = userSkills.map((item) => ({
      name: item.skill.name,
      category: item.skill.category,
      level: item.level,
      interest: item.interest,
      priority: item.is_priority,
      lastAssessed: item.last_assessed,
    }))

    // Crea un prompt per l'AI
    const prompt = `
      Analizza le seguenti competenze di un professionista:
      ${JSON.stringify(skillsData, null, 2)}
      
      Genera 3 insights personalizzati basati su questi dati. Per ogni insight, fornisci:
      1. Un titolo conciso
      2. Una breve descrizione del problema o dell'opportunità
      3. Un'azione consigliata
      4. Una priorità (alta, media, bassa)
      
      Formatta la risposta come JSON valido con questa struttura:
      [
        {
          "title": "Titolo dell'insight",
          "description": "Descrizione dettagliata",
          "action": "Azione consigliata",
          "priority": "high|medium|low"
        }
      ]
    `

    // Chiama l'AI per generare gli insights
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      system:
        "Sei un consulente esperto di sviluppo professionale che analizza competenze e fornisce consigli strategici.",
    })

    // Analizza la risposta JSON
    return JSON.parse(text)
  } catch (error) {
    console.error("Errore nella generazione degli insights AI:", error)
    // Ritorna insights predefiniti in caso di errore
    return [
      {
        title: "Skill Gap Identified",
        description: "Your DevOps skills could benefit from focused development to match your seniority level",
        action: "Explore DevOps Learning Path",
        priority: "high",
      },
      {
        title: "Emerging Skill Opportunity",
        description: "AI/ML skills are trending in your field. Consider adding them to your development plan",
        action: "Assess AI/ML Skills",
        priority: "medium",
      },
    ]
  }
}

// Genera suggerimenti di competenze basati sul ruolo
export async function suggestSkillsForRole(role: string, experience: string) {
  try {
    const prompt = `
      Suggerisci competenze rilevanti per un professionista con il ruolo di "${role}" 
      e livello di esperienza "${experience}".
      
      Dividi le competenze in tre categorie:
      1. Competenze tecniche
      2. Soft skills
      3. Competenze di processo
      
      Per ogni competenza, fornisci:
      - Nome della competenza
      - Livello di confidenza (percentuale) che questa competenza sia rilevante
      - Una breve motivazione per cui questa competenza è importante
      
      Formatta la risposta come JSON valido con questa struttura:
      {
        "technical": [
          { "name": "Nome competenza", "confidence": 95, "reason": "Motivazione" }
        ],
        "soft": [
          { "name": "Nome competenza", "confidence": 90, "reason": "Motivazione" }
        ],
        "process": [
          { "name": "Nome competenza", "confidence": 85, "reason": "Motivazione" }
        ]
      }
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      system:
        "Sei un esperto di sviluppo professionale che conosce le competenze richieste in vari ruoli nel settore tecnologico.",
    })

    return JSON.parse(text)
  } catch (error) {
    console.error("Errore nella generazione dei suggerimenti di competenze:", error)
    // Ritorna dati predefiniti in caso di errore
    return {
      technical: [
        { name: "JavaScript", confidence: 95, reason: "Essential for modern web development" },
        { name: "React", confidence: 90, reason: "Popular frontend framework" },
      ],
      soft: [{ name: "Communication", confidence: 95, reason: "Essential for team collaboration" }],
      process: [{ name: "Agile", confidence: 90, reason: "Standard development methodology" }],
    }
  }
}
