"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getPeerReviews, getAllUsers } from "@/lib/data-service"
import { Users, TrendingUp, Clock, CheckCircle, Star } from "lucide-react"

export function TeamDashboard() {
  const [teamStats, setTeamStats] = useState({
    totalReviews: 0,
    completedReviews: 0,
    pendingReviews: 0,
    averageScore: 0,
    activeUsers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTeamStats = async () => {
      setIsLoading(true)
      try {
        const [reviews, users] = await Promise.all([getPeerReviews(), getAllUsers()])

        const totalReviews = reviews.pending.length + reviews.completed.length
        const completedReviews = reviews.completed.length
        const pendingReviews = reviews.pending.length

        // Calculate average score from completed reviews
        const scoresWithValues = reviews.completed.map((r) => r.overall_score).filter((score) => score && score > 0)

        const averageScore =
          scoresWithValues.length > 0
            ? scoresWithValues.reduce((sum, score) => sum + score, 0) / scoresWithValues.length
            : 0

        setTeamStats({
          totalReviews,
          completedReviews,
          pendingReviews,
          averageScore,
          activeUsers: users.length,
        })
      } catch (error) {
        console.error("Error fetching team stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamStats()
  }, [])

  const completionRate = teamStats.totalReviews > 0 ? (teamStats.completedReviews / teamStats.totalReviews) * 100 : 0

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold">{teamStats.totalReviews}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">Active system</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{Math.round(completionRate)}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Progress value={completionRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold">{teamStats.averageScore.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-sm text-gray-600">Out of 5.0</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{teamStats.pendingReviews}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              {teamStats.pendingReviews > 0 ? (
                <Badge variant="outline" className="text-orange-600">
                  Needs attention
                </Badge>
              ) : (
                <Badge variant="outline" className="text-green-600">
                  All caught up
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Review Status Distribution</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed Reviews</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${completionRate}%` }}></div>
                    </div>
                    <span className="text-sm font-medium">{teamStats.completedReviews}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending Reviews</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${100 - completionRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{teamStats.pendingReviews}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Key Metrics</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Team Members</span>
                  <span className="font-medium">{teamStats.activeUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Review Score</span>
                  <span className="font-medium">{teamStats.averageScore.toFixed(1)}/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">System Adoption</span>
                  <Badge variant="outline" className="text-green-600">
                    {teamStats.totalReviews > 0 ? "Active" : "Getting Started"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
