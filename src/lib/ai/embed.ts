import { encrypt } from '../encryption'
import { openai } from './openai'
import { pinecone, PINECONE_INDEX } from './pinecone'

export type EmbedMessage = {
  id: string
  text: string
}

/**
 * This function is used to generated embedding for messages and
 * stored them in database.
 */
export async function embedMessages(messages: EmbedMessage[]) {
  const index = pinecone.index(PINECONE_INDEX)

  for (const message of messages) {
    const embeddings = await generateEmbedding(message.text)
    await index.upsert([
      {
        id: message.id,
        values: embeddings,
        metadata: {
          id: message.id,
          text: encrypt(message.text),
        },
      },
    ])
  }
}

export async function generateEmbedding(input: string) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input,
    })

    return response.data[0].embedding
  } catch {
    throw new Error('Something went wrong while embedding input.')
  }
}
