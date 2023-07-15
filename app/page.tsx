'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  preprocessPrompt,
  processPrompt,
  promptBuilder
} from '@/lib/core/interpreter'
import { Project } from '@/lib/core/types'
import { functionFormatResult } from '@/lib/functionFormatResult'
import React, { useState } from 'react'

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
      const prompts = await preprocessPrompt(prompt, project)

      setGeneratedContext(
        prompts.map(prompt => prompt.context + prompt.prompt).join('\n')
      )
      setFunctionCall(prompts.map(prompt => prompt.functionCall).join(' > '))
    } catch (e) {
      console.log(e)
    }
    setIsLoading(false)
  }

  const execute = async () => {
    setIsLoading(true)
    try {
      const res = await processPrompt(prompt, project)
      const ress = res.map(r => functionFormatResult(r)).join('\n')
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
          className="m-3 h-56 w-full"
          placeholder="Type your message here..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        ></Textarea>
        <div className="flex justify-between">
          <Button onClick={generateContext}>Generate Context</Button>

          <Button onClick={execute}>Execute</Button>
        </div>
        <div className="whitespace-pre-wrap">
          Function Call : {functionCall}
        </div>
        <p className="whitespace-pre-wrap">{generatedContext}</p>
      </div>
      <div className="mt-4 flex flex-1 flex-col gap-2">
        {isLoading && <div>Loading...</div>}
        <div className="whitespace-pre-wrap">{result}</div>
      </div>
    </div>
  )
}
