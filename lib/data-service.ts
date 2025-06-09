import { getSupabaseClient } from "./supabase"
import type { User, Skill, UserSkill, Assessment, PeerReview, Project, KnowledgeCircle } from "./types"

// User profile functions
export async function getUserProfile() {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data as User
}

export async function updateUserProfile(profile: Partial<User>) {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  const { data, error } = await supabase.from("profiles").update(profile).eq("id", user.id).select().single()

  return { data, error }
}

// Skills functions
export async function getAllSkills() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("skills").select("*").order("name")

  if (error) {
    console.error("Error fetching skills:", error)
    return []
  }

  return data as Skill[]
}

// Aggiungi questa funzione dopo getAllSkills
export async function createSkillIfNotExists(skillName: string, category: "technical" | "soft" | "process") {
  const supabase = getSupabaseClient()

  // Check if skill already exists
  const { data: existingSkill } = await supabase.from("skills").select("*").ilike("name", skillName).maybeSingle()

  if (existingSkill) {
    return existingSkill
  }

  // Create new skill
  const { data, error } = await supabase
    .from("skills")
    .insert({
      name: skillName,
      category: category,
      description: `${category} skill: ${skillName}`,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating skill:", error)
    return null
  }

  return data
}

export async function getUserSkills(userId?: string) {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const targetUserId = userId || user?.id

  if (!targetUserId) return []

  const { data, error } = await supabase
    .from("user_skills")
    .select(`
      *,
      skill:skills(*)
    `)
    .eq("user_id", targetUserId)

  if (error) {
    console.error("Error fetching user skills:", error)
    return []
  }

  return data as (UserSkill & { skill: Skill })[]
}

export async function updateUserSkill(skillData: Partial<UserSkill>) {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  // Check if skill exists for user
  const { data: existingSkill } = await supabase
    .from("user_skills")
    .select("*")
    .eq("user_id", user.id)
    .eq("skill_id", skillData.skill_id)
    .maybeSingle()

  let result

  if (existingSkill) {
    // Update existing skill
    result = await supabase
      .from("user_skills")
      .update({
        ...skillData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingSkill.id)
      .select()
      .single()
  } else {
    // Insert new skill
    result = await supabase
      .from("user_skills")
      .insert({
        user_id: user.id,
        ...skillData,
        last_assessed: new Date().toISOString(),
      })
      .select()
      .single()
  }

  return result
}

// Assessment functions
export async function getUserAssessments() {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching assessments:", error)
    return []
  }

  return data as Assessment[]
}

export async function createAssessment(assessmentData: Partial<Assessment>) {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  const { data, error } = await supabase
    .from("assessments")
    .insert({
      user_id: user.id,
      status: "in_progress",
      ...assessmentData,
    })
    .select()
    .single()

  return { data, error }
}

export async function completeAssessment(assessmentId: string, skillsEvaluated: number, completionTime: number) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("assessments")
    .update({
      status: "completed",
      skills_evaluated: skillsEvaluated,
      completion_time: completionTime,
      completed_at: new Date().toISOString(),
    })
    .eq("id", assessmentId)
    .select()
    .single()

  return { data, error }
}

// Peer review functions
export async function getPeerReviews() {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { pending: [], completed: [], received: [] }

  try {
    // Get reviews where user is reviewer
    const { data: reviewerData, error: reviewerError } = await supabase
      .from("peer_reviews")
      .select(`
        *,
        reviewee:reviewee_id(id, full_name, avatar_url, role),
        project:projects(id, name, description)
      `)
      .eq("reviewer_id", user.id)
      .order("created_at", { ascending: false })

    if (reviewerError) {
      console.error("Error fetching reviews as reviewer:", reviewerError)
    }

    // Get reviews where user is reviewee
    const { data: revieweeData, error: revieweeError } = await supabase
      .from("peer_reviews")
      .select(`
        *,
        reviewer:reviewer_id(id, full_name, avatar_url, role),
        project:projects(id, name, description)
      `)
      .eq("reviewee_id", user.id)
      .order("created_at", { ascending: false })

    if (revieweeError) {
      console.error("Error fetching reviews as reviewee:", revieweeError)
    }

    const pending = (reviewerData || []).filter(
      (review) => review.status === "pending" || review.status === "in_progress",
    )

    const completed = (reviewerData || []).filter(
      (review) => review.status === "completed" || review.status === "validated",
    )

    const received = revieweeData || []

    return { pending, completed, received }
  } catch (error) {
    console.error("Error in getPeerReviews:", error)
    return { pending: [], completed: [], received: [] }
  }
}

export async function createPeerReview(reviewData: {
  reviewee_id: string
  project_id: string
  reviewer_id?: string
}) {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Not authenticated" }

  const { data, error } = await supabase
    .from("peer_reviews")
    .insert({
      reviewer_id: reviewData.reviewer_id || user.id,
      reviewee_id: reviewData.reviewee_id,
      project_id: reviewData.project_id,
      status: "pending",
    })
    .select()
    .single()

  return { data, error }
}

export async function updatePeerReview(reviewId: string, reviewData: Partial<PeerReview>) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("peer_reviews")
    .update({
      ...reviewData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reviewId)
    .select()
    .single()

  return { data, error }
}

export async function submitPeerReview(
  reviewId: string,
  scores: {
    technical_score: number
    soft_score: number
    process_score: number
    innovation_score: number
  },
  feedback: string,
  skillRatings: Array<{ skill_id: string; score: number; feedback?: string }>,
) {
  const supabase = getSupabaseClient()

  try {
    // Calculate overall score
    const overall_score =
      (scores.technical_score + scores.soft_score + scores.process_score + scores.innovation_score) / 4

    // Update the main review
    const { data: reviewData, error: reviewError } = await supabase
      .from("peer_reviews")
      .update({
        ...scores,
        overall_score,
        feedback,
        status: "completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", reviewId)
      .select()
      .single()

    if (reviewError) throw reviewError

    // Insert skill ratings
    if (skillRatings.length > 0) {
      const { error: skillError } = await supabase.from("review_details").insert(
        skillRatings.map((rating) => ({
          review_id: reviewId,
          skill_id: rating.skill_id,
          score: rating.score,
          feedback: rating.feedback,
        })),
      )

      if (skillError) throw skillError
    }

    return { data: reviewData, error: null }
  } catch (error) {
    console.error("Error submitting peer review:", error)
    return { data: null, error }
  }
}

// Get all users for review assignment
export async function getAllUsers() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role, department")
    .order("full_name")

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data
}

// Get all projects
export async function getAllProjects() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("projects").select("*").eq("status", "active").order("name")

  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }

  return data as Project[]
}
// Knowledge circles functions
export async function getKnowledgeCircles() {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("knowledge_circles")
    .select(`
      *,
      member_count:circle_members(count)
    `)
    .order("name")

  if (error) {
    console.error("Error fetching knowledge circles:", error)
    return []
  }

  // Transform the data to match our type
  const circles = data.map((circle) => ({
    ...circle,
    member_count: circle.member_count[0].count,
  }))

  return circles as KnowledgeCircle[]
}

// Projects functions
export async function getUserProjects() {
  const supabase = getSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("project_members")
    .select(`
      project:project_id(*)
    `)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching user projects:", error)
    return []
  }

  return data.map((item) => item.project) as Project[]
}
