"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle,
  Code,
  Lightbulb,
  LinkedinIcon as LinkedIn,
  Sparkles,
  Star,
  Target,
  Upload,
  Users,
  Zap,
  Loader2,
} from "lucide-react"
import { CVUpload } from "./cv-upload"
import { LinkedInImport } from "./linkedin-import"
import { createAssessment, completeAssessment, updateUserSkill, getAllSkills } from "@/lib/data-service"
import { useAuth } from "@/contexts/auth-context"
import type { Skill } from "@/lib/types"

// AI-powered skill suggestions based on role
const roleBasedSkills = {
  "Software Developer": {
    technical: [
      { name: "JavaScript", confidence: 95, reason: "Essential for modern web development" },
      { name: "React", confidence: 90, reason: "Popular frontend framework" },
      { name: "Node.js", confidence: 85, reason: "Backend JavaScript runtime" },
      { name: "Git", confidence: 98, reason: "Version control is fundamental" },
      { name: "SQL", confidence: 80, reason: "Database interaction" },
      { name: "TypeScript", confidence: 75, reason: "Growing adoption for type safety" },
    ],
    soft: [
      { name: "Problem Solving", confidence: 95, reason: "Core developer skill" },
      { name: "Communication", confidence: 85, reason: "Team collaboration essential" },
      { name: "Continuous Learning", confidence: 90, reason: "Tech evolves rapidly" },
      { name: "Attention to Detail", confidence: 88, reason: "Code quality matters" },
    ],
    process: [
      { name: "Agile/Scrum", confidence: 85, reason: "Standard development methodology" },
      { name: "Code Review", confidence: 80, reason: "Quality assurance practice" },
      { name: "Testing", confidence: 75, reason: "Ensures code reliability" },
      { name: "CI/CD", confidence: 70, reason: "Modern deployment practices" },
    ],
  },
  "UX Designer": {
    technical: [
      { name: "Figma", confidence: 95, reason: "Industry standard design tool" },
      { name: "Adobe Creative Suite", confidence: 85, reason: "Professional design software" },
      { name: "Prototyping", confidence: 90, reason: "Essential for UX validation" },
      { name: "User Research", confidence: 88, reason: "Data-driven design decisions" },
      { name: "Wireframing", confidence: 92, reason: "Foundation of design process" },
    ],
    soft: [
      { name: "Empathy", confidence: 95, reason: "Understanding user needs" },
      { name: "Communication", confidence: 90, reason: "Presenting design decisions" },
      { name: "Creativity", confidence: 88, reason: "Innovative design solutions" },
      { name: "Collaboration", confidence: 85, reason: "Working with cross-functional teams" },
    ],
    process: [
      { name: "Design Thinking", confidence: 95, reason: "UX methodology foundation" },
      { name: "User Testing", confidence: 90, reason: "Validating design decisions" },
      { name: "Design Systems", confidence: 80, reason: "Consistent design language" },
      { name: "Accessibility", confidence: 75, reason: "Inclusive design practices" },
    ],
  },
  "Project Manager": {
    technical: [
      { name: "Project Management Tools", confidence: 95, reason: "Essential for coordination" },
      { name: "Data Analysis", confidence: 80, reason: "Performance tracking" },
      { name: "Budget Management", confidence: 85, reason: "Resource allocation" },
      { name: "Risk Assessment", confidence: 88, reason: "Project success factor" },
    ],
    soft: [
      { name: "Leadership", confidence: 95, reason: "Team guidance essential" },
      { name: "Communication", confidence: 98, reason: "Stakeholder management" },
      { name: "Negotiation", confidence: 85, reason: "Resource and timeline discussions" },
      { name: "Adaptability", confidence: 80, reason: "Managing changing requirements" },
    ],
    process: [
      { name: "Agile Methodology", confidence: 90, reason: "Modern project approach" },
      { name: "Stakeholder Management", confidence: 95, reason: "Key to project success" },
      { name: "Quality Management", confidence: 85, reason: "Deliverable standards" },
      { name: "Change Management", confidence: 80, reason: "Handling project evolution" },
    ],
  },
}

// Experience level descriptions
const experienceLevels = {
  1: { label: "Beginner", description: "Just starting to learn this skill" },
  2: { label: "Basic", description: "Can perform simple tasks with guidance" },
  3: { label: "Intermediate", description: "Can work independently on most tasks" },
  4: { label: "Advanced", description: "Can handle complex tasks and mentor others" },
  5: { label: "Expert", description: "Recognized authority, can innovate and lead" },
}

interface AssessmentData {
  role: string
  experience: string
  background: string
  skills: Record<string, { level: number; interest: number; priority: boolean }>
  goals: string[]
  timeline: string
}

export function SkillAssessmentWizard({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    role: "",
    experience: "",
    background: "",
    skills: {},
    goals: [],
    timeline: "",
  })
  const [suggestedSkills, setSuggestedSkills] = useState<any[]>([])
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false)
  const [importMode, setImportMode] = useState<"none" | "cv" | "linkedin">("none")
  const [importedSkills, setImportedSkills] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoadingSkills, setIsLoadingSkills] = useState(false)

  // Aggiungi questo useEffect dopo gli altri useState
  useEffect(() => {
    if (isOpen) {
      const loadSkills = async () => {
        setIsLoadingSkills(true)
        try {
          const allSkills = await getAllSkills()
          setSkills(allSkills)
        } catch (error) {
          console.error("Error loading skills:", error)
        } finally {
          setIsLoadingSkills(false)
        }
      }
      loadSkills()
    }
  }, [isOpen])

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const handleRoleSelection = (role: string) => {
    setAssessmentData((prev) => ({ ...prev, role }))

    // Simulate AI skill generation
    setIsGeneratingSkills(true)
    setTimeout(() => {
      const skills = roleBasedSkills[role as keyof typeof roleBasedSkills] || roleBasedSkills["Software Developer"]
      setSuggestedSkills([
        ...skills.technical.map((s) => ({ ...s, category: "technical" })),
        ...skills.soft.map((s) => ({ ...s, category: "soft" })),
        ...skills.process.map((s) => ({ ...s, category: "process" })),
      ])
      setIsGeneratingSkills(false)
    }, 1500)
  }

  const handleSkillAssessment = (skillName: string, level: number, interest: number) => {
    setAssessmentData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skillName]: { level, interest, priority: false },
      },
    }))
  }

  const handleSkillPriority = (skillName: string, priority: boolean) => {
    setAssessmentData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skillName]: {
          ...prev.skills[skillName],
          priority,
        },
      },
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmitReview = async () => {
    if (!user) {
      alert("You must be logged in to save your assessment")
      return
    }

    if (skills.length === 0) {
      alert("Skills data not loaded. Please try again.")
      return
    }

    setIsSubmitting(true)

    try {
      // Create the assessment record
      const { data: assessment, error: assessmentError } = await createAssessment({
        type: "complete",
        skills_evaluated: Object.keys(assessmentData.skills).length,
      })

      if (assessmentError) {
        throw new Error(assessmentError.message)
      }

      // Save each skill to user_skills table
      const skillPromises = Object.entries(assessmentData.skills).map(async ([skillName, skillData]) => {
        // Find the skill ID from the skills list
        const skill = skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase())
        if (!skill) {
          console.warn(`Skill not found in database: ${skillName}`)
          return
        }

        return updateUserSkill({
          skill_id: skill.id,
          level: skillData.level,
          interest: skillData.interest,
          is_priority: skillData.priority,
        })
      })

      const results = await Promise.all(skillPromises)
      const successfulSaves = results.filter((result) => result && !result.error).length

      // Complete the assessment
      if (assessment) {
        await completeAssessment(
          assessment.id,
          successfulSaves,
          300, // 5 minutes completion time (in seconds)
        )
      }

      alert(`Assessment completed! Saved ${successfulSaves} skills successfully.`)
      onClose()

      // Reset the form
      setCurrentStep(1)
      setAssessmentData({
        role: "",
        experience: "",
        background: "",
        skills: {},
        goals: [],
        timeline: "",
      })
      setImportedSkills([])
    } catch (error) {
      console.error("Error saving assessment:", error)
      alert("Failed to save assessment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {importMode === "none" ? (
              <>
                <div className="text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                  <h2 className="text-2xl font-bold mb-2">Welcome to Your Skills Journey</h2>
                  <p className="text-gray-600">
                    Let's build your comprehensive skill profile with AI-powered insights and personalized
                    recommendations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card
                    className="p-4 border-2 border-dashed border-gray-300 hover:border-purple-400 cursor-pointer transition-colors"
                    onClick={() => setImportMode("linkedin")}
                  >
                    <div className="text-center">
                      <LinkedIn className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h3 className="font-medium">Import from LinkedIn</h3>
                      <p className="text-sm text-gray-600">Quick start with your existing profile</p>
                    </div>
                  </Card>

                  <Card
                    className="p-4 border-2 border-dashed border-gray-300 hover:border-purple-400 cursor-pointer transition-colors"
                    onClick={() => setImportMode("cv")}
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <h3 className="font-medium">Upload CV/Resume</h3>
                      <p className="text-sm text-gray-600">Extract skills from your resume</p>
                    </div>
                  </Card>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">Or start from scratch</p>
                  <Button onClick={nextStep} className="w-full">
                    Begin Assessment <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            ) : importMode === "cv" ? (
              <CVUpload
                onSkillsExtracted={(skills) => {
                  setImportedSkills(skills)
                  // Auto-populate some assessment data
                  const skillsData: Record<string, { level: number; interest: number; priority: boolean }> = {}
                  skills.forEach((skill) => {
                    skillsData[skill] = {
                      level: Math.floor(Math.random() * 3) + 2, // Random level 2-4
                      interest: Math.floor(Math.random() * 2) + 3, // Random interest 3-4
                      priority: false,
                    }
                  })
                  setAssessmentData((prev) => ({ ...prev, skills: skillsData }))
                  setImportMode("none")
                  nextStep()
                }}
                onClose={() => setImportMode("none")}
              />
            ) : (
              <LinkedInImport
                onSkillsExtracted={(skills, profile) => {
                  setImportedSkills(skills)
                  // Auto-populate assessment data from LinkedIn
                  const skillsData: Record<string, { level: number; interest: number; priority: boolean }> = {}
                  skills.forEach((skill) => {
                    skillsData[skill] = {
                      level: Math.floor(Math.random() * 3) + 2, // Random level 2-4
                      interest: Math.floor(Math.random() * 2) + 3, // Random interest 3-4
                      priority: false,
                    }
                  })
                  setAssessmentData((prev) => ({
                    ...prev,
                    skills: skillsData,
                    background: `${profile.headline} with experience in various technical and leadership roles.`,
                  }))
                  setImportMode("none")
                  nextStep()
                }}
                onClose={() => setImportMode("none")}
              />
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Tell us about yourself</h2>
              <p className="text-gray-600">This helps our AI provide more accurate skill suggestions.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Current Role</Label>
                <Select value={assessmentData.role} onValueChange={handleRoleSelection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software Developer">Software Developer</SelectItem>
                    <SelectItem value="UX Designer">UX Designer</SelectItem>
                    <SelectItem value="Project Manager">Project Manager</SelectItem>
                    <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Select
                  value={assessmentData.experience}
                  onValueChange={(value) => setAssessmentData((prev) => ({ ...prev, experience: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years (Entry Level)</SelectItem>
                    <SelectItem value="2-3">2-3 years (Junior)</SelectItem>
                    <SelectItem value="4-6">4-6 years (Mid-Level)</SelectItem>
                    <SelectItem value="7-10">7-10 years (Senior)</SelectItem>
                    <SelectItem value="10+">10+ years (Expert/Lead)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="background">Professional Background</Label>
                <Textarea
                  id="background"
                  placeholder="Briefly describe your background, key projects, or areas of expertise..."
                  value={assessmentData.background}
                  onChange={(e) => setAssessmentData((prev) => ({ ...prev, background: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">
                {importedSkills.length > 0 ? "Review Imported Skills" : "AI-Suggested Skills"}
              </h2>
              <p className="text-gray-600">
                {importedSkills.length > 0
                  ? `We found ${importedSkills.length} skills from your import. Review and modify as needed.`
                  : `Based on your role as ${assessmentData.role}, here are skills we recommend assessing:`}
              </p>
            </div>

            {isGeneratingSkills ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">
                  AI is analyzing your profile and generating personalized skill suggestions...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {["technical", "soft", "process"].map((category) => (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {category === "technical" && <Code className="w-5 h-5 text-blue-500" />}
                        {category === "soft" && <Users className="w-5 h-5 text-green-500" />}
                        {category === "process" && <Target className="w-5 h-5 text-purple-500" />}
                        {category.charAt(0).toUpperCase() + category.slice(1)} Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {suggestedSkills
                          .filter((skill) => skill.category === category)
                          .map((skill) => (
                            <div key={skill.name} className="flex items-center space-x-3 p-3 border rounded-lg">
                              <Checkbox
                                id={skill.name}
                                defaultChecked={skill.confidence > 80}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    handleSkillAssessment(skill.name, 0, 3)
                                  } else {
                                    const newSkills = { ...assessmentData.skills }
                                    delete newSkills[skill.name]
                                    setAssessmentData((prev) => ({ ...prev, skills: newSkills }))
                                  }
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor={skill.name} className="font-medium">
                                    {skill.name}
                                  </Label>
                                  <Badge variant="outline" className="text-xs">
                                    {skill.confidence}% match
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{skill.reason}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Lightbulb className="w-4 h-4" />
                      <span className="text-sm">
                        Don't see a skill you want to assess? You can add custom skills in the next step.
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Assess Your Skills</h2>
              <p className="text-gray-600">Rate your current level and interest in developing each skill.</p>
            </div>

            <div className="space-y-4">
              {Object.keys(assessmentData.skills).map((skillName) => {
                const skill = assessmentData.skills[skillName]
                return (
                  <Card key={skillName}>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <h4 className="font-medium">{skillName}</h4>

                        <div>
                          <Label className="text-sm">Current Level</Label>
                          <RadioGroup
                            value={skill.level.toString()}
                            onValueChange={(value) =>
                              handleSkillAssessment(skillName, Number.parseInt(value), skill.interest)
                            }
                            className="flex gap-4 mt-2"
                          >
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div key={level} className="flex flex-col items-center space-y-1">
                                <RadioGroupItem value={level.toString()} id={`${skillName}-level-${level}`} />
                                <Label htmlFor={`${skillName}-level-${level}`} className="text-xs text-center">
                                  <div>{level}</div>
                                  <div className="text-gray-500">
                                    {experienceLevels[level as keyof typeof experienceLevels].label}
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div>
                          <Label className="text-sm">Interest in Development</Label>
                          <div className="flex items-center gap-2 mt-2">
                            {[1, 2, 3, 4, 5].map((interest) => (
                              <button
                                key={interest}
                                onClick={() => handleSkillAssessment(skillName, skill.level, interest)}
                                className={`p-1 rounded ${
                                  skill.interest >= interest ? "text-yellow-400" : "text-gray-300"
                                }`}
                              >
                                <Star className="w-5 h-5 fill-current" />
                              </button>
                            ))}
                            <span className="text-sm text-gray-600 ml-2">
                              {skill.interest === 1 && "Low"}
                              {skill.interest === 2 && "Some"}
                              {skill.interest === 3 && "Moderate"}
                              {skill.interest === 4 && "High"}
                              {skill.interest === 5 && "Very High"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Add a custom skill</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Add Skill
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Development Priorities</h2>
              <p className="text-gray-600">Select the skills you want to focus on developing first.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(assessmentData.skills)
                .sort(([, a], [, b]) => b.interest - a.interest || 5 - a.level)
                .map(([skillName, skill]) => (
                  <Card
                    key={skillName}
                    className={`cursor-pointer transition-all ${
                      skill.priority ? "ring-2 ring-purple-500 bg-purple-50" : "hover:shadow-md"
                    }`}
                    onClick={() => handleSkillPriority(skillName, !skill.priority)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{skillName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600">
                              Level {skill.level} • Interest: {skill.interest}/5
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < skill.interest ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <Progress value={skill.level * 20} className="flex-1 h-2" />
                          </div>
                        </div>
                        <div className="ml-2">
                          {skill.priority && <CheckCircle className="w-5 h-5 text-purple-500" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">AI Recommendation</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Based on your current levels and interests, we recommend focusing on 3-5 skills for optimal learning
                    progress. Consider prioritizing skills with high interest but lower current levels for maximum
                    growth potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">Assessment Complete!</h2>
              <p className="text-gray-600">
                Your skill profile has been created. Here's your personalized development roadmap.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Skill Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Skills Assessed</span>
                      <span className="font-medium">{Object.keys(assessmentData.skills).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Priority Skills</span>
                      <span className="font-medium">
                        {Object.values(assessmentData.skills).filter((s) => s.priority).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Level</span>
                      <span className="font-medium">
                        {(
                          Object.values(assessmentData.skills).reduce((sum, s) => sum + s.level, 0) /
                          Object.keys(assessmentData.skills).length
                        ).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Skill profile created</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Learning paths generated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Mentors matched</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Goals set for development</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Your Personalized Learning Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(assessmentData.skills)
                  .filter(([, skill]) => skill.priority)
                  .slice(0, 3)
                  .map(([skillName, skill]) => (
                    <div key={skillName} className="bg-white p-4 rounded-lg">
                      <h4 className="font-medium">{skillName}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {skill.level < 3 ? "Foundational course recommended" : "Advanced workshop available"}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Resources
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Skills Assessment Wizard
          </DialogTitle>
          <DialogDescription>
            Step {currentStep} of {totalSteps} • Complete your comprehensive skill evaluation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">{renderStep()}</div>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 2 && !assessmentData.role) ||
                    (currentStep === 3 && Object.keys(assessmentData.skills).length === 0)
                  }
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitReview}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving Assessment...
                    </>
                  ) : (
                    <>
                      Complete Assessment
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
