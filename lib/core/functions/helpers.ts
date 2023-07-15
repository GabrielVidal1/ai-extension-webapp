'use server';
import { ChatCompletionRequestMessageFunctionCall } from 'openai';
import { FUNCTIONS } from '.';

export async function executeFunction(
  functionCall: ChatCompletionRequestMessageFunctionCall
) {
  const name = functionCall.name;
  if (!name) {
    return null;
  }
  const functionObject = FUNCTIONS.find(f => f.function.name === name);
  if (!functionObject) {
    return null;
  }

  try {
    const args = JSON.parse(functionCall.arguments ?? '{}');
    const result = await functionObject.handler(args);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      return `Error executing function ${name}: ${error.message}`;
    }
    return `Error executing function ${name}`;
  }
}
