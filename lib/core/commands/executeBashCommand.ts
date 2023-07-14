import { Project } from '../types'
import { executeBashCommand as executeBashCommandFunc } from '../functions/executeBashCommand'

const TEMPLATE = `$ {{command}}\n> {{commandResult}}\n\n===\n`


const executeBashCommand = (project: Project) => async (args: string[]) => {
  const command = args.join(' ')
  console.log('Executing bash command:', command)
  const commandResult = await executeBashCommandFunc({ command })

  const result = TEMPLATE
    .replace('{{command}}', command)
    .replace('{{commandResult}}', commandResult)

  console.log('Bash command result:', result)
  return result
}

const commandDescription = {
  name: 'bash',
  description: 'Executes a bash command',
  parameters: {
    type: 'object',
    properties: {
      command: {
        type: 'string',
        description: 'The bash command to execute'
      }
    },
    required: ['command']
  }
}

const handler = {
  function: commandDescription,
  handler: executeBashCommand
}

export default handler
