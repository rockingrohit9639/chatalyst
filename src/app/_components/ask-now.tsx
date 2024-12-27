'use client'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'
import { useChat } from 'ai/react'

type AskNowProps = {
  className?: string
  style?: React.CSSProperties
}

export default function AskNow({ className, style }: AskNowProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()

  return (
    <div className={cn('flex w-full flex-col items-center justify-center gap-4', className)} style={style}>
      <form className="mb-4 flex w-full flex-col items-center justify-center gap-4" onSubmit={handleSubmit}>
        <Input
          name="question"
          className="md:max-w-screen-sm"
          placeholder="What do you want do ask today?"
          minLength={1}
          disabled={isLoading}
          value={input}
          onChange={handleInputChange}
        />
        <Button loading={isLoading}>Ask now</Button>
      </form>

      <div className="max-h-[500px] overflow-auto text-left">
        {messages
          .filter((message) => message.role === 'assistant')
          .map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.content}
            </div>
          ))}
      </div>
    </div>
  )
}
