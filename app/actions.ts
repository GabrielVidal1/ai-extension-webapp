'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'

import { auth } from '@/auth'
import { type Chat } from '@/lib/types'
import { USER_ID } from '@/lib/constants'
import { nanoid } from 'nanoid'
import { CreateChatCompletionResponse, ChatCompletionResponseMessage } from 'openai'

export async function getChats() {
  try {
    const pipeline = kv.pipeline()
    const chats: string[] = await kv.zrange(`user:chat:${USER_ID}`, 0, -1, {
      rev: true
    })

    for (const chat of chats) {
      pipeline.hgetall(chat)
    }

    const results = await pipeline.exec()

    return results as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChat(id: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat) {
    return null
  }

  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const uid = await kv.hget<string>(`chat:${id}`, 'userId')

  await kv.del(`chat:${id}`)
  await kv.zrem(`user:chat:${USER_ID}`, `chat:${id}`)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  const chats: string[] = await kv.zrange(`user:chat:${USER_ID}`, 0, -1)
  if (!chats.length) {
    return redirect('/')
  }
  const pipeline = kv.pipeline()

  for (const chat of chats) {
    pipeline.del(chat)
    pipeline.zrem(`user:chat:${USER_ID}`, chat)
  }

  await pipeline.exec()

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function shareChat(chat: Chat) {
  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  await kv.hmset(`chat:${chat.id}`, payload)

  return payload
}


export async function createChat(completion: CreateChatCompletionResponse, messages: ChatCompletionResponseMessage[]) {
  // const title = content.substring(0, 100)
  const id = nanoid()
  const createdAt = Date.now()
  const path = `/chat/${id}`
  const payload = {
    id,
    userId: USER_ID,
    createdAt,
    path,
    messages: [
      ...messages,
      {
        content: completion,
        role: 'assistant'
      }
    ]
  }
  await kv.hmset(`chat:${id}`, payload)
  await kv.zadd(`user:chat:${USER_ID}`, {
    score: createdAt,
    member: `chat:${id}`
  })
}