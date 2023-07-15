'use server'
import { getCompletion } from './chat/completion'
import { processChat } from './chat/interpreter'
import { COMMANDS } from './commands'
import { Project } from './types'
import { CUSTOM_COMMANDS, executeCommand } from './commands/execution'

export async function promptBuilder(
  prompt: string,
  project: Project,
  preview = false
) {
  const lines = prompt.split('\n')

  const commands = []
  let functionCall = ''

  let context = ''

  let result = ''

  for (const line of lines) {
    if (line.startsWith('/')) {
      const command = line.split(' ')[0].slice(1)
      if (CUSTOM_COMMANDS.find(c => c.name === command)) {
        const customCommand = CUSTOM_COMMANDS.find(c => c.name === command)
        if (customCommand) {
          console.log(customCommand)
        }
      }

      commands.push(line)
      const commandString = line.slice(1)
      const commandName = line.split(' ')[0].slice(1)
      const commandArguments = commandString.split(' ').slice(1)

      if (!preview) {
        const re = await executeCommand(commandName, commandArguments, project)
        context += re
      } else {
        context += `Will execute command: ${commandName}(${commandArguments.join(
          ', '
        )})\n`
      }

      // result += re
    } else if (line.startsWith('>')) {
      functionCall = line.slice(1)
    } else {
      result += line
    }
    result += '\n'
  }
  // Results is an array of completion
  return { context, prompt: result, commands, functionCall }
}

export async function preprocessPrompt(prompt: string, project: Project) {
  const subPrompts = prompt.split('===\n')
  const promptBuilds = await Promise.all(
    subPrompts.map(p => promptBuilder(p, project))
  )
  return promptBuilds
}

export async function processPrompt(prompt: string, project: Project) {
  const promptBuilds = await preprocessPrompt(prompt, project)

  const messages = []
  const results = []
  for (const promptBuild of promptBuilds) {
    const completion = await getCompletion({ ...promptBuild })
    messages.push(completion.choices[0].message)

    const result = await processChat(completion)
    results.push(result)
  }

  return results
}

export async function getAvailableCommands() {
  return COMMANDS
}
