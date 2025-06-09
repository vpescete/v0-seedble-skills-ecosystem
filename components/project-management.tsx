"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ProjectCreationWizard } from "./project-creation-wizard"
import { getAllProjects, getAllUsers } from "@/lib/data-service"
import type { Project, User } from "@/lib/types"
import {
  BarChart3,
  Calendar,
  Filter,
  Grid3X3,
  List,
  Plus,
  Search,
  TrendingUp,
  Users,
  FolderOpen,
  Clock,
  Target,
} from "lucide-react"

export function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateWizard, setShowCreateWizard] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "analytics">("grid")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [projectsData, usersData] = await Promise.all([getAllProjects(), getAllUsers()])
      setProjects(projectsData)
      setUsers(usersData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectCreated = (newProject: any) => {
    // Add the new project to the list immediately for UI feedback
    const projectWithId = {
      ...newProject,
      id: `temp_${Date.now()}`,
      created_at: new Date().toISOString(),
      progress: 0,
    }
    setProjects((prev) => [projectWithId, ...prev])
    setShowCreateWizard(false)

    // In a real app, you would save to database here
    console.log("Project created:", projectWithId)
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || project.status === filterStatus
    const matchesPriority = filterPriority === "all" || (project as any).priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "active").length,
    completed: projects.filter((p) => p.status === "completed").length,
    avgProgress:
      projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length) : 0,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Management</h2>
          <p className="text-gray-600">Create and manage projects with AI-powered team recommendations</p>
        </div>
        <Button onClick={() => setShowCreateWizard(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FolderOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold">{stats.avgProgress}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "analytics" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("analytics")}
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Projects Display */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
        <TabsContent value="grid">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription className="mt-1 line-clamp-2">{project.description}</CardDescription>
                      </div>
                      <Badge
                        className={
                          project.status === "active"
                            ? "bg-green-100 text-green-800"
                            : project.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress || 0}%</span>
                        </div>
                        <Progress value={project.progress || 0} className="h-2" />
                      </div>

                      {/* Tags */}
                      {(project as any).tags && (project as any).tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {(project as any).tags.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {(project as any).tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{(project as any).tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Team Members */}
                      {(project as any).team_members && (project as any).team_members.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <div className="flex -space-x-2">
                            {(project as any).team_members.slice(0, 3).map((member: any, idx: number) => (
                              <Avatar key={idx} className="w-6 h-6 border-2 border-white">
                                <AvatarFallback className="text-xs">
                                  {member.name
                                    ?.split(" ")
                                    .map((n: string) => n[0])
                                    .join("") || "U"}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {(project as any).team_members.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                                +{(project as any).team_members.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Dates */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {project.start_date ? new Date(project.start_date).toLocaleDateString() : "No start date"}
                          </span>
                        </div>
                        {project.end_date && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(project.end_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderOpen className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
                <p className="text-gray-600 text-center mb-4">
                  {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                    ? "No projects match your current filters."
                    : "Get started by creating your first project."}
                </p>
                <Button onClick={() => setShowCreateWizard(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              {filteredProjects.length > 0 ? (
                <div className="divide-y">
                  {filteredProjects.map((project) => (
                    <div key={project.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{project.name}</h3>
                            <Badge
                              className={
                                project.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : project.status === "completed"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                              }
                            >
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Progress: {project.progress || 0}%</span>
                            <span>
                              Start: {project.start_date ? new Date(project.start_date).toLocaleDateString() : "TBD"}
                            </span>
                            {(project as any).team_members && (
                              <span>Team: {(project as any).team_members.length} members</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress || 0} className="w-24 h-2" />
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FolderOpen className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
                  <p className="text-gray-600 text-center mb-4">
                    {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                      ? "No projects match your current filters."
                      : "Get started by creating your first project."}
                  </p>
                  <Button onClick={() => setShowCreateWizard(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(stats.active / stats.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{stats.active}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{stats.completed}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{users.length}</div>
                  <div className="text-sm text-gray-600">Total Team Members</div>
                  <div className="mt-4">
                    <div className="text-lg font-semibold">{stats.avgProgress}%</div>
                    <div className="text-sm text-gray-600">Average Project Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Project Creation Wizard */}
      {showCreateWizard && (
        <ProjectCreationWizard
          isOpen={showCreateWizard}
          onClose={() => setShowCreateWizard(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  )
}
