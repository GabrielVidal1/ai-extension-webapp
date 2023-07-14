import executeBashCommand from './executeBashCommand'
import readFile from './readFile'

export const COMMANDS = [
  readFile,
  executeBashCommand,
]

export const getCommands = async () => {
  return COMMANDS.map((f) => f.function)
}
