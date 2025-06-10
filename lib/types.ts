export type User = {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: string
  department: string
  created_at: string
  updated_at: string
}

export type Skill = {
  id: string
  name: string
  category: "technical" | "soft" | "process"
  description?: string
  created_at: string
}

export type UserSkill = {
  id: string
  user_id: string
  skill_id: string
  level: number
  interest: number
  is_priority: boolean
  last_assessed: string
  created_at: string
  updated_at: string
}

export type Assessment = {
  id: string
  user_id: string
  type: "complete" | "quick" | "role-specific"
  status: "in_progress" | "completed"
  skills_evaluated: number
  completion_time?: number
  created_at: string
  completed_at?: string
}

export type PeerReview = {
  id: string
  reviewer_id: string
  reviewee_id: string
  project_id: string
  status: "pending" | "in_progress" | "completed" | "validated" | "flagged"
  technical_score?: number
  soft_score?: number
  process_score?: number
  innovation_score?: number
  overall_score?: number
  feedback?: string
  created_at: string
  updated_at: string
  completed_at?: string
  validated_at?: string
}

export type Project = {
  id: string
  name: string
  description?: string
  start_date: string
  end_date?: string
  status: "active" | "completed" | "archived"
  created_at: string
}

export type KnowledgeCircle = {
  id: string
  name: string
  description?: string
  category: string
  icon: string
  color: string
  member_count: number
  created_at: string
}
