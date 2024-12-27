import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { generateEmbedding } from '~/lib/ai/embed'
import { pinecone, PINECONE_INDEX } from '~/lib/ai/pinecone'
import { decrypt } from '~/lib/encryption'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()
  const question = messages.at(-1).content

  const index = pinecone.index(PINECONE_INDEX)

  const embeddings = await generateEmbedding(question)

  const { matches } = await index.query({
    vector: embeddings,
    topK: 5,
    includeMetadata: true,
  })

  const relevantMessages = matches
    .filter((match) => match.score && match.metadata)
    .map((match) => decrypt(match?.metadata?.text as string))

  const SYSTEM_PROMPT = `
        You are a helpful assistant. Respond to the user's query based on the following messages from their database:
        ${relevantMessages.join('\n')}
      `

  const result = streamText({
    model: openai('gpt-4o'),
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
  })

  return result.toDataStreamResponse()
}
