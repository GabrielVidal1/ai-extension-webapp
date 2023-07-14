'use server'
import {
  ChatCompletionRequestMessageFunctionCall,
  CreateChatCompletionResponse
} from 'openai'
import { FUNCTIONS } from '../functions'

async function executeFunction(
  functionCall: ChatCompletionRequestMessageFunctionCall
) {
  const name = functionCall.name
  if (!name) {
    return null
  }
  const functionObject = FUNCTIONS.find(f => f.function.name === name)
  if (!functionObject) {
    return null
  }

  try {
    const args = JSON.parse(functionCall.arguments ?? '{}')
    const result = await functionObject.handler(args)
    return result
  } catch (error) {
    if (error instanceof Error) {
      return `Error executing function ${name}: ${error.message}`
    }
    return `Error executing function ${name}`
  }
}

export async function processChat(rep: CreateChatCompletionResponse) {
  const { choices } = rep

  const choice = choices[0]

  const { message } = choice

  if (!message) {
    throw new Error('No message')
  }

  const { function_call, content, role } = message

  if (!function_call) {
    return { content, role }
  }

  const functionResult = await executeFunction(function_call) ?? 'Nothing executed';
  return { ...message, functionResult }
}
