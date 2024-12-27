import { auth } from '@clerk/nextjs/server'
import { IntegrationType } from '@prisma/client'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import { prisma } from '~/lib/db'
import { env } from '~/lib/env'
import { SLACK_SCOPES, slackInstaller } from '~/lib/integrations/slack'

export async function GET() {
  let slackInstallUrl: string
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const userSlackIntegration = await prisma.userIntegration.count({
      where: { user: { clerkId: userId }, integration: { type: IntegrationType.SLACK } },
    })
    if (userSlackIntegration > 0) {
      return NextResponse.json({ success: false, message: 'Slack integrated is already completed.' }, { status: 400 })
    }

    slackInstallUrl = await slackInstaller.generateInstallUrl({
      scopes: SLACK_SCOPES,
      redirectUri: env.NEXT_PUBLIC_SLACK_REDIRECT_URI,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 })
  }

  // redirect internally throws an error so it should be called outside of try/catch blocks.
  redirect(slackInstallUrl)
}
