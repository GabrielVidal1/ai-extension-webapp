import path from 'path';
import { CustomCommand } from '../types';
import fs from 'fs';
import { CUSTOM_COMMANDS_PATH } from '../constants';

export function getAllCustomCommand(): CustomCommand[] {
  const files = fs.readdirSync(CUSTOM_COMMANDS_PATH);
  const commands: CustomCommand[] = [];
  for (const file of files) {
    const filePath = path.join(CUSTOM_COMMANDS_PATH, file);

    const fileName = file.split('.')[0];
    try {
      const content = fs.readFileSync(filePath, 'utf8');

      commands.push({
        name: fileName,
        content: content,
        requiredCommands: []
      });
    } catch (error) {
      console.log(error);
    }
  }

  return [];
}

