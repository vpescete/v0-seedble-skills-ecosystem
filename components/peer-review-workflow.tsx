"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, CheckCircle, Clock, FileText, Star, TrendingUp, Users, Zap } from "lucide-react"

// Sample data for peer reviews
const pendingReviews = [
  {
    id: 1,
    reviewee: "Marco Rossi",
    role: "Senior Developer",
    project: "E-commerce Platform Redesign",
    deadline: "2024-12-20",
    status: "pending",
    avatar: "MR",
    skills: ["React", "Node.js", "Team Leadership", "Problem Solving"],
  },
  {
    id: 2,
    reviewee: "Anna Bianchi",
    role: "UX Designer",
    project: "Mobile App UX Research",
    deadline: "2024-12-18",
    status: "in_progress",
    avatar: "AB",
    skills: ["User Research", "Prototyping", "Communication", "Design Thinking"],
  },
]

const completedReviews = [
  {
    id: 3,
    reviewee: "Luca Verde",
    role: "Project Manager",
    project: "Digital Transformation Initiative",
    completedDate: "2024-12-10",
    status: "completed",
    avatar: "LV",
    overallScore: 4.2,
    skills: ["Project Management", "Stakeholder Communication", "Risk Assessment", "Team Coordination"],
  },
]

const receivedReviews = [
  {
    id: 4,
    reviewer: "Sofia Neri",
    role: "Data Scientist",
    project: "ML Model Implementation",
    completedDate: "2024-12-08",
    status: "completed",
    avatar: "SN",
    overallScore: 4.5,
    feedback: "Excellent technical execution and great collaboration throughout the project.",
  },
]

// Role-specific correction sheet templates
const correctionSheets = {
  "Senior Developer": {
    hardSkills: [
      "Code Quality & Architecture",
      "Technical Problem Solving",
      "Framework/Technology Expertise",
      "Performance Optimization",
      "Security Best Practices",
    ],
    softSkills: [
      "Team Collaboration",
      "Communication Clarity",
      "Mentoring & Knowledge Sharing",
      "Adaptability",
      "Time Management",
    ],
    processSkills: [
      "Code Review Quality",
      "Documentation Standards",
      "Testing Practices",
      "Agile Methodology",
      "Deployment Processes",
    ],
    innovation: [
      "Creative Problem Solving",
      "Technology Adoption",
      "Process Improvement",
      "Knowledge Contribution",
      "Initiative Taking",
    ],
  },
  "UX Designer": {
    hardSkills: [
      "Design Tool Proficiency",
      "User Research Methods",
      "Prototyping Skills",
      "Visual Design",
      "Interaction Design",
    ],
    softSkills: [
      "Stakeholder Communication",
      "Empathy & User Advocacy",
      "Presentation Skills",
      "Collaboration",
      "Feedback Reception",
    ],
    processSkills: [
      "Design Process Adherence",
      "User Testing Execution",
      "Design System Usage",
      "Project Timeline Management",
      "Quality Assurance",
    ],
    innovation: [
      "Design Innovation",
      "User Experience Enhancement",
      "Process Optimization",
      "Trend Awareness",
      "Creative Solutions",
    ],
  },
  "Project Manager": {
    hardSkills: ["Project Planning", "Resource Management", "Risk Assessment", "Budget Management", "Tool Proficiency"],
    softSkills: ["Leadership", "Stakeholder Management", "Conflict Resolution", "Team Motivation", "Communication"],
    processSkills: [
      "Methodology Implementation",
      "Quality Management",
      "Change Management",
      "Reporting & Documentation",
      "Meeting Facilitation",
    ],
    innovation: [
      "Process Innovation",
      "Strategic Thinking",
      "Continuous Improvement",
      "Technology Integration",
      "Team Development",
    ],
  },
}

export function PeerReviewWorkflow() {
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [reviewData, setReviewData] = useState<any>({})

  const handleScoreChange = (category: string, skill: string, score: number) => {
    setReviewData((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [skill]: score,
      },
    }))
  }

  const renderCorrectionSheet = (role: string) => {
    const sheet = correctionSheets[role as keyof typeof correctionSheets]
    if (!sheet) return null

    return (
      <div className="space-y-6">
        {Object.entries(sheet).map(([category, skills]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg capitalize">{category.replace(/([A-Z])/g, " $1").trim()} Skills</CardTitle>
              <CardDescription>Rate each skill on a scale of 1-5 based on project performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill} className="space-y-2">
                    <Label className="text-sm font-medium">{skill}</Label>
                    <RadioGroup
                      value={reviewData[category]?.[skill]?.toString() || ""}
                      onValueChange={(value) => handleScoreChange(category, skill, Number.parseInt(value))}
                      className="flex gap-4"
                    >
                      {[1, 2, 3, 4, 5].map((score) => (
                        <div key={score} className="flex items-center space-x-2">
                          <RadioGroupItem value={score.toString()} id={`${skill}-${score}`} />
                          <Label htmlFor={`${skill}-${score}`} className="text-sm">
                            {score}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Additional Feedback</CardTitle>
            <CardDescription>Provide specific examples and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="strengths">Key Strengths Observed</Label>
              <Textarea
                id="strengths"
                placeholder="Describe specific strengths demonstrated during the project..."
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="improvements">Areas for Development</Label>
              <Textarea
                id="improvements"
                placeholder="Suggest specific areas for improvement and development..."
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="recommendations">Learning Recommendations</Label>
              <Textarea
                id="recommendations"
                placeholder="Recommend specific courses, resources, or experiences..."
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Peer Review System</h2>
          <p className="text-gray-500">Structured competency evaluation and feedback</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {pendingReviews.length} Pending
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {completedReviews.length} Completed
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {pendingReviews.map((review) => (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>{review.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold">{review.reviewee}</h3>
                          <p className="text-sm text-gray-600">{review.role}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Project: {review.project}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Due: {review.deadline}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {review.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={review.status === "pending" ? "destructive" : "default"}>
                        {review.status === "pending" ? "Action Required" : "In Progress"}
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedReview(review)}
                            variant={review.status === "pending" ? "default" : "outline"}
                          >
                            {review.status === "pending" ? "Start Review" : "Continue"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Peer Review: {review.reviewee} - {review.project}
                            </DialogTitle>
                            <DialogDescription>
                              Complete the structured evaluation using the role-specific correction sheet
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4">
                            {renderCorrectionSheet(review.role)}
                            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                              <Button variant="outline">Save Draft</Button>
                              <Button>Submit Review</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {completedReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>{review.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold">{review.reviewee}</h3>
                          <p className="text-sm text-gray-600">{review.role}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Project: {review.project}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">Completed: {review.completedDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(review.overallScore)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{review.overallScore}/5.0</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600">
                        Completed
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          <div className="grid gap-4">
            {receivedReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback>{review.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold">Review from {review.reviewer}</h3>
                          <p className="text-sm text-gray-600">{review.role}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Project: {review.project}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Received: {review.completedDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(review.overallScore)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{review.overallScore}/5.0</span>
                        </div>
                        <p className="text-sm text-gray-600 italic">"{review.feedback}"</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View Full Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reviews Given</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reviews Received</span>
                    <span className="font-semibold">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Score Given</span>
                    <span className="font-semibold">4.2/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Score Received</span>
                    <span className="font-semibold">4.5/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Feedback Quality</span>
                      <span className="text-sm font-medium">Excellent</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Timeliness</span>
                      <span className="text-sm font-medium">Good</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Constructiveness</span>
                      <span className="text-sm font-medium">Excellent</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Impact Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Skills improved: 6</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">People helped: 12</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">Review points: 240</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Reviewer rating: 4.8/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Review Trends</CardTitle>
              <CardDescription>Your peer review activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Review trend chart would be displayed here</p>
                  <p className="text-sm">Integration with analytics component</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
