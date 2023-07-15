'use server'
import {
  CreateChatCompletionResponse
} from 'openai'
import { executeFunction } from '../functions/helpers'

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
