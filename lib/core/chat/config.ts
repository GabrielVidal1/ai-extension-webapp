import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { SYSTEM_PROMPT } from "../prompts";
import { OPENAI_FUNCTIONS } from "../functions";

export const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

export const openai = new OpenAIApi(configuration)

function generateMessages(context: string, prompt: string): ChatCompletionRequestMessage[] {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    // { role: 'system', content: context },
    { role: 'user', content: prompt }
  ]
}

export async function getCompletion(context: string, prompt: string, functionCall?: string, maxTokens: number = 1000) {
  const messages = generateMessages(context, prompt)
  console.log(functionCall)
  try {
    const result = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0613',
      messages,
      functions: OPENAI_FUNCTIONS,
      max_tokens: maxTokens,
      // function_call: functionCall ? { name: functionCall } : undefined,
    })
    return result.data
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
    }
    throw error
  }
}


