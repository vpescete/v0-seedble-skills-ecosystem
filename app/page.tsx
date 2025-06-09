"use client"

import { useState } from "react"
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
import {
  BookOpen,
  Brain,
  Calendar,
  LineChartIcon as ChartLine,
  ChevronLeft,
  ChevronRight,
  Code,
  Filter,
  Home,
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

export default function SeedbleSkillsDashboard() {
  const [selectedDate, setSelectedDate] = useState(15)
  const [activeView, setActiveView] = useState("dashboard")

  const skillsData = [
    {
      category: "Technical Skills",
      skills: [
        { name: "React/Next.js", level: 4, trend: "up", projects: 8 },
        { name: "Python", level: 3, trend: "stable", projects: 5 },
        { name: "Machine Learning", level: 2, trend: "up", projects: 3 },
        { name: "DevOps", level: 3, trend: "up", projects: 6 },
      ],
    },
    {
      category: "Soft Skills",
      skills: [
        { name: "Leadership", level: 4, trend: "up", projects: 12 },
        { name: "Communication", level: 5, trend: "stable", projects: 15 },
        { name: "Problem Solving", level: 4, trend: "up", projects: 10 },
        { name: "Team Management", level: 3, trend: "up", projects: 7 },
      ],
    },
  ]

  const onlineUsers = [
    { name: "Marco Rossi", role: "Senior Developer", avatar: "MR", status: "online" },
    { name: "Anna Bianchi", role: "UX Designer", avatar: "AB", status: "online" },
    { name: "Luca Verde", role: "Project Manager", avatar: "LV", status: "away" },
    { name: "Sofia Neri", role: "Data Scientist", avatar: "SN", status: "online" },
  ]

  const knowledgeCircles = [
    {
      title: "AI & Machine Learning",
      description: "Exploring latest trends in artificial intelligence and ML applications",
      members: 24,
      icon: Brain,
      color: "bg-purple-500",
    },
    {
      title: "Frontend Development",
      description: "Modern web development practices and frameworks",
      members: 18,
      icon: Code,
      color: "bg-blue-500",
    },
    {
      title: "Leadership & Management",
      description: "Developing leadership skills and management techniques",
      members: 31,
      icon: Target,
      color: "bg-green-500",
    },
  ]

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
            className={`w-full justify-start text-white hover:bg-white/20 ${activeView === "skills" ? "bg-white/10" : ""}`}
            onClick={() => setActiveView("skills")}
          >
            <BookOpen className="w-4 h-4 mr-3" />
            My Skills
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
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Skills Dashboard</h2>
              <p className="text-gray-600">Manage and develop your professional competencies</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search skills..." className="pl-10 w-64" />
              </div>
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>CE</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activeView === "dashboard" && (
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
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="soft">Soft Skills</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    {skillsData.map((category, idx) => (
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
                        <div className="space-y-4">
                          {skillsData[0].skills.map((skill, idx) => (
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
                              <p className="text-sm text-gray-600 mb-2">Used in {skill.projects} projects this year</p>
                              <Button variant="outline" size="sm">
                                Request Peer Review
                              </Button>
                            </div>
                          ))}
                        </div>
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
                        <div className="space-y-4">
                          {skillsData[1].skills.map((skill, idx) => (
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
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="analytics">
                    <SkillAnalytics />
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
                              <circle.icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{circle.title}</h4>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{circle.description}</p>
                              <p className="text-xs text-gray-500 mt-2">{circle.members} members</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeView === "reviews" && <PeerReviewWorkflow />}

          {activeView === "management" && <ReviewManagement />}

          {/* Add other views as needed */}
        </div>
      </div>
    </div>
  )
}
