"use client"

import { useState, useEffect } from "react"
import { getPeerReviews, getAllSkills, submitPeerReview } from "@/lib/data-service"
import type { Skill } from "@/lib/types"
import { ReviewAssignment } from "./review-assignment"
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
import { Calendar, CheckCircle, Clock, Star, TrendingUp, Users, MessageSquare } from "lucide-react"

// Sample data for peer reviews
// const pendingReviews = [
//   {
//     id: 1,
//     reviewee: "Marco Rossi",
//     role: "Senior Developer",
//     project: "E-commerce Platform Redesign",
//     deadline: "2024-12-20",
//     status: "pending",
//     avatar: "MR",
//     skills: ["React", "Node.js", "Team Leadership", "Problem Solving"],
//   },
//   {
//     id: 2,
//     reviewee: "Anna Bianchi",
//     role: "UX Designer",
//     project: "Mobile App UX Research",
//     deadline: "2024-12-18",
//     status: "in_progress",
//     avatar: "AB",
//     skills: ["User Research", "Prototyping", "Communication", "Design Thinking"],
//   },
// ]

// const completedReviews = [
//   {
//     id: 3,
//     reviewee: "Luca Verde",
//     role: "Project Manager",
//     project: "Digital Transformation Initiative",
//     completedDate: "2024-12-10",
//     status: "completed",
//     avatar: "LV",
//     overallScore: 4.2,
//     skills: ["Project Management", "Stakeholder Communication", "Risk Assessment", "Team Coordination"],
//   },
// ]

// const receivedReviews = [
//   {
//     id: 4,
//     reviewer: "Sofia Neri",
//     role: "Data Scientist",
//     project: "ML Model Implementation",
//     completedDate: "2024-12-08",
//     status: "completed",
//     avatar: "SN",
//     overallScore: 4.5,
//     feedback: "Excellent technical execution and great collaboration throughout the project.",
//   },
// ]

// Role-specific correction sheet templates
// const correctionSheets = {
//   "Senior Developer": {
//     hardSkills: [
//       "Code Quality & Architecture",
//       "Technical Problem Solving",
//       "Framework/Technology Expertise",
//       "Performance Optimization",
//       "Security Best Practices",
//     ],
//     softSkills: [
//       "Team Collaboration",
//       "Communication Clarity",
//       "Mentoring & Knowledge Sharing",
//       "Adaptability",
//       "Time Management",
//     ],
//     processSkills: [
//       "Code Review Quality",
//       "Documentation Standards",
//       "Testing Practices",
//       "Agile Methodology",
//       "Deployment Processes",
//     ],
//     innovation: [
//       "Creative Problem Solving",
//       "Technology Adoption",
//       "Process Improvement",
//       "Knowledge Contribution",
//       "Initiative Taking",
//     ],
//   },
//   "UX Designer": {
//     hardSkills: [
//       "Design Tool Proficiency",
//       "User Research Methods",
//       "Prototyping Skills",
//       "Visual Design",
//       "Interaction Design",
//     ],
//     softSkills: [
//       "Stakeholder Communication",
//       "Empathy & User Advocacy",
//       "Presentation Skills",
//       "Collaboration",
//       "Feedback Reception",
//     ],
//     processSkills: [
//       "Design Process Adherence",
//       "User Testing Execution",
//       "Design System Usage",
//       "Project Timeline Management",
//       "Quality Assurance",
//     ],
//     innovation: [
//       "Design Innovation",
//       "User Experience Enhancement",
//       "Process Optimization",
//       "Trend Awareness",
//       "Creative Solutions",
//     ],
//   },
//   "Project Manager": {
//     hardSkills: ["Project Planning", "Resource Management", "Risk Assessment", "Budget Management", "Tool Proficiency"],
//     softSkills: ["Leadership", "Stakeholder Management", "Conflict Resolution", "Team Motivation", "Communication"],
//     processSkills: [
//       "Methodology Implementation",
//       "Quality Management",
//       "Change Management",
//       "Reporting & Documentation",
//       "Meeting Facilitation",
//     ],
//     innovation: [
//       "Process Innovation",
//       "Strategic Thinking",
//       "Continuous Improvement",
//       "Technology Integration",
//       "Team Development",
//     ],
//   },
// }

// Replace the sample data with state variables
export function PeerReviewWorkflow() {
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [reviewData, setReviewData] = useState<any>({})
  const [reviews, setReviews] = useState<{
    pending: any[]
    completed: any[]
    received: any[]
  }>({ pending: [], completed: [], received: [] })
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [reviewsData, skillsData] = await Promise.all([getPeerReviews(), getAllSkills()])
        setReviews(reviewsData)
        setSkills(skillsData)
      } catch (error) {
        console.error("Error fetching peer review data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Add refresh function
  const refreshReviews = async () => {
    try {
      const reviewsData = await getPeerReviews()
      setReviews(reviewsData)
    } catch (error) {
      console.error("Error refreshing reviews:", error)
    }
  }

  const handleScoreChange = (category: string, skill: string, score: number) => {
    setReviewData((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [skill]: score,
      },
    }))
  }

  const handleSubmitReview = async () => {
    if (!selectedReview) return

    setIsSubmitting(true)
    try {
      const scores = {
        technical_score: calculateCategoryAverage("hardSkills"),
        soft_score: calculateCategoryAverage("softSkills"),
        process_score: calculateCategoryAverage("processSkills"),
        innovation_score: calculateCategoryAverage("innovation"),
      }

      const feedback = reviewData.feedback || ""
      const skillRatings: Array<{ skill_id: string; score: number; feedback?: string }> = []

      // Convert review data to skill ratings
      Object.entries(reviewData).forEach(([category, categoryData]) => {
        if (typeof categoryData === "object" && categoryData !== null) {
          Object.entries(categoryData as Record<string, number>).forEach(([skillName, score]) => {
            const skill = skills.find((s) => s.name === skillName)
            if (skill && typeof score === "number") {
              skillRatings.push({
                skill_id: skill.id,
                score: score,
              })
            }
          })
        }
      })

      const { error } = await submitPeerReview(selectedReview.id, scores, feedback, skillRatings)

      if (error) {
        console.error("Error submitting review:", error)
        alert("Failed to submit review. Please try again.")
      } else {
        alert("Review submitted successfully!")
        setSelectedReview(null)
        setReviewData({})
        refreshReviews()
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("An error occurred while submitting the review.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateCategoryAverage = (category: string): number => {
    const categoryData = reviewData[category]
    if (!categoryData || typeof categoryData !== "object") return 0

    const scores = Object.values(categoryData).filter((score): score is number => typeof score === "number")
    if (scores.length === 0) return 0

    return scores.reduce((sum, score) => sum + score, 0) / scores.length
  }

  // Update the renderCorrectionSheet function to use real skills
  const renderCorrectionSheet = (role: string) => {
    const roleSkills = {
      "Senior Developer": {
        hardSkills: skills
          .filter((s) => s.category === "technical")
          .slice(0, 5)
          .map((s) => s.name),
        softSkills: skills
          .filter((s) => s.category === "soft")
          .slice(0, 4)
          .map((s) => s.name),
        processSkills: skills
          .filter((s) => s.category === "process")
          .slice(0, 4)
          .map((s) => s.name),
        innovation: [
          "Creative Problem Solving",
          "Technology Adoption",
          "Process Improvement",
          "Knowledge Contribution",
        ],
      },
      "UX Designer": {
        hardSkills: ["Design Tool Proficiency", "User Research Methods", "Prototyping Skills", "Visual Design"],
        softSkills: skills
          .filter((s) => s.category === "soft")
          .slice(0, 4)
          .map((s) => s.name),
        processSkills: [
          "Design Process Adherence",
          "User Testing Execution",
          "Design System Usage",
          "Quality Assurance",
        ],
        innovation: ["Design Innovation", "User Experience Enhancement", "Process Optimization", "Creative Solutions"],
      },
      "Project Manager": {
        hardSkills: ["Project Planning", "Resource Management", "Risk Assessment", "Budget Management"],
        softSkills: skills
          .filter((s) => s.category === "soft")
          .slice(0, 4)
          .map((s) => s.name),
        processSkills: skills
          .filter((s) => s.category === "process")
          .slice(0, 4)
          .map((s) => s.name),
        innovation: ["Process Innovation", "Strategic Thinking", "Continuous Improvement", "Team Development"],
      },
    }

    const sheet = roleSkills[role as keyof typeof roleSkills] || roleSkills["Senior Developer"]

    return (
      <div className="space-y-6">
        {Object.entries(sheet).map(([category, skillList]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg capitalize">{category.replace(/([A-Z])/g, " $1").trim()} Skills</CardTitle>
              <CardDescription>Rate each skill on a scale of 1-5 based on project performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillList.map((skill) => (
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
              <Label htmlFor="feedback">Overall Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Provide detailed feedback about the team member's performance..."
                value={reviewData.feedback || ""}
                onChange={(e) => setReviewData((prev: any) => ({ ...prev, feedback: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading peer reviews...</p>
        </div>
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
          <ReviewAssignment />
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {reviews.pending.length} Pending
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {reviews.completed.length} Completed
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
          {reviews.pending.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Pending Reviews</h3>
                <p className="text-gray-600 mb-4">You don't have any pending peer reviews at the moment.</p>
                <ReviewAssignment />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {reviews.pending.map((review) => (
                <Card key={review.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>
                            {review.reviewee?.full_name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("") || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <div>
                            <h3 className="font-semibold">{review.reviewee?.full_name || "Unknown User"}</h3>
                            <p className="text-sm text-gray-600">{review.reviewee?.role || "No role specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Project: {review.project?.name || "Unknown Project"}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Created: {new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </div>
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
                                Peer Review: {review.reviewee?.full_name} - {review.project?.name}
                              </DialogTitle>
                              <DialogDescription>
                                Complete the structured evaluation using the role-specific correction sheet
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4">
                              {renderCorrectionSheet(review.reviewee?.role || "Senior Developer")}
                              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                                <Button variant="outline" disabled={isSubmitting}>
                                  Save Draft
                                </Button>
                                <Button onClick={handleSubmitReview} disabled={isSubmitting}>
                                  {isSubmitting ? "Submitting..." : "Submit Review"}
                                </Button>
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
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {reviews.completed.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Completed Reviews</h3>
                <p className="text-gray-600">You haven't completed any peer reviews yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {reviews.completed.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>
                            {review.reviewee?.full_name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("") || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <div>
                            <h3 className="font-semibold">{review.reviewee?.full_name || "Unknown User"}</h3>
                            <p className="text-sm text-gray-600">{review.reviewee?.role || "No role specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Project: {review.project?.name || "Unknown Project"}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-gray-600">
                                Completed:{" "}
                                {review.completed_at ? new Date(review.completed_at).toLocaleDateString() : "N/A"}
                              </span>
                            </div>
                          </div>
                          {review.overall_score && (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(review.overall_score)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium">{review.overall_score.toFixed(1)}/5.0</span>
                            </div>
                          )}
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
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {reviews.received.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Reviews Received</h3>
                <p className="text-gray-600">You haven't received any peer reviews yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {reviews.received.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>
                            {review.reviewer?.full_name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("") || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <div>
                            <h3 className="font-semibold">
                              Review from {review.reviewer?.full_name || "Unknown Reviewer"}
                            </h3>
                            <p className="text-sm text-gray-600">{review.reviewer?.role || "No role specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Project: {review.project?.name || "Unknown Project"}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                Received:{" "}
                                {review.completed_at ? new Date(review.completed_at).toLocaleDateString() : "Pending"}
                              </span>
                            </div>
                          </div>
                          {review.overall_score && (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(review.overall_score)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium">{review.overall_score.toFixed(1)}/5.0</span>
                            </div>
                          )}
                          {review.feedback && <p className="text-sm text-gray-600 italic">"{review.feedback}"</p>}
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
          )}
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
                    <span className="font-semibold">{reviews.completed.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reviews Received</span>
                    <span className="font-semibold">{reviews.received.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Reviews</span>
                    <span className="font-semibold">{reviews.pending.length}</span>
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
                      <span className="text-sm">Completion Rate</span>
                      <span className="text-sm font-medium">
                        {reviews.completed.length + reviews.pending.length > 0
                          ? Math.round(
                              (reviews.completed.length / (reviews.completed.length + reviews.pending.length)) * 100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        reviews.completed.length + reviews.pending.length > 0
                          ? (reviews.completed.length / (reviews.completed.length + reviews.pending.length)) * 100
                          : 0
                      }
                      className="h-2"
                    />
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
                    <span className="text-sm">Active in peer reviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Contributing to team growth</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
