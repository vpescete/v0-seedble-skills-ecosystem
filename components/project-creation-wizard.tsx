"use client"

import { useState, useEffect } from "react"
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
} from "@mui/material"
import { getAllUsers } from "@/lib/data-service"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  compatibilityScore?: number
  skills?: string[]
  availability?: string
}

const ProjectCreationWizard = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<User[]>([])
  const [availableMembers, setAvailableMembers] = useState<User[]>([])
  const steps = ["Project Details", "Team Selection", "Confirmation"]

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const handleTeamMemberToggle = (member: User) => () => {
    const currentIndex = selectedTeamMembers.findIndex((m) => m.id === member.id)
    const newSelectedTeamMembers = [...selectedTeamMembers]

    if (currentIndex === -1) {
      newSelectedTeamMembers.push(member)
    } else {
      newSelectedTeamMembers.splice(currentIndex, 1)
    }

    setSelectedTeamMembers(newSelectedTeamMembers)
  }

  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const users = await getAllUsers()
        const membersWithScores = users.map((user) => ({
          ...user,
          compatibilityScore: Math.floor(Math.random() * 30) + 70, // Simulated for now
          skills: ["JavaScript", "React", "Node.js"], // Simulated for now
          availability: Math.random() > 0.3 ? "available" : "busy",
        }))
        setAvailableMembers(membersWithScores)
      } catch (error) {
        console.error("Error loading team members:", error)
      }
    }

    if (activeStep === 1) {
      loadTeamMembers()
    }
  }, [activeStep])

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              label="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Project Description"
              multiline
              rows={4}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              margin="normal"
              variant="outlined"
            />
          </>
        )
      case 1:
        return (
          <Grid container spacing={2}>
            {availableMembers.map((member) => (
              <Grid item xs={12} sm={6} md={4} key={member.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar alt={member.name} src={member.avatar} sx={{ mr: 2 }} />
                      <Typography variant="h6">{member.name}</Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Compatibility Score: {member.compatibilityScore}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Availability: {member.availability}
                    </Typography>
                    <div>
                      {member.skills?.map((skill) => (
                        <Chip key={skill} label={skill} style={{ margin: "2px" }} />
                      ))}
                    </div>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!selectedTeamMembers.find((m) => m.id === member.id)}
                          onChange={handleTeamMemberToggle(member)}
                          name={member.name}
                        />
                      }
                      label="Add to Team"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      case 2:
        return (
          <>
            <Typography variant="h5">Confirmation</Typography>
            <Typography>Project Name: {projectName}</Typography>
            <Typography>Project Description: {projectDescription}</Typography>
            <Typography>Team Members:</Typography>
            <ul>
              {selectedTeamMembers.map((member) => (
                <li key={member.id}>{member.name}</li>
              ))}
            </ul>
          </>
        )
      default:
        return "Unknown step"
    }
  }

  return (
    <Container maxWidth="md">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep)}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleNext} disabled={activeStep === steps.length - 1}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </div>
        )}
      </div>
    </Container>
  )
}

export default ProjectCreationWizard
