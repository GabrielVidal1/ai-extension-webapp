Custom command template :

```ts
import { Project } from '../types'

const TEMPLATE = `Custom Command Result for arg \`{{customArg}}\`:\n===\n{{commandResult}}\n===\n`

interface CustomCommandArgs {
  // Add your custom parameters here
  customArg: string

  project: Project
}

const customCommand = async ({ customArg, project }: CustomCommandArgs) => {
  // Add your custom code here
  const commandResult = 'Hello World!'

  // Return the result
  const result = TEMPLATE.replace('{{customArg}}', customArg).replace(
    '{{commandResult}}',
    commandResult
  )

  return result
}

const commandDescription = {
  name: 'customCommand',
  description: 'The description of your custom command',
  // Add your custom parameters here in JSON Schema format
  parameters: {
    type: 'object',
    properties: {
      customArg: {
        type: 'string',
        description: 'The description of your custom parameter'
      }
    },
    required: ['fileName']
  }
}

const handler = {
  function: commandDescription,
  handler: customCommand
}

export default handler
```

Replace the TODOs with your custom code.
