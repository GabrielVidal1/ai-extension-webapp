import { processPrompt } from './core/interpreter';


export function functionFormatResult(
  result: Awaited<ReturnType<typeof processPrompt>>[number]
) {
  if ('function_call' in result) {
    const { function_call, functionResult } = result;

    return `$${function_call?.name}(${function_call?.arguments})\n${functionResult}`;
  }

  return result.content ?? '';
}
