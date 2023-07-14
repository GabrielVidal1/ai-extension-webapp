import { ChatCompletionRequestMessage } from "openai";
import { SYSTEM_PROMPT } from "../prompts";
import { OPENAI_FUNCTIONS } from "../functions";
import { openai } from "./config";

function generateMessages(context: string, prompt: string): ChatCompletionRequestMessage[] {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    // { role: 'system', content: context },
    { role: 'user', content: prompt }
  ];
}

export async function getCompletion(context: string, prompt: string, functionCall?: string, maxTokens: number = 1000) {
  const messages = generateMessages(context, prompt);
  const function_call = functionCall ? { name: functionCall } : undefined;
  console.log(function_call, OPENAI_FUNCTIONS);
  try {
    const result = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0613',
      messages,
      functions: OPENAI_FUNCTIONS,
      max_tokens: maxTokens,
      function_call
    });
    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    throw error;
  }
}
