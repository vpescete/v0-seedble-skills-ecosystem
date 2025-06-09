"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  Text,
  Spinner,
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import CreateProjectWizard from "./create-project-wizard"
import { createProject, addProjectMember, getProjectsWithMembers } from "@/lib/data-service"

interface Project {
  id: string
  name: string
  description: string
  start_date: string
  end_date: string
  status: string
}

interface ProjectMember {
  id: string
  user_id: string
  project_id: string
  role: string
  user: {
    first_name: string
    last_name: string
  }
}

interface ProjectWithMembers extends Project {
  project_members: ProjectMember[]
}

const ProjectManagement = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [projects, setProjects] = useState<ProjectWithMembers[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateWizard, setShowCreateWizard] = useState(false)

  const loadProjects = async () => {
    setLoading(true)
    try {
      const data = await getProjectsWithMembers()
      setProjects(data)
    } catch (error) {
      console.error("Error loading projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (projectData: any) => {
    try {
      // Create the project
      const { data: project, error: projectError } = await createProject({
        name: projectData.name,
        description: projectData.description,
        start_date: projectData.startDate,
        end_date: projectData.endDate,
        status: "active",
      })

      if (projectError) throw projectError

      // Add team members
      if (projectData.teamMembers && projectData.teamMembers.length > 0) {
        for (const member of projectData.teamMembers) {
          await addProjectMember(project.id, member.id, member.role || "member")
        }
      }

      // Reload projects to show the new one
      await loadProjects()
      setShowCreateWizard(false)
    } catch (error) {
      console.error("Error creating project:", error)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return (
    <Box p={4}>
      <Heading mb={4}>Project Management</Heading>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={() => setShowCreateWizard(true)}>
          Create New Project
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Spinner size="xl" />
        </Box>
      ) : projects.length === 0 ? (
        <Text>No projects found.</Text>
      ) : (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Start Date</Th>
                <Th>End Date</Th>
                <Th>Status</Th>
                <Th>Team Members</Th>
              </Tr>
            </Thead>
            <Tbody>
              {projects.map((project) => (
                <Tr key={project.id}>
                  <Td>{project.name}</Td>
                  <Td>{project.description}</Td>
                  <Td>{project.start_date}</Td>
                  <Td>{project.end_date}</Td>
                  <Td>{project.status}</Td>
                  <Td>
                    {project.project_members.map((member) => (
                      <Text key={member.id}>
                        {member.user.first_name} {member.user.last_name} ({member.role})
                      </Text>
                    ))}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <CreateProjectWizard
        isOpen={showCreateWizard}
        onClose={() => setShowCreateWizard(false)}
        onCreate={handleCreateProject}
      />
    </Box>
  )
}

export default ProjectManagement
