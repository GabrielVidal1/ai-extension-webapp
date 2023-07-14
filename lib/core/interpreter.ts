"use server"
import { getCompletion } from './chat/config'
import { processChat } from './chat/interpreter'
import { COMMANDS } from './commands'
import { Project } from './types'

async function executeCommand(commandString: string, project: Project) {
  console.log(commandString)

  // Remove the leading slash
  const commandName = commandString.split(' ')[0].slice(1)

  const command = COMMANDS.find(c => c.function.name === commandName)

  if (!command) {
    return `Command ${commandName} not found`
  }

  const commandArguments = commandString.split(' ').slice(1)

  const commandArgumentsObject = commandArguments.reduce((acc, arg) => {
    const [key, value] = arg.split('=')
    return { ...acc, [key]: value }
  }, {})

  const args = {
    ...commandArgumentsObject,
    project
  } as any
  console.log(args)
  try {
    const result = await command.handler(args)
    return result
  } catch (error) {
    if (error instanceof Error) {
      return `Error executing command ${commandName}: ${error.message}`
    }
    return `Error executing command ${commandName}`
  }
}

export async function promptBuilder(prompt: string, project: Project) {
  const lines = prompt.split('\n')

  let result = ''

  const commands = []
  let functionCall = ''

  let context = ''

  for (const line of lines) {
    if (line.startsWith('/')) {
      commands.push(line)
      const re = await executeCommand(line, project)
      context += re

      // result += re
    } else if (line.startsWith('>')) {
      functionCall = line.slice(1)
    } else {
      result += line
    }
    result += '\n'
  }

  return { context, prompt: result, commands, functionCall }
}

export async function processPrompt(
  prompt: string,
  project: Project
) {
  const { prompt: fullPrompt, context, functionCall } = await promptBuilder(prompt, project)

  const completion = await getCompletion(context, fullPrompt, functionCall)

  const result = await processChat(completion)

  return result
}

