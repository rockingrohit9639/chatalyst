import * as crypto from 'crypto'
import { env } from './env'

const ALGORITHM = 'aes-256-ccm'

export function encrypt(text: string) {
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(env.ENCRYPTION_KEY, 'hex'),
    Buffer.from(env.ENCRYPTION_IV, 'hex'),
    {
      authTagLength: 16, // Authentication tag length is usually 16 bytes
    },
  )

  // Encrypt data
  let encrypted = cipher.update(text, 'utf8')
  encrypted = Buffer.concat([encrypted, cipher.final()])

  // Get the authentication tag
  const authTag = cipher.getAuthTag()

  // Return the encrypted data, IV, and authTag
  return `${encrypted.toString('hex')}:${authTag.toString('hex')}`
}

export function decrypt(encryptedText: string) {
  const [text, authTag] = encryptedText.split(':')

  const decipher = crypto.createDecipheriv(
    'aes-256-ccm',
    Buffer.from(env.ENCRYPTION_KEY, 'hex'),
    Buffer.from(env.ENCRYPTION_IV, 'hex'),
    {
      authTagLength: 16, // The length of the authentication tag
    },
  )

  decipher.setAuthTag(Buffer.from(authTag, 'hex')) // Set the authentication tag

  let decrypted = decipher.update(Buffer.from(text, 'hex'))
  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString('utf8')
}
