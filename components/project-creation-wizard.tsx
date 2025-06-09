"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Target, Sparkles, CheckCircle, Brain, Star, X, Loader2 } from "lucide-react"
import { getAllUsers, getUserSkills, createProject, addProjectMember } from "@/lib/data-service"
import type { User, UserSkill, Skill } from "@/lib/types"

interface ProjectCreationWizardProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreated: (project: any) => void
}

// Available tags for projects
const availableTags = [
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "AI/ML",
  "Data Science",
  "UX/UI",
  "DevOps",
  "Cloud",
  "API",
  "Database",
  "Security",
  "Testing",
  "Performance",
  "Analytics",
  "E-commerce",
  "CRM",
  "ERP",
]

export function ProjectCreationWizard({ isOpen, onClose, onProjectCreated }: ProjectCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    priority: "medium",
    timeline: "",
    budget: "",
    tags: [] as string[],
    requiredSkills: [] as string[],
    teamSize: "3-5",
  })
  const [selectedTeam, setSelectedTeam] = useState<Array<string>>([])
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [userSkills, setUserSkills] = useState<Record<string, (UserSkill & { skill?: Skill })[]>>({})
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadUsers()
    }
  }, [isOpen])

  const loadUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const usersData = await getAllUsers()
      setUsers(usersData as User[])

      // Load skills for each user
      const skillsPromises = usersData.map(user => getUserSkills(user.id as string))
      const skillsResults = await Promise.all(skillsPromises)
      
      const skillsMap: Record<string, (UserSkill & { skill?: Skill })[]> = {}
      usersData.forEach((user, index) => {
        skillsMap[user.id as string] = skillsResults[index]
      })
      setUserSkills(skillsMap)
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const calculateUserCompatibility = (user: User) => {
    const userSkillSet = new Set(userSkills[user.id]?.map(skill => skill.skill_id.toLowerCase()) || [])
    const requiredSkillSet = new Set(projectData.requiredSkills.map(skill => skill.toLowerCase()))
    
    // Calculate skill match percentage
    const matchingSkills = [...userSkillSet].filter(skill => requiredSkillSet.has(skill))
    const skillMatchPercentage = requiredSkillSet.size > 0 
      ? (matchingSkills.length / requiredSkillSet.size) * 100 
      : 0

    // Calculate average skill level
    const skillLevels = userSkills[user.id]?.map(skill => skill.level) || []
    const averageLevel = skillLevels.length > 0 
      ? skillLevels.reduce((sum, level) => sum + level, 0) / skillLevels.length 
      : 0

    return {
      skillMatch: Math.round(skillMatchPercentage),
      averageLevel: Math.round(averageLevel),
      compatibility: Math.round((skillMatchPercentage + averageLevel) / 2)
    }
  }

  const generateAIRecommendations = async () => {
    setIsAnalyzing(true)
    
    // Calculate compatibility for each user
    const usersWithCompatibility = users.map(user => {
      const compatibility = calculateUserCompatibility(user)
      return {
        ...user,
        compatibility: compatibility.compatibility,
        skillMatch: compatibility.skillMatch,
        averageLevel: compatibility.averageLevel
      }
    })

    // Sort users by compatibility
    const sortedUsers = usersWithCompatibility.sort((a, b) => b.compatibility - a.compatibility)

    // Generate analysis
    const analysis = {
      recommendedTeam: sortedUsers.slice(0, 4),
      skillsCoverage: Math.round(
        sortedUsers.slice(0, 4).reduce((sum, user) => sum + user.skillMatch, 0) / 4
      ),
      successPrediction: Math.round(
        sortedUsers.slice(0, 4).reduce((sum, user) => sum + user.compatibility, 0) / 4
      ),
      reasoning: [
        `Strong skill coverage with ${sortedUsers[0].skillMatch}% match for key requirements`,
        "Team has complementary skill sets",
        "Balanced mix of experience levels",
        "High overall compatibility scores"
      ],
      risks: [
        "Some team members may have limited availability",
        "Consider skill gaps in specific areas"
      ],
      suggestions: [
        "Schedule regular skill-sharing sessions",
        "Consider adding specialized team members for critical areas"
      ]
    }

    setAiAnalysis(analysis)
    // Auto-select top 3 recommended team members
    setSelectedTeam(analysis.recommendedTeam.slice(0, 3).map((member) => String(member.id)))
    setIsAnalyzing(false)
  }

  const handleNext = async () => {
    if (currentStep === 2) {
      // Simulate AI analysis
      setIsAnalyzing(true)
      await generateAIRecommendations()
      setIsAnalyzing(false)
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const toggleTag = (tag: string) => {
    setProjectData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const toggleTeamMember = (memberId: string) => {
    setSelectedTeam((prev) =>
      prev.includes(String(memberId)) ? prev.filter((id) => id !== String(memberId)) : [...prev, String(memberId)]
    )
  }

  const handleCreateProject = async () => {
    setIsCreating(true)
    try {
      // 1. Crea il progetto nel DB
      const { data: createdProject, error } = await createProject({
        name: projectData.name,
        description: projectData.description,
        start_date: new Date().toISOString().split("T")[0],
        end_date: projectData.timeline
          ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
          : undefined,
        status: "active",
      })

      if (error || !createdProject) {
        setIsCreating(false)
        alert("Errore nella creazione del progetto")
        return
      }

      // 2. Aggiungi i membri selezionati
      await Promise.all(
        selectedTeam
          .filter((userId): userId is string => typeof userId === "string")
          .map(userId =>
            addProjectMember(createdProject.id, userId, users.find(u => u.id === userId)?.role || "Team Member")
          )
      )

      // 3. Feedback e reset
      onProjectCreated(createdProject)
    } catch (err) {
      alert("Errore nella creazione del progetto")
    } finally {
      setIsCreating(false)
      // Reset form, chiudi wizard, ecc.
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return projectData.name.trim() !== "" && projectData.description.trim() !== ""
      case 2:
        return projectData.tags.length > 0
      case 3:
        return selectedTeam.length > 0
      default:
        return true
    }
  }

  // Funzione per calcolare le metriche dinamiche del team selezionato
  const getTeamMetrics = () => {
    if (selectedTeam.length === 0) return { skillsCoverage: 0, successRate: 0 };

    // Skill coverage
    const requiredSkills = projectData.requiredSkills.map(s => s.toLowerCase());
    const teamSkills = new Set(
      selectedTeam.flatMap(userId =>
        (userSkills[userId] || []).map(skill => skill.skill?.name?.toLowerCase()).filter(Boolean)
      )
    );
    const coveredSkills = requiredSkills.filter(skill => teamSkills.has(skill));
    const skillsCoverage = requiredSkills.length > 0
      ? Math.round((coveredSkills.length / requiredSkills.length) * 100)
      : 0;

    // Success rate (media compatibilità)
    const compatibilities = selectedTeam.map(userId => {
      const user = users.find(u => u.id === userId);
      return user ? calculateUserCompatibility(user).compatibility : 0;
    });
    const successRate = compatibilities.length > 0
      ? Math.round(compatibilities.reduce((sum, c) => sum + c, 0) / compatibilities.length)
      : 0;

    return { skillsCoverage, successRate };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Create New Project
          </DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              {step < 4 && <div className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-purple-500" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Project Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={projectData.name}
                    onChange={(e) => setProjectData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter project name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={projectData.priority}
                    onValueChange={(value) => setProjectData((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={projectData.description}
                  onChange={(e) => setProjectData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project goals, requirements, and expected outcomes"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline</Label>
                  <Input
                    id="timeline"
                    value={projectData.timeline}
                    onChange={(e) => setProjectData((prev) => ({ ...prev, timeline: e.target.value }))}
                    placeholder="e.g., 3 months"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (€)</Label>
                  <Input
                    id="budget"
                    value={projectData.budget}
                    onChange={(e) => setProjectData((prev) => ({ ...prev, budget: e.target.value }))}
                    placeholder="e.g., 50000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Select
                    value={projectData.teamSize}
                    onValueChange={(value) => setProjectData((prev) => ({ ...prev, teamSize: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1-2 people</SelectItem>
                      <SelectItem value="3-5">3-5 people</SelectItem>
                      <SelectItem value="6-10">6-10 people</SelectItem>
                      <SelectItem value="10+">10+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tags & Skills</h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Project Tags *</Label>
                  <p className="text-sm text-gray-500 mb-3">Select tags that best describe your project</p>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={projectData.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer hover:bg-purple-100"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                        {projectData.tags.includes(tag) && <X className="w-3 h-3 ml-1" />}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requiredSkills">Required Skills</Label>
                  <Textarea
                    id="requiredSkills"
                    value={projectData.requiredSkills.join(", ")}
                    onChange={(e) =>
                      setProjectData((prev) => ({
                        ...prev,
                        requiredSkills: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder="Enter required skills separated by commas (e.g., React, Node.js, UI Design)"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Team Selection</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateAIRecommendations}
                  disabled={isAnalyzing || isLoadingUsers}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      AI Recommendations
                    </>
                  )}
                </Button>
              </div>

              {isLoadingUsers ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading team members...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users.map((user) => {
                    const compatibility = calculateUserCompatibility(user)
                    const isSelected = selectedTeam.includes(user.id)
                    
                    return (
                      <Card
                        key={user.id}
                        className={`cursor-pointer transition-all ${
                          isSelected ? "ring-2 ring-purple-500" : "hover:shadow-md"
                        }`}
                        onClick={() => toggleTeamMember(user.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarFallback>
                                {user.full_name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">{user.full_name}</h4>
                                  <p className="text-sm text-gray-500">{user.role || "Team Member"}</p>
                                </div>
                                {isSelected && (
                                  <Badge className="bg-purple-100 text-purple-800">
                                    Selected
                                  </Badge>
                                )}
                              </div>
                              <div className="mt-2 space-y-2">
                                <div>
                                  <p className="text-sm text-gray-600">Skills</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {userSkills[user.id]?.slice(0, 3).map((skill) => (
                                      <Badge
                                        key={skill.skill_id}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {skill.skill?.name || skill.skill_id}
                                      </Badge>
                                    ))}
                                    {userSkills[user.id]?.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{userSkills[user.id].length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <p className="text-xs text-gray-500">Skill Match</p>
                                    <Progress value={compatibility.skillMatch} className="h-2" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Experience</p>
                                    <Progress value={compatibility.averageLevel * 20} className="h-2" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Project Summary</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Name</div>
                      <div>{projectData.name}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Description</div>
                      <div className="text-sm">{projectData.description}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-600">Priority</div>
                        <Badge
                          className={
                            projectData.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : projectData.priority === "medium"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {projectData.priority}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Timeline</div>
                        <div>{projectData.timeline || "TBD"}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Tags</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {projectData.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Selected Team ({selectedTeam.length} members)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedTeam.map((memberId) => {
                        const member = users.find((m) => m.id === memberId)
                        return member ? (
                          <div key={member.id} className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">{member.full_name?.split(" ")[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{member.full_name}</div>
                              <div className="text-xs text-gray-600">{member.role || "Team Member"}</div>
                            </div>
                          </div>
                        ) : null
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {aiAnalysis && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      AI Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{aiAnalysis.successPrediction}%</div>
                        <div className="text-xs text-gray-500 mt-1">Success Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{aiAnalysis.skillsCoverage}%</div>
                        <div className="text-xs text-gray-500 mt-1">Skills Coverage</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{selectedTeam.length}</div>
                        <div className="text-xs text-gray-500 mt-1">Team Members</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || isAnalyzing || isCreating}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isAnalyzing || isCreating}>
              Cancel
            </Button>
            {currentStep < 4 ? (
              <Button onClick={handleNext} disabled={!isStepValid() || isAnalyzing}>
                {currentStep === 2 && !aiAnalysis ? (
                  <>
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze & Recommend
                        <Sparkles className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleCreateProject}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={selectedTeam.length === 0 || isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Project
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
