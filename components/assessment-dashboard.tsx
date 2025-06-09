"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getUserStatistics, getUserSkills, getUserAssessments } from "@/lib/data-service"

const AssessmentDashboard: React.FC = () => {
  const [userStats, setUserStats] = useState<any>(null)
  const [userSkills, setUserSkills] = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    setLoading(true)
    try {
      // Load user statistics
      const stats = await getUserStatistics()
      if (stats) {
        setUserStats(stats)
      }

      // Load user skills
      const skills = await getUserSkills()
      setUserSkills(skills)

      // Load assessments
      const assessments = await getUserAssessments()
      setAssessments(assessments)
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Assessment Dashboard</h1>

      {userStats && (
        <div>
          <h2>User Statistics</h2>
          <p>Score: {userStats.score}</p>
          <p>Rank: {userStats.rank}</p>
        </div>
      )}

      <div>
        <h2>User Skills</h2>
        <ul>
          {userSkills.map((skill) => (
            <li key={skill.id}>{skill.name}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Assessments</h2>
        <ul>
          {assessments.map((assessment) => (
            <li key={assessment.id}>{assessment.title}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AssessmentDashboard
