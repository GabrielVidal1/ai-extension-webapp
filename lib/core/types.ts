export interface Project {
  id: string
  name: string
  path: string
}

export interface CustomCommand {
  name: string
  content: string
  requiredCommands: string[]
}