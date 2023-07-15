import executeBashCommand from './commands/executeBashCommand'
import readFile from './commands/readFile'

export const COMMANDS = [
  readFile,
  executeBashCommand,
]

export const getCommands = async () => {
  return COMMANDS.map((f) => f.function)
}
