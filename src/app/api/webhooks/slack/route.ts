import { headers } from 'next/headers'
import * as crypto from 'crypto'
import { env } from '~/lib/env'

export async function POST(request: Request) {
  const rawBody = await request.clone().text()

  const headersPayload = await headers()
  const timestamp = Number(headersPayload.get('x-slack-request-timestamp'))
  const time = Math.floor(new Date().getTime() / 1000)
  if (Math.abs(time - timestamp) > 300) {
    //The request timestamp is more than five minutes from local time.
    // It could be a replay attack, so let's ignore it.
    return new Response('Invalid timestamp', { status: 400 })
  }

  const sigBaseString = `v0:${timestamp}:${rawBody}`

  const mySignature =
    'v0=' + crypto.createHmac('sha256', env.SLACK_SIGNING_SECRET).update(sigBaseString, 'utf8').digest('hex')

  const slackSignature = String(headersPayload.get('x-slack-signature'))

  const isSignatureMatching = crypto.timingSafeEqual(
    Buffer.from(mySignature, 'utf8'),
    Buffer.from(slackSignature, 'utf8'),
  )
  if (!isSignatureMatching) {
    return new Response('Invalid signature', { status: 400 })
  }

  const payload = await request.json()
  console.log(payload)

  return new Response(payload.challenge, { status: 200 })
}
