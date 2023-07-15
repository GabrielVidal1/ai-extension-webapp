import { ChatCompletionRequestMessage } from "openai";
import { SYSTEM_PROMPT } from "../prompts";
import { OPENAI_FUNCTIONS } from "../functions";
import { openai } from "./config";

type Prompt = {
  context?: string;
  prompt: string;
}

function generateMessages({ context, prompt }: Prompt): ChatCompletionRequestMessage[] {
  let messages: ChatCompletionRequestMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];
  if (context) {
    messages.push({ role: 'system', content: context });
  }
  messages.push({ role: 'user', content: prompt });
  return messages;
}

interface CompletionParams {
  context: string;
  prompt: string;
  functionCall?: string;
  maxTokens?: number;
  messages?: ChatCompletionRequestMessage[];
}

export async function getCompletion({ context, prompt, functionCall, maxTokens = 1000, messages: pastMessages }: CompletionParams) {
  const messages = generateMessages({ context, prompt });
  const function_call = functionCall ? { name: functionCall } : undefined;
  try {
    const result = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0613',
      messages,
      functions: OPENAI_FUNCTIONS,
      max_tokens: maxTokens,
      function_call,
    });
    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    throw error;
  }
}
