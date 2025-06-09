"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, X, Loader2 } from "lucide-react"

interface CVUploadProps {
  onSkillsExtracted: (skills: string[]) => void
  onClose: () => void
}

export function CVUpload({ onSkillsExtracted, onClose }: CVUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ]
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please upload a PDF, DOC, DOCX, or TXT file")
        return
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("file", file)

      // In a real implementation, you would send this to your API endpoint
      // For now, we'll simulate the process and extract some sample skills
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate skill extraction based on file content
      const extractedSkills = await simulateSkillExtraction(file)

      setUploadProgress(100)

      // Wait a moment to show completion
      setTimeout(() => {
        onSkillsExtracted(extractedSkills)
      }, 500)
    } catch (err) {
      setError("Failed to process the file. Please try again.")
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const simulateSkillExtraction = async (file: File): Promise<string[]> => {
    // In a real implementation, you would:
    // 1. Upload the file to your server
    // 2. Use a service like AWS Textract, Google Document AI, or a custom NLP service
    // 3. Parse the text and extract skills using AI/ML

    // For demo purposes, we'll return some common skills based on file name or random selection
    const commonSkills = [
      "JavaScript",
      "Python",
      "React",
      "Node.js",
      "SQL",
      "Git",
      "Project Management",
      "Communication",
      "Leadership",
      "Problem Solving",
      "Agile Methodology",
      "Team Collaboration",
      "Data Analysis",
      "UI/UX Design",
    ]

    // Simulate AI processing by returning a random subset
    const numSkills = Math.floor(Math.random() * 8) + 5 // 5-12 skills
    const shuffled = [...commonSkills].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, numSkills)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      // Create a fake event to reuse the file selection logic
      const fakeEvent = {
        target: { files: [droppedFile] },
      } as React.ChangeEvent<HTMLInputElement>
      handleFileSelect(fakeEvent)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Upload CV/Resume</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!file ? (
        <Card
          className="border-2 border-dashed border-gray-300 hover:border-purple-400 cursor-pointer transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-medium mb-2">Upload your CV or Resume</h4>
            <p className="text-sm text-gray-600 mb-4">Drag and drop your file here, or click to browse</p>
            <p className="text-xs text-gray-500">Supported formats: PDF, DOC, DOCX, TXT (max 5MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-blue-500" />
              <div className="flex-1">
                <h4 className="font-medium">{file.name}</h4>
                <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              {!isUploading && (
                <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {isUploading && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing document...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleUpload} disabled={isUploading} className="flex-1">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Extracting Skills...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Extract Skills
                  </>
                )}
              </Button>
              {!isUploading && (
                <Button variant="outline" onClick={() => setFile(null)}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Upload your CV or resume in PDF, DOC, or TXT format</li>
          <li>• Our AI will analyze the document and extract relevant skills</li>
          <li>• Review and confirm the extracted skills</li>
          <li>• Continue with your skills assessment</li>
        </ul>
      </div>
    </div>
  )
}
