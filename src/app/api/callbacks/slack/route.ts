import { auth } from '@clerk/nextjs/server'
import { IntegrationType } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '~/lib/db'
import { env } from '~/lib/env'

const bodyValidationSchema = z.object({
  code: z.string().min(1),
})

const slackResponseSchema = z.object({
  app_id: z.string(),
  access_token: z.string(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await bodyValidationSchema.safeParseAsync(body)
    if (!response.success) {
      return NextResponse.json({ success: false, message: 'Invalid request payload.' }, { status: 400 })
    }

    /** @TODO Can we use Slack SDK? */
    const slackResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.NEXT_PUBLIC_SLACK_CLIENT_ID,
        client_secret: env.SLACK_CLIENT_SECRET,
        redirect_uri: env.NEXT_PUBLIC_SLACK_REDIRECT_URI,
        code: response.data.code,
      }),
    }).then((res) => res.json())

    const slackValidationResponse = await slackResponseSchema.safeParseAsync(slackResponse)
    if (!slackValidationResponse.success) {
      return NextResponse.json({ success: false, message: 'Reveived invalid data from slack.' }, { status: 500 })
    }

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const slackIntegration = await prisma.integration.findFirstOrThrow({ where: { type: IntegrationType.SLACK } })
    await prisma.userIntegration.create({
      data: {
        userId,
        accessToken: slackValidationResponse.data.access_token,
        integrationId: slackIntegration.id,
      },
    })

    return NextResponse.json({ success: true, message: 'Slack connected successfully.' }, { status: 200 })
  } catch {
    return NextResponse.json({ success: false, message: 'Something went wrong.' }, { status: 500 })
  }
}
