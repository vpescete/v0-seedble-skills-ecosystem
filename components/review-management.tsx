"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, CheckCircle, Clock, Eye, Filter, MoreHorizontal, Star, TrendingUp, Users } from "lucide-react"

// Sample data for manager review oversight
const teamReviews = [
  {
    id: 1,
    reviewee: "Marco Rossi",
    reviewer: "Anna Bianchi",
    project: "E-commerce Platform",
    status: "pending_validation",
    submittedDate: "2024-12-15",
    scores: { technical: 4.2, soft: 4.0, process: 3.8, innovation: 4.1 },
    overallScore: 4.0,
    flagged: false,
  },
  {
    id: 2,
    reviewee: "Luca Verde",
    reviewer: "Sofia Neri",
    project: "Mobile App Development",
    status: "validated",
    submittedDate: "2024-12-12",
    validatedDate: "2024-12-14",
    scores: { technical: 3.8, soft: 4.5, process: 4.2, innovation: 3.9 },
    overallScore: 4.1,
    flagged: false,
  },
  {
    id: 3,
    reviewee: "Elena Rossi",
    reviewer: "Marco Rossi",
    project: "Data Analytics Dashboard",
    status: "flagged",
    submittedDate: "2024-12-10",
    scores: { technical: 2.1, soft: 4.8, process: 3.2, innovation: 2.5 },
    overallScore: 3.2,
    flagged: true,
    flagReason: "Significant score variance detected",
  },
]

const reviewerPerformance = [
  {
    reviewer: "Anna Bianchi",
    reviewsCompleted: 8,
    averageQuality: 4.6,
    timeliness: 92,
    consistency: 88,
    status: "excellent",
  },
  {
    reviewer: "Sofia Neri",
    reviewsCompleted: 12,
    averageQuality: 4.4,
    timeliness: 85,
    consistency: 91,
    status: "good",
  },
  {
    reviewer: "Marco Rossi",
    reviewsCompleted: 6,
    averageQuality: 3.8,
    timeliness: 67,
    consistency: 72,
    status: "needs_improvement",
  },
]

export function ReviewManagement() {
  const [selectedFilter, setSelectedFilter] = useState("all")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_validation":
        return (
          <Badge variant="outline" className="text-yellow-600">
            Pending Validation
          </Badge>
        )
      case "validated":
        return (
          <Badge variant="outline" className="text-green-600">
            Validated
          </Badge>
        )
      case "flagged":
        return <Badge variant="destructive">Flagged</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPerformanceStatus = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
      case "needs_improvement":
        return <Badge className="bg-orange-100 text-orange-800">Needs Improvement</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Review Management</h2>
          <p className="text-gray-500">Oversee and validate peer review processes</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
              <SelectItem value="validated">Validated</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reviews">Review Validation</TabsTrigger>
          <TabsTrigger value="reviewers">Reviewer Performance</TabsTrigger>
          <TabsTrigger value="analytics">Team Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Review Queue</CardTitle>
              <CardDescription>Reviews requiring validation or attention</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reviewee</TableHead>
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Overall Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamReviews.map((review) => (
                    <TableRow key={review.id} className={review.flagged ? "bg-red-50" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {review.reviewee
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{review.reviewee}</span>
                        </div>
                      </TableCell>
                      <TableCell>{review.reviewer}</TableCell>
                      <TableCell className="max-w-32 truncate">{review.project}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(review.overallScore)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm">{review.overallScore}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(review.status)}
                          {review.flagged && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{review.submittedDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {review.status === "pending_validation" && (
                            <>
                              <Button variant="ghost" size="sm" className="text-green-600">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                <AlertTriangle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Flagged Reviews Detail */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Flagged Reviews
              </CardTitle>
              <CardDescription>Reviews requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              {teamReviews
                .filter((r) => r.flagged)
                .map((review) => (
                  <div key={review.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">
                          {review.reviewee} - {review.project}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">Reviewed by: {review.reviewer}</p>
                        <p className="text-sm text-red-600 mt-2">⚠️ {review.flagReason}</p>
                        <div className="flex gap-4 mt-3 text-sm">
                          <span>Technical: {review.scores.technical}</span>
                          <span>Soft Skills: {review.scores.soft}</span>
                          <span>Process: {review.scores.process}</span>
                          <span>Innovation: {review.scores.innovation}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Review Details
                        </Button>
                        <Button size="sm">Resolve</Button>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviewers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reviewer Performance Dashboard</CardTitle>
              <CardDescription>Track and improve review quality across your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviewerPerformance.map((reviewer, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {reviewer.reviewer
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{reviewer.reviewer}</h4>
                          <p className="text-sm text-gray-600">{reviewer.reviewsCompleted} reviews completed</p>
                        </div>
                      </div>
                      {getPerformanceStatus(reviewer.status)}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Review Quality</span>
                          <span className="text-sm font-medium">{reviewer.averageQuality}/5.0</span>
                        </div>
                        <Progress value={reviewer.averageQuality * 20} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Timeliness</span>
                          <span className="text-sm font-medium">{reviewer.timeliness}%</span>
                        </div>
                        <Progress value={reviewer.timeliness} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Consistency</span>
                          <span className="text-sm font-medium">{reviewer.consistency}%</span>
                        </div>
                        <Progress value={reviewer.consistency} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Reviews</p>
                    <p className="text-2xl font-bold">156</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+12% this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Score</p>
                    <p className="text-2xl font-bold">4.2</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+0.3 improvement</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold">94%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+5% this quarter</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Flagged Reviews</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Needs attention</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Team Skill Development Trends</CardTitle>
              <CardDescription>Track how peer reviews are impacting skill growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Team skill development chart would be displayed here</p>
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
