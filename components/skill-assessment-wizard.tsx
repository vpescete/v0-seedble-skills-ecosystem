"use client"

import { useState, useEffect } from "react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Step,
  Steps,
  Card,
  CardHeader,
  CardBody,
  Slider,
} from "@nextui-org/react"
import { getAllSkills, createAssessment, saveAssessmentResults } from "@/lib/data-service"

interface Skill {
  id: string
  name: string
  category: string
}

interface SkillResponse {
  level: number
  interest: number
}

interface SkillAssessmentWizardProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

export function SkillAssessmentWizard({ isOpen, onClose, onComplete }: SkillAssessmentWizardProps) {
  const { onOpen } = useDisclosure()
  const [currentStep, setCurrentStep] = useState(0)
  const [skills, setSkills] = useState<Skill[]>([])
  const [responses, setResponses] = useState<Record<string, SkillResponse>>({})
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<number>(0)

  const steps = [{ title: "Start" }, { title: "Skills" }, { title: "Complete" }]

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const allSkills = await getAllSkills()
        setSkills(allSkills)

        // Initialize responses
        const initialResponses: Record<string, SkillResponse> = {}
        allSkills.forEach((skill) => {
          initialResponses[skill.id] = { level: 1, interest: 1 }
        })
        setResponses(initialResponses)
      } catch (error) {
        console.error("Error loading skills:", error)
      }
    }

    loadSkills()
  }, [])

  const handleLevelChange = (skillId: string, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [skillId]: { ...prev[skillId], level: value },
    }))
  }

  const handleInterestChange = (skillId: string, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [skillId]: { ...prev[skillId], interest: value },
    }))
  }

  const handleNext = () => {
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleComplete = async () => {
    if (!assessmentId) return

    const endTime = Date.now()
    const completionTime = Math.floor((endTime - startTime) / 1000)

    try {
      // Prepare skills data for saving
      const skillsData = Object.entries(responses).map(([skillId, response]) => ({
        skill_id: skillId,
        level: response.level,
        interest: response.interest,
        is_priority: response.level >= 4 && response.interest >= 4,
      }))

      // Save to database
      const { error } = await saveAssessmentResults(assessmentId, skillsData, completionTime)

      if (error) {
        console.error("Error saving assessment:", error)
        return
      }

      // Call the onComplete callback to refresh parent data
      onComplete?.()
      onClose()
    } catch (error) {
      console.error("Error completing assessment:", error)
    }
  }

  const handleStart = async () => {
    try {
      const { data: assessment, error } = await createAssessment({
        type: "complete",
      })

      if (error) {
        console.error("Error creating assessment:", error)
        return
      }

      setAssessmentId(assessment.id)
      setCurrentStep(1)
      setStartTime(Date.now())
    } catch (error) {
      console.error("Error starting assessment:", error)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <h2>Welcome to the Skill Assessment!</h2>
            <p>This assessment will help us understand your current skill levels and interests.</p>
            <Button color="primary" onPress={handleStart}>
              Start Assessment
            </Button>
          </div>
        )
      case 1:
        return (
          <div>
            <h2>Rate Your Skills</h2>
            {skills.map((skill) => (
              <Card key={skill.id} className="mb-4">
                <CardHeader>
                  <h3>{skill.name}</h3>
                </CardHeader>
                <CardBody>
                  <div className="mb-4">
                    <p>Level of Expertise:</p>
                    <Slider
                      minValue={1}
                      maxValue={5}
                      step={1}
                      defaultValue={1}
                      value={responses[skill.id]?.level || 1}
                      onChange={(value) => handleLevelChange(skill.id, value)}
                      classNames={{
                        thumb:
                          "data-[dragging=true]:w-5 data-[dragging=true]:h-5 data-[dragging=true]:after:w-2.5 data-[dragging=true]:after:h-2.5",
                        value: "font-bold text-black",
                      }}
                    />
                  </div>
                  <div>
                    <p>Level of Interest:</p>
                    <Slider
                      minValue={1}
                      maxValue={5}
                      step={1}
                      defaultValue={1}
                      value={responses[skill.id]?.interest || 1}
                      onChange={(value) => handleInterestChange(skill.id, value)}
                      classNames={{
                        thumb:
                          "data-[dragging=true]:w-5 data-[dragging=true]:h-5 data-[dragging=true]:after:w-2.5 data-[dragging=true]:after:h-2.5",
                        value: "font-bold text-black",
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )
      case 2:
        return (
          <div>
            <h2>Thank you!</h2>
            <p>You have completed the skill assessment. Your results have been saved.</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpen}
      isKeyboardDismissDisabled={true}
      backdrop="blur"
      size="4xl"
    >
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Skill Assessment</ModalHeader>
            <ModalBody>
              <Steps size="sm" current={currentStep} onStepChange={setCurrentStep}>
                {steps.map((step, index) => (
                  <Step key={index} title={step.title} />
                ))}
              </Steps>
              <div className="mt-4">{renderStepContent()}</div>
            </ModalBody>
            <ModalFooter>
              {currentStep > 0 && (
                <Button color="secondary" onPress={handleBack}>
                  Back
                </Button>
              )}
              {currentStep < steps.length - 1 && currentStep !== 0 && (
                <Button color="primary" onPress={handleNext}>
                  Next
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button color="primary" onPress={handleComplete}>
                  Complete
                </Button>
              )}
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
