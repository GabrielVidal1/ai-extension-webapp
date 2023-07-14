import readFile from './readFile'

export const COMMANDS = [
  readFile,
]

export const getCommands = async () => {
  return COMMANDS.map((f) => f.function)
}
