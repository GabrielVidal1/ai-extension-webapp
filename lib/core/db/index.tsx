import prisma from '@/lib/prisma'
import { PrismaClient } from '@prisma/client'

interface Project {
  id: string
  name: string
  description: string
}

// Create
export const createProject = async (project: Project) => {
  return prisma.project.create({
    data: {
      name: project.name,
      description: project.description
    }
  })
}

// Read
export const getProject = async (id: string) => {
  return prisma.project.findUnique({
    where: { id }
  })
}

export const getProjects = async () => {
  return prisma.project.findMany()
}

// Update
export const updateProject = async (project: Project) => {
  return prisma.project.update({
    where: { id: project.id },
    data: {
      name: project.name,
      description: project.description
    }
  })
}

// Delete
export const deleteProject = async (id: string) => {
  return prisma.project.delete({
    where: { id }
  })
}
