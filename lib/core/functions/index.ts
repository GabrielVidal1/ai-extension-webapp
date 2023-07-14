import executeBashCommand from "./executeBashCommand";
import writeFile from "./writeFile";

export const FUNCTIONS = [
  writeFile,
  executeBashCommand,
]

export const OPENAI_FUNCTIONS = FUNCTIONS.map((f) => f.function)