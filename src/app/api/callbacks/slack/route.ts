import { auth } from '@clerk/nextjs/server'
import { IntegrationType } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '~/lib/db'
import { env } from '~/lib/env'
import { slackClient } from '~/lib/integrations/slack'

const bodyValidationSchema = z.object({
  code: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await bodyValidationSchema.safeParseAsync(body)
    if (!response.success) {
      return NextResponse.json({ success: false, message: 'Invalid request payload.' }, { status: 400 })
    }

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const userSlackIntegrations = await prisma.userIntegration.count({
      where: {
        user: { clerkId: userId },
        integration: { type: IntegrationType.SLACK },
      },
    })
    if (userSlackIntegrations > 0) {
      return NextResponse.json({ success: false, message: 'Slack is already integrated.' }, { status: 400 })
    }

    const oauthResponse = await slackClient.oauth.v2.access({
      client_id: env.NEXT_PUBLIC_SLACK_CLIENT_ID,
      client_secret: env.SLACK_CLIENT_SECRET,
      code: response.data.code,
      redirect_uri: env.NEXT_PUBLIC_SLACK_REDIRECT_URI,
    })

    await prisma.userIntegration.create({
      data: {
        user: { connect: { clerkId: userId } },
        accessToken: oauthResponse.access_token!,
        integration: { connect: { type: IntegrationType.SLACK } },
        metadata: {
          app_id: oauthResponse.app_id,
          team_id: oauthResponse.team?.id,
        },
      },
    })

    return NextResponse.json({ success: true, message: 'Slack connected successfully.' }, { status: 200 })
  } catch {
    return NextResponse.json({ success: false, message: 'Something went wrong.' }, { status: 500 })
  }
}
