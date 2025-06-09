"use client"

import { useState } from "react"
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

// Mock team members with skills
const mockTeamMembers = [
  {
    id: "1",
    name: "Marco Rossi",
    role: "Frontend Developer",
    avatar: "MR",
    skills: ["React", "TypeScript", "CSS", "JavaScript"],
    level: "Senior",
    availability: 80,
    compatibility: 95,
  },
  {
    id: "2",
    name: "Giulia Bianchi",
    role: "UX Designer",
    avatar: "GB",
    skills: ["UI Design", "UX Research", "Figma", "Design Thinking"],
    level: "Senior",
    availability: 60,
    compatibility: 88,
  },
  {
    id: "3",
    name: "Alessandro Verdi",
    role: "Backend Developer",
    avatar: "AV",
    skills: ["Node.js", "Python", "SQL", "REST API"],
    level: "Senior",
    availability: 90,
    compatibility: 92,
  },
  {
    id: "4",
    name: "Elena Arancio",
    role: "Full Stack Developer",
    avatar: "EA",
    skills: ["React", "Node.js", "MongoDB", "REST API"],
    level: "Mid",
    availability: 100,
    compatibility: 85,
  },
  {
    id: "5",
    name: "Luca Gialli",
    role: "Data Scientist",
    avatar: "LG",
    skills: ["Python", "Machine Learning", "Data Analysis", "TensorFlow"],
    level: "Senior",
    availability: 70,
    compatibility: 78,
  },
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
  const [selectedTeam, setSelectedTeam] = useState<string[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)

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

  const generateAIRecommendations = async () => {
    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate AI analysis based on project data
    const analysis = {
      recommendedTeam: mockTeamMembers.sort((a, b) => b.compatibility - a.compatibility).slice(0, 4),
      skillsCoverage: 85,
      successPrediction: 92,
      reasoning: [
        "Strong frontend and backend coverage with React and Node.js expertise",
        "UX Designer ensures user-centered design approach",
        "Team has proven track record in similar projects",
        "Balanced mix of senior and mid-level developers for mentoring",
      ],
      risks: ["Limited availability of UX Designer (60%)", "No dedicated QA engineer in recommended team"],
      suggestions: [
        "Consider adding a QA specialist for testing coverage",
        "Plan UX work in early phases when designer is available",
      ],
    }
    setAiAnalysis(analysis)
    // Auto-select top 3 recommended team members
    setSelectedTeam(analysis.recommendedTeam.slice(0, 3).map((member) => member.id))
  }

  const toggleTag = (tag: string) => {
    setProjectData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }

  const toggleTeamMember = (memberId: string) => {
    setSelectedTeam((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]))
  }

  const handleCreateProject = async () => {
    setIsCreating(true)

    // Simulate project creation delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const selectedMembers = mockTeamMembers.filter((member) => selectedTeam.includes(member.id))

    const newProject = {
      name: projectData.name,
      description: projectData.description,
      start_date: new Date().toISOString().split("T")[0],
      end_date: projectData.timeline
        ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
        : undefined,
      status: "active" as const,
      priority: projectData.priority,
      tags: projectData.tags,
      team_members: selectedMembers,
      progress: 0,
      budget: projectData.budget ? Number.parseInt(projectData.budget) : undefined,
      ai_analysis: aiAnalysis,
    }

    onProjectCreated(newProject)
    setIsCreating(false)

    // Reset form
    setCurrentStep(1)
    setProjectData({
      name: "",
      description: "",
      priority: "medium",
      timeline: "",
      budget: "",
      tags: [],
      requiredSkills: [],
      teamSize: "3-5",
    })
    setSelectedTeam([])
    setAiAnalysis(null)
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
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold">AI Team Recommendations</h3>
                <Badge className="bg-purple-100 text-purple-800">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Powered
                </Badge>
              </div>

              {isAnalyzing ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analyzing Project Requirements</h3>
                    <p className="text-muted-foreground text-center">
                      Our AI is evaluating team members based on skills, experience, and project compatibility...
                    </p>
                    <div className="w-full max-w-xs mt-4">
                      <Progress value={75} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ) : aiAnalysis ? (
                <div className="space-y-6">
                  {/* AI Analysis Summary */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Team Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{aiAnalysis.overallScore || 92}%</div>
                        <p className="text-xs text-muted-foreground">Compatibility match</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Skill Coverage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{aiAnalysis.skillsCoverage}%</div>
                        <p className="text-xs text-muted-foreground">Required skills covered</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Success Prediction</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{aiAnalysis.successPrediction}%</div>
                        <p className="text-xs text-muted-foreground">AI prediction</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recommended Team Members */}
                  <div>
                    <h4 className="font-medium mb-3">Recommended Team Members</h4>
                    <div className="space-y-3">
                      {aiAnalysis.recommendedTeam.map((member: any) => (
                        <Card
                          key={member.id}
                          className={`cursor-pointer transition-all ${
                            selectedTeam.includes(member.id) ? "ring-2 ring-purple-500 bg-purple-50" : ""
                          }`}
                          onClick={() => toggleTeamMember(member.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>{member.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{member.name}</div>
                                  <div className="text-sm text-gray-600">{member.role}</div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {member.skills.slice(0, 3).map((skill: string) => (
                                      <Badge key={skill} variant="outline" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 mb-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span className="text-sm font-medium">{member.compatibility}%</span>
                                </div>
                                <div className="text-xs text-gray-500">{member.availability}% available</div>
                                {selectedTeam.includes(member.id) && (
                                  <CheckCircle className="w-4 h-4 text-purple-500 mt-1" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-green-600">Why This Team Works</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {aiAnalysis.reasoning.map((reason: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-orange-600">Considerations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs font-medium text-gray-600 mb-1">Risks</div>
                            <ul className="space-y-1">
                              {aiAnalysis.risks.map((risk: string, idx: number) => (
                                <li key={idx} className="text-sm text-orange-600">
                                  • {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-600 mb-1">Suggestions</div>
                            <ul className="space-y-1">
                              {aiAnalysis.suggestions.map((suggestion: string, idx: number) => (
                                <li key={idx} className="text-sm text-blue-600">
                                  • {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : null}
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
                        const member = mockTeamMembers.find((m) => m.id === memberId)
                        return member ? (
                          <div key={member.id} className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{member.name}</div>
                              <div className="text-xs text-gray-600">{member.role}</div>
                            </div>
                            <div className="text-xs text-gray-500">{member.compatibility}% match</div>
                          </div>
                        ) : null
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {aiAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-500" />
                      AI Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-600">{aiAnalysis.successPrediction}%</div>
                        <div className="text-xs text-gray-600">Success Rate</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">{aiAnalysis.skillsCoverage}%</div>
                        <div className="text-xs text-gray-600">Skills Coverage</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{selectedTeam.length}</div>
                        <div className="text-xs text-gray-600">Team Members</div>
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
