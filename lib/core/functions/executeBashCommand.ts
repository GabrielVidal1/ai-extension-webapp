import { exec } from 'child_process';

export const executeBashCommand = ({ command }: { command: string }): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

const openaiFunction = {
  name: 'execute_bash_command',
  short: 'bash',
  description: 'Execute a bash command',
  parameters: {
    type: 'object',
    properties: {
      command: {
        type: 'string',
        description: 'The command to execute',
      },
    },
    required: ['command'],
  },
};

const handler = {
  function: openaiFunction,
  handler: executeBashCommand,
};

export default handler;