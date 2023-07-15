import path from "path";
import fs from "fs";
import { Project } from "../../types";

const TEMPLATE = `Content of the file \`{{filePath}}\`:\n===\n{{fileContents}}\n===\n`;

function findFile(directory: string, fileName: string): string | null {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const foundFilePath = findFile(filePath, fileName);
      if (foundFilePath) {
        return foundFilePath;
      }
    } else if (file === fileName) {
      return filePath;
    }
  }

  return null;
}

const readFile = (project: Project) => async (args: string[]) => {
  const fileName = args[0];
  const filePath = findFile(project.path, fileName);

  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error(`File ${fileName} not found in ${project.path}`);
  }
  const fileContents = await fs.promises.readFile(filePath, 'utf8');

  const result = TEMPLATE
    .replace('{{filePath}}', filePath)
    .replace('{{projectPath}}', project.path)
    .replace('{{fileContents}}', fileContents);

  return result;
}

const commandDescription = {
  name: "readFile",
  description: "Read the content of a file by name",
  parameters: {
    type: "object",
    properties: {
      fileName: {
        type: "string",
        description: "The name of the file to read",
      },
    },
    required: ["fileName"],
  },
}

const handler = {
  function: commandDescription,
  handler: readFile,
  short: 'read',
}

export default handler;