"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { LinkedinIcon as LinkedIn, X, Loader2, ExternalLink } from "lucide-react"

interface LinkedInImportProps {
  onSkillsExtracted: (skills: string[], profile: any) => void
  onClose: () => void
}

export function LinkedInImport({ onSkillsExtracted, onClose }: LinkedInImportProps) {
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const validateLinkedInUrl = (url: string): boolean => {
    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/
    return linkedinRegex.test(url)
  }

  const handleImport = async () => {
    if (!linkedinUrl) {
      setError("Please enter your LinkedIn profile URL")
      return
    }

    if (!validateLinkedInUrl(linkedinUrl)) {
      setError("Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)")
      return
    }

    setIsImporting(true)
    setImportProgress(0)
    setError(null)

    try {
      // Simulate import progress
      const progressSteps = [
        { progress: 20, message: "Connecting to LinkedIn..." },
        { progress: 40, message: "Fetching profile data..." },
        { progress: 60, message: "Analyzing experience..." },
        { progress: 80, message: "Extracting skills..." },
        { progress: 100, message: "Import complete!" },
      ]

      for (const step of progressSteps) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setImportProgress(step.progress)
      }

      // Simulate extracted data
      const extractedData = await simulateLinkedInExtraction(linkedinUrl)

      // Wait a moment to show completion
      setTimeout(() => {
        onSkillsExtracted(extractedData.skills, extractedData.profile)
      }, 500)
    } catch (err) {
      setError("Failed to import from LinkedIn. Please try again.")
      setIsImporting(false)
      setImportProgress(0)
    }
  }

  const simulateLinkedInExtraction = async (url: string) => {
    // In a real implementation, you would:
    // 1. Use LinkedIn API (requires OAuth and user consent)
    // 2. Or use a web scraping service (be careful about LinkedIn's terms)
    // 3. Parse the profile data and extract skills, experience, etc.

    // For demo purposes, we'll return simulated data
    const profileName = url.split("/in/")[1]?.replace("/", "") || "user"

    const simulatedProfile = {
      name: profileName.charAt(0).toUpperCase() + profileName.slice(1),
      headline: "Software Developer at Tech Company",
      location: "San Francisco, CA",
      experience: [
        {
          title: "Senior Software Developer",
          company: "Tech Company",
          duration: "2022 - Present",
        },
        {
          title: "Software Developer",
          company: "Previous Company",
          duration: "2020 - 2022",
        },
      ],
    }

    const extractedSkills = [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "SQL",
      "AWS",
      "Docker",
      "Git",
      "Agile Methodology",
      "Team Leadership",
      "Project Management",
      "Communication",
      "Problem Solving",
    ]

    return {
      profile: simulatedProfile,
      skills: extractedSkills,
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <LinkedIn className="w-5 h-5 text-blue-600" />
          Import from LinkedIn
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
              <Input
                id="linkedin-url"
                placeholder="https://linkedin.com/in/yourname"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                disabled={isImporting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Make sure your LinkedIn profile is set to public or accessible
              </p>
            </div>

            {isImporting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Importing profile data...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} className="h-2" />
              </div>
            )}

            <Button onClick={handleImport} disabled={isImporting || !linkedinUrl} className="w-full">
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <LinkedIn className="w-4 h-4 mr-2" />
                  Import Profile
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">What we'll import</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Professional skills and endorsements</li>
          <li>• Work experience and job titles</li>
          <li>• Education and certifications</li>
          <li>• Industry and location information</li>
        </ul>
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs text-blue-600">
            <ExternalLink className="w-3 h-3 inline mr-1" />
            We respect your privacy. Only public profile information is accessed.
          </p>
        </div>
      </div>
    </div>
  )
}
