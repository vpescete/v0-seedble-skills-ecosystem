"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SkillAnalytics } from "@/components/skill-analytics"
import { PeerReviewWorkflow } from "@/components/peer-review-workflow"
import { ReviewManagement } from "@/components/review-management"
import { AssessmentDashboard } from "@/components/assessment-dashboard"
import { ProjectManagement } from "@/components/project-management"
import { SkillAssessmentWizard } from "@/components/skill-assessment-wizard"
import { getUserSkills, getKnowledgeCircles } from "@/lib/data-service"
import type { Skill, UserSkill, KnowledgeCircle } from "@/lib/types"
import {
  BookOpen,
  Brain,
  Calendar,
  LineChartIcon as ChartLine,
  ChevronLeft,
  ChevronRight,
  Code,
  Filter,
  FolderOpen,
  Home,
  Loader2,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react"
import { NotificationSystem } from "@/components/notification-system"
import { TeamDashboard } from "@/components/team-dashboard"

export default function SeedbleSkillsDashboard() {
  const { user, profile, isLoading, signOut } = useAuth()
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(15)
  const [activeView, setActiveView] = useState("dashboard")
  const [userSkills, setUserSkills] = useState<(UserSkill & { skill: Skill })[]>([])
  const [knowledgeCircles, setKnowledgeCircles] = useState<KnowledgeCircle[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [showAssessmentWizard, setShowAssessmentWizard] = useState(false)
  const hasInitialized = useRef(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/sign-in")
    }
  }, [isLoading, user, router])

  // Fetch user data
  useEffect(() => {
    if (user && !hasInitialized.current) {
      const fetchData = async () => {
        setIsDataLoading(true)

        try {
          const [skills, circles] = await Promise.all([getUserSkills(), getKnowledgeCircles()])

          setUserSkills(skills)
          setKnowledgeCircles(circles)
          hasInitialized.current = true
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setIsDataLoading(false)
        }
      }

      fetchData()
    }
  }, [user])

  const refreshUserData = useCallback(async () => {
    if (user) {
      setIsDataLoading(true)
      try {
        const [skills, circles] = await Promise.all([getUserSkills(), getKnowledgeCircles()])
        setUserSkills(skills)
        setKnowledgeCircles(circles)
      } catch (error) {
        console.error("Error refreshing user data:", error)
      } finally {
        setIsDataLoading(false)
      }
    }
  }, [user])

  const handleAssessmentComplete = useCallback(() => {
    setShowAssessmentWizard(false)
    refreshUserData()
  }, [refreshUserData])

  // Process skills data for display
  const processedSkillsData = [
    {
      category: "Technical Skills",
      skills: userSkills
        .filter((item) => item.skill.category === "technical")
        .map((item) => ({
          name: item.skill.name,
          level: item.level,
          trend: "up", // This would come from historical data in a real app
          projects: Math.floor(Math.random() * 10) + 1, // Placeholder
        })),
    },
    {
      category: "Soft Skills",
      skills: userSkills
        .filter((item) => item.skill.category === "soft")
        .map((item) => ({
          name: item.skill.name,
          level: item.level,
          trend: Math.random() > 0.5 ? "up" : "stable", // Placeholder
          projects: Math.floor(Math.random() * 15) + 1, // Placeholder
        })),
    },
  ]

  // Sample online users (would come from Supabase presence in a real app)
  const onlineUsers = [
    { name: "Marco Rossi", role: "Senior Developer", avatar: "MR", status: "online" },
    { name: "Anna Bianchi", role: "UX Designer", avatar: "AB", status: "online" },
    { name: "Luca Verde", role: "Project Manager", avatar: "LV", status: "away" },
    { name: "Sofia Neri", role: "Data Scientist", avatar: "SN", status: "online" },
  ]

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-purple-600" />
          <p className="text-gray-600">Loading Seedble Skills Ecosystem...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("No user, redirecting to sign in...")
    router.push("/auth/sign-in")
    return null
  }

  // Log successful authentication
  console.log("User authenticated:", {
    userId: user.id,
    email: user.email
  })

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-purple-600 to-purple-800 text-white p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <h1 className="text-xl font-bold">Seedble</h1>
        </div>

        <nav className="space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-white/20 ${activeView === "dashboard" ? "bg-white/10" : ""}`}
            onClick={() => setActiveView("dashboard")}
          >
            <Home className="w-4 h-4 mr-3" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-white/20 ${activeView === "assessment" ? "bg-white/10" : ""}`}
            onClick={() => setActiveView("assessment")}
          >
            <BookOpen className="w-4 h-4 mr-3" />
            Skills Assessment
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-white/20 ${activeView === "projects" ? "bg-white/10" : ""}`}
            onClick={() => setActiveView("projects")}
          >
            <FolderOpen className="w-4 h-4 mr-3" />
            Projects
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-white/20 ${activeView === "knowledge" ? "bg-white/10" : ""}`}
            onClick={() => setActiveView("knowledge")}
          >
            <Users className="w-4 h-4 mr-3" />
            Knowledge Circles
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-white/20 ${activeView === "reviews" ? "bg-white/10" : ""}`}
            onClick={() => setActiveView("reviews")}
          >
            <MessageSquare className="w-4 h-4 mr-3" />
            Peer Reviews
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-white hover:bg-white/20 ${activeView === "management" ? "bg-white/10" : ""}`}
            onClick={() => setActiveView("management")}
          >
            <Trophy className="w-4 h-4 mr-3" />
            Review Management
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
            <ChartLine className="w-4 h-4 mr-3" />
            Analytics
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
            <Calendar className="w-4 h-4 mr-3" />
            Mentoring
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20">
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Button>
        </nav>

        <div className="mt-auto pt-6">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeView === "dashboard" && "Skills Dashboard"}
                {activeView === "assessment" && "Skills Assessment"}
                {activeView === "projects" && "Project Management"}
                {activeView === "knowledge" && "Knowledge Circles"}
                {activeView === "reviews" && "Peer Reviews"}
                {activeView === "management" && "Review Management"}
              </h2>
              <p className="text-gray-600">
                {activeView === "dashboard" && "Manage and develop your professional competencies"}
                {activeView === "assessment" && "Evaluate and track your skills with AI guidance"}
                {activeView === "projects" && "Create and manage projects with AI-powered team recommendations"}
                {activeView === "knowledge" && "Connect with communities of practice"}
                {activeView === "reviews" && "Structured competency evaluation and feedback"}
                {activeView === "management" && "Oversee and validate peer review processes"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search..." className="pl-10 w-64" />
              </div>
              <NotificationSystem />
              {activeView === "assessment" && (
                <Button onClick={() => setShowAssessmentWizard(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Target className="w-4 h-4 mr-2" />
                  New Assessment
                </Button>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{profile?.full_name}</span>
                <Avatar>
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback>
                    {profile?.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {isDataLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-purple-600" />
                <p className="text-gray-600">Loading your data...</p>
              </div>
            </div>
          ) : activeView === "dashboard" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Skills Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Filter Bar */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Filter by:</span>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Skills</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="soft">Soft Skills</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="level">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="level">Level</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>

                {/* Skills Categories */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="soft">Soft Skills</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    {processedSkillsData.map((category, idx) => (
                      <Card key={idx}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            {category.category === "Technical Skills" ? (
                              <Code className="w-5 h-5 text-blue-500" />
                            ) : (
                              <Users className="w-5 h-5 text-green-500" />
                            )}
                            {category.category}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {category.skills.length > 0 ? (
                            <div className="space-y-4">
                              {category.skills.map((skill, skillIdx) => (
                                <div key={skillIdx} className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium">{skill.name}</span>
                                      <Badge variant="secondary" className="text-xs">
                                        {skill.projects} projects
                                      </Badge>
                                      {skill.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Progress value={skill.level * 20} className="flex-1" />
                                      <span className="text-sm text-gray-600">Level {skill.level}/5</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500">No skills found in this category</p>
                              <Button variant="outline" className="mt-4" onClick={() => setShowAssessmentWizard(true)}>
                                Start Skills Assessment
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="technical">
                    <Card>
                      <CardHeader>
                        <CardTitle>Technical Skills Deep Dive</CardTitle>
                        <CardDescription>Your technical competencies and development areas</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {processedSkillsData[0].skills.length > 0 ? (
                          <div className="space-y-4">
                            {processedSkillsData[0].skills.map((skill, idx) => (
                              <div key={idx} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{skill.name}</h4>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < skill.level ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  Used in {skill.projects} projects this year
                                </p>
                                <Button variant="outline" size="sm">
                                  Request Peer Review
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500">No technical skills found</p>
                            <Button variant="outline" className="mt-4" onClick={() => setShowAssessmentWizard(true)}>
                              Start Skills Assessment
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="soft">
                    <Card>
                      <CardHeader>
                        <CardTitle>Soft Skills Assessment</CardTitle>
                        <CardDescription>Behavioral and interpersonal competencies</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {processedSkillsData[1].skills.length > 0 ? (
                          <div className="space-y-4">
                            {processedSkillsData[1].skills.map((skill, idx) => (
                              <div key={idx} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{skill.name}</h4>
                                  <Badge variant="outline">Level {skill.level}</Badge>
                                </div>
                                <Progress value={skill.level * 20} className="mb-2" />
                                <p className="text-sm text-gray-600">
                                  Demonstrated in {skill.projects} collaborative projects
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500">No soft skills found</p>
                            <Button variant="outline" className="mt-4" onClick={() => setShowAssessmentWizard(true)}>
                              Start Skills Assessment
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="analytics">
                    <SkillAnalytics />
                  </TabsContent>
                  <TabsContent value="team" className="space-y-6">
                    <TeamDashboard />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Calendar */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">December 2024</CardTitle>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <div key={day} className="p-1 text-gray-500 font-medium">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`p-2 text-sm rounded-md hover:bg-gray-100 ${
                            date === selectedDate
                              ? "bg-purple-500 text-white"
                              : date === 9 || date === 23
                                ? "bg-blue-100 text-blue-600"
                                : ""
                          }`}
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Online Users */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Online Mentors</CardTitle>
                    <CardDescription>Available for skill guidance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {onlineUsers.map((user, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                user.status === "online" ? "bg-green-400" : "bg-yellow-400"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Knowledge Circles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Knowledge Circles</CardTitle>
                    <CardDescription>Join communities of practice</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {knowledgeCircles.map((circle, idx) => (
                        <div key={idx} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${circle.color}`}>
                              {circle.icon === "Brain" && <Brain className="w-4 h-4 text-white" />}
                              {circle.icon === "Code" && <Code className="w-4 h-4 text-white" />}
                              {circle.icon === "Target" && <Target className="w-4 h-4 text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{circle.name}</h4>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{circle.description}</p>
                              <p className="text-xs text-gray-500 mt-2">{circle.member_count} members</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : activeView === "projects" ? (
            <ProjectManagement />
          ) : activeView === "reviews" ? (
            <PeerReviewWorkflow />
          ) : activeView === "management" ? (
            <ReviewManagement />
          ) : activeView === "assessment" ? (
            <AssessmentDashboard onDataRefresh={refreshUserData} />
          ) : null}
        </div>
      </div>

      {/* Assessment Wizard Modal */}
      {showAssessmentWizard && (
        <SkillAssessmentWizard isOpen={showAssessmentWizard} onClose={handleAssessmentComplete} />
      )}
    </div>
  )
}
