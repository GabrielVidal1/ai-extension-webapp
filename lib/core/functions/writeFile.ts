import fs from "fs";
import path from "path";

interface WriteFileArgs {
  filename: string;
  folder: string;
  content: string;
}

async function writeFile({ filename, folder, content }: WriteFileArgs) {
  const filePath = path.join(folder, filename)
  await fs.promises.writeFile(filePath, content);
  return `Wrote ${content.length} characters to ${filePath}`;
}

const openaiFunction = {
  name: "write_file",
  description: "Write the content of a file",
  parameters: {
    type: "object",
    properties: {
      filename: {
        type: "string",
        description: "The name of the file to write",
      },
      folder: {
        type: "string",
        description: "The folder to write the file to",
      },
      content: {
        type: "string",
        description: "The content to write to the file",
      },
    },
    required: ["filename", "content", "folder"],
  },
}

const handler = {
  function: openaiFunction,
  handler: writeFile,
  short: 'write',
}

export default handler;