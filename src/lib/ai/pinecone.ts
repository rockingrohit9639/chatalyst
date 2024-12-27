import { Pinecone } from '@pinecone-database/pinecone'
import { env } from '../env'

export const PINECONE_INDEX = 'chatalyst'

export const pinecone = new Pinecone({
  apiKey: env.PINECONE_API_KEY,
})
