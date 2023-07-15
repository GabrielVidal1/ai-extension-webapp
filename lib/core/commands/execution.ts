import { COMMANDS } from '.';
import { Project } from '../types';
import { getAllCustomCommand } from './helpers';

export const CUSTOM_COMMANDS = getAllCustomCommand();

export const getCommand = (commandName: string) => {
  return COMMANDS.find(c => c.function.name === commandName) ?? null
}

export async function executeCommand(commandName: string, commandArguments: string[], project: Project) {
  const command = COMMANDS.find(c => c.function.name === commandName);

  if (!command) {
    return `Command ${commandName} not found`;
  }


  try {
    const result = await command.handler(project)(commandArguments);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      return `Error executing command ${commandName}: ${error.message}`;
    }
    return `Error executing command ${commandName}`;
  }
}
