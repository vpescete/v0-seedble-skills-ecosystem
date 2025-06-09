"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SkillAssessmentWizard } from "./skill-assessment-wizard"
import { getUserAssessments, getUserSkills } from "@/lib/data-service"
import type { Assessment, UserSkill, Skill } from "@/lib/types"
import {
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Play,
  RefreshCw,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
  Loader2,
} from "lucide-react"

// AI insights and recommendations
const aiInsights = [
  {
    title: "Skill Gap Identified",
    description: "Your DevOps skills could benefit from focused development to match your seniority level",
    action: "Explore DevOps Learning Path",
    priority: "high",
    icon: Target,
  },
  {
    title: "Emerging Skill Opportunity",
    description: "AI/ML skills are trending in your field. Consider adding them to your development plan",
    action: "Assess AI/ML Skills",
    priority: "medium",
    icon: Sparkles,
  },
  {
    title: "Strength Leverage",
    description: "Your React expertise is above average. Consider mentoring others to build leadership skills",
    action: "Join Mentoring Program",
    priority: "low",
    icon: Users,
  },
]

// Recommended assessment types
const assessmentTypes = [
  {
    title: "Complete Skills Assessment",
    description: "Comprehensive evaluation of all your skills with AI-powered insights",
    duration: "10-15 minutes",
    skills: "20-30 skills",
    recommended: true,
    icon: Brain,
  },
  {
    title: "Quick Skills Update",
    description: "Update your existing skills and add new ones you've developed",
    duration: "3-5 minutes",
    skills: "5-10 skills",
    recommended: false,
    icon: RefreshCw,
  },
  {
    title: "Role-Specific Assessment",
    description: "Focused evaluation for a specific role or career transition",
    duration: "8-12 minutes",
    skills: "15-20 skills",
    recommended: false,
    icon: Target,
  },
]

export function AssessmentDashboard({ onDataRefresh }: { onDataRefresh?: () => void }) {
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [selectedAssessmentType, setSelectedAssessmentType] = useState("")
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [userSkills, setUserSkills] = useState<(UserSkill & { skill: Skill })[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Carica i dati quando il componente si monta
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [assessmentsData, skillsData] = await Promise.all([getUserAssessments(), getUserSkills()])
      setAssessments(assessmentsData)
      setUserSkills(skillsData)
    } catch (error) {
      console.error("Error loading assessment data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const startAssessment = (type: string) => {
    setSelectedAssessmentType(type)
    setIsWizardOpen(true)
  }

  const handleWizardClose = () => {
    setIsWizardOpen(false)
    // Ricarica i dati quando il wizard si chiude
    loadData()
    if (onDataRefresh) {
      onDataRefresh()
    }
  }

  // Calcola le statistiche dai dati reali
  const lastAssessment = assessments[0] // Il più recente
  const skillsTracked = userSkills.length
  const averageLevel =
    userSkills.length > 0
      ? (userSkills.reduce((sum, skill) => sum + skill.level, 0) / userSkills.length).toFixed(1)
      : "0"

  // Formatta la data per la visualizzazione
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
    })
  }

  // Formatta il tempo di completamento
  const formatCompletionTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Skills Assessment</h2>
          <p className="text-gray-500">Evaluate and track your professional competencies with AI guidance</p>
        </div>
        <Button onClick={() => startAssessment("complete")} className="bg-purple-600 hover:bg-purple-700">
          <Play className="w-4 h-4 mr-2" />
          Start Assessment
        </Button>
      </div>

      {/* Assessment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Assessment</p>
                <p className="text-2xl font-bold">{lastAssessment ? formatDate(lastAssessment.created_at) : "None"}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              {lastAssessment ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Completed</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">No assessments</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Skills Tracked</p>
                <p className="text-2xl font-bold">{skillsTracked}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">
                {lastAssessment
                  ? `+${lastAssessment.skills_evaluated || 0} this assessment`
                  : "Start your first assessment"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Level</p>
                <p className="text-2xl font-bold">{averageLevel}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">
                {userSkills.length > 0 ? "Skills assessed" : "No skills yet"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Review</p>
                <p className="text-2xl font-bold">7d</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Quarterly cycle</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>Personalized recommendations based on your skill data and industry trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg">
                <div
                  className={`p-2 rounded-full ${
                    insight.priority === "high"
                      ? "bg-red-100"
                      : insight.priority === "medium"
                        ? "bg-yellow-100"
                        : "bg-blue-100"
                  }`}
                >
                  <insight.icon
                    className={`w-4 h-4 ${
                      insight.priority === "high"
                        ? "text-red-600"
                        : insight.priority === "medium"
                          ? "text-yellow-600"
                          : "text-blue-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge
                      variant={
                        insight.priority === "high"
                          ? "destructive"
                          : insight.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {insight.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                  <Button variant="outline" size="sm">
                    {insight.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assessment Types */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Assessment Type</CardTitle>
          <CardDescription>Select the assessment that best fits your current needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assessmentTypes.map((type, idx) => (
              <Card
                key={idx}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  type.recommended ? "ring-2 ring-purple-500 bg-purple-50" : ""
                }`}
                onClick={() => startAssessment(type.title)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <type.icon className="w-6 h-6 text-purple-500" />
                    {type.recommended && <Badge className="bg-purple-100 text-purple-800">Recommended</Badge>}
                  </div>
                  <h3 className="font-semibold mb-2">{type.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{type.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-3 h-3" />
                      <span>{type.skills}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assessment History */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment History</CardTitle>
          <CardDescription>Track your skill evaluation progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Loading assessments...</span>
            </div>
          ) : assessments.length > 0 ? (
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{assessment.type || "Skills Assessment"}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{formatDate(assessment.created_at)}</span>
                        <span>•</span>
                        <span>{assessment.skills_evaluated || 0} skills</span>
                        <span>•</span>
                        <span>
                          {assessment.completion_time ? formatCompletionTime(assessment.completion_time) : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {assessment.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No assessments completed yet</p>
              <Button onClick={() => startAssessment("complete")} variant="outline">
                Start Your First Assessment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assessment Wizard */}
      <SkillAssessmentWizard isOpen={isWizardOpen} onClose={handleWizardClose} />
    </div>
  )
}
