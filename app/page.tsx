'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { processChat } from '@/lib/core/chat/interpreter'
import { processPrompt, promptBuilder } from '@/lib/core/interpreter'
import { Project } from '@/lib/core/types'
import { functionFormatResult, nanoid } from '@/lib/utils'
import React, { use, useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

const project: Project = {
  id: 'test',
  name: 'test',
  path: '.'
}

export default function IndexPage() {
  const [prompt, setPrompt] = useState('>writeFile')
  const [functionCall, setFunctionCall] = useState('')
  // const [projectPath, setProjectPath] = useState('.')
  const [generatedContext, setGeneratedContext] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [result, setResult] = useState('')

  const generateContext = async () => {
    setIsLoading(true)
    try {
      const {
        context: res,
        prompt: p,
        functionCall
      } = await promptBuilder(prompt, project)

      setGeneratedContext(res + '\n' + p)
      setFunctionCall(functionCall)
    } catch (e) {
      console.log(e)
    }
    setIsLoading(false)
  }

  const execute = async () => {
    setIsLoading(true)
    try {
      const res = await processPrompt(prompt, project)
      const ress = functionFormatResult(res)
      setResult(ress)
    } catch (e) {
      console.log(e)
    }
    setIsLoading(false)
  }

  return (
    <div className="flex">
      <div className="flex flex-1 flex-col gap-2">
        <Textarea
          className="h-56 w-full"
          placeholder="Type your message here..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        ></Textarea>
        {isLoading && <div>Loading...</div>}
        <div className="flex justify-between">
          <Button onClick={generateContext}>Generate Context</Button>

          <Button onClick={execute}>Execute</Button>
        </div>
        <div className="whitespace-pre-wrap">
          Function Call : {functionCall}
        </div>
        <p className="whitespace-pre-wrap">{generatedContext}</p>
      </div>
      <div className="mt-4 flex-1">
        <div className="whitespace-pre-wrap">{result}</div>
      </div>
    </div>
  )
}
