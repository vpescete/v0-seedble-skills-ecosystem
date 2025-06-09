"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Download, TrendingUp, Zap, Target, AlertCircle } from "lucide-react"

// Sample data for skill development over time
const skillProgressData = [
  { month: "Jan", technical: 3.2, soft: 2.8, process: 2.5 },
  { month: "Feb", technical: 3.3, soft: 3.0, process: 2.7 },
  { month: "Mar", technical: 3.5, soft: 3.2, process: 2.9 },
  { month: "Apr", technical: 3.6, soft: 3.4, process: 3.1 },
  { month: "May", technical: 3.8, soft: 3.5, process: 3.3 },
  { month: "Jun", technical: 4.0, soft: 3.7, process: 3.5 },
  { month: "Jul", technical: 4.1, soft: 3.9, process: 3.7 },
  { month: "Aug", technical: 4.2, soft: 4.0, process: 3.8 },
  { month: "Sep", technical: 4.3, soft: 4.1, process: 3.9 },
  { month: "Oct", technical: 4.4, soft: 4.2, process: 4.0 },
  { month: "Nov", technical: 4.5, soft: 4.3, process: 4.1 },
  { month: "Dec", technical: 4.6, soft: 4.4, process: 4.2 },
]

// Sample data for skill distribution
const skillDistributionData = [
  { name: "Technical", value: 45, color: "#8b5cf6" },
  { name: "Soft Skills", value: 30, color: "#3b82f6" },
  { name: "Process", value: 15, color: "#10b981" },
  { name: "Sector-specific", value: 10, color: "#f59e0b" },
]

// Sample data for radar chart
const skillRadarData = [
  { subject: "React", A: 4.5, fullMark: 5 },
  { subject: "Node.js", A: 3.8, fullMark: 5 },
  { subject: "UI/UX", A: 4.2, fullMark: 5 },
  { subject: "DevOps", A: 3.5, fullMark: 5 },
  { subject: "Data Science", A: 2.8, fullMark: 5 },
  { subject: "Leadership", A: 4.0, fullMark: 5 },
]

// Sample data for team comparison
const teamComparisonData = [
  { name: "Team A", technical: 4.2, soft: 3.8, process: 4.0 },
  { name: "Team B", technical: 3.9, soft: 4.3, process: 3.7 },
  { name: "Team C", technical: 4.5, soft: 3.5, process: 3.9 },
  { name: "Your Team", technical: 4.0, soft: 4.0, process: 4.1 },
]

// Sample data for skill growth
const skillGrowthData = [
  { name: "React", growth: 15 },
  { name: "Leadership", growth: 12 },
  { name: "DevOps", growth: 25 },
  { name: "Data Analysis", growth: 18 },
  { name: "Communication", growth: 10 },
  { name: "Project Management", growth: 20 },
]

// Insights data
const insightsData = [
  {
    title: "Technical Growth Acceleration",
    description: "Your technical skills are growing 20% faster than the company average",
    icon: TrendingUp,
    color: "text-green-500",
    action: "View Details",
  },
  {
    title: "Leadership Gap",
    description: "Consider focusing on leadership skills to balance your profile",
    icon: Target,
    color: "text-amber-500",
    action: "Explore Courses",
  },
  {
    title: "Knowledge Sharing Opportunity",
    description: "Your React expertise could benefit 12 colleagues in your network",
    icon: Zap,
    color: "text-purple-500",
    action: "Start Mentoring",
  },
  {
    title: "Skill Decay Alert",
    description: "Your Python skills haven't been updated in 6 months",
    icon: AlertCircle,
    color: "text-red-500",
    action: "Refresh Skills",
  },
]

export function SkillAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Skill Analytics</h2>
          <p className="text-gray-500">Track your professional growth and identify opportunities</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Skill Progress Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Development Journey</CardTitle>
              <CardDescription>Your skill progression over the past 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={skillProgressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="technical"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Technical Skills"
                    />
                    <Line
                      type="monotone"
                      dataKey="soft"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Soft Skills"
                    />
                    <Line
                      type="monotone"
                      dataKey="process"
                      stroke="#10b981"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                      name="Process Skills"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Skill Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Distribution</CardTitle>
                <CardDescription>Breakdown of your skill categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={skillDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {skillDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technical Skill Profile</CardTitle>
                <CardDescription>Your strengths and areas for development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} />
                      <Radar name="Your Skills" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Skill Growth Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Growth Rate</CardTitle>
              <CardDescription>Percentage improvement in the last quarter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillGrowthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="growth" name="Growth Rate" fill="#8b5cf6">
                      {skillGrowthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.growth > 20 ? "#10b981" : "#8b5cf6"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Skill Utilization */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Utilization</CardTitle>
              <CardDescription>How frequently your skills are being applied in projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={skillProgressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="technical"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      name="Technical Skills"
                    />
                    <Area
                      type="monotone"
                      dataKey="soft"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      name="Soft Skills"
                    />
                    <Area
                      type="monotone"
                      dataKey="process"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      name="Process Skills"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {/* Team Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Team Skill Comparison</CardTitle>
              <CardDescription>How your team compares to others in the organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="technical" name="Technical Skills" fill="#8b5cf6" />
                    <Bar dataKey="soft" name="Soft Skills" fill="#3b82f6" />
                    <Bar dataKey="process" name="Process Skills" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Industry Benchmark */}
          <Card>
            <CardHeader>
              <CardTitle>Industry Benchmark</CardTitle>
              <CardDescription>Your skills compared to industry standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Technical Skills</h4>
                    <Badge variant="secondary">+12% above average</Badge>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full mb-2">
                    <div className="h-2 bg-purple-500 rounded-full" style={{ width: "82%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Industry Avg: 3.8</span>
                    <span>Your Score: 4.3</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Soft Skills</h4>
                    <Badge variant="secondary">+5% above average</Badge>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full mb-2">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Industry Avg: 3.9</span>
                    <span>Your Score: 4.1</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Process Skills</h4>
                    <Badge variant="secondary">On par with average</Badge>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full mb-2">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: "70%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Industry Avg: 3.7</span>
                    <span>Your Score: 3.7</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* AI-Generated Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>Personalized recommendations based on your skill data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insightsData.map((insight, idx) => (
                  <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full bg-gray-100 ${insight.color}`}>
                        <insight.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        <Button variant="link" className="p-0 h-auto mt-2 text-sm">
                          {insight.action} <ArrowUpRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Recommendations</CardTitle>
              <CardDescription>Suggested resources to enhance your skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Advanced DevOps Practices</h4>
                    <Badge>High Priority</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    This course will help you bridge the gap in your DevOps skills, which are currently 15% below your
                    technical average.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">8 hours • 6 modules</span>
                    <Button size="sm">View Course</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Strategic Leadership Workshop</h4>
                    <Badge variant="outline">Recommended</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Enhance your leadership capabilities to complement your strong technical profile and prepare for
                    senior roles.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">12 hours • 4 sessions</span>
                    <Button size="sm" variant="outline">
                      View Workshop
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Data Science Fundamentals</h4>
                    <Badge variant="outline">Suggested</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Based on your career interests and current skill gaps, this course would complement your technical
                    portfolio.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">20 hours • 10 modules</span>
                    <Button size="sm" variant="outline">
                      View Course
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
