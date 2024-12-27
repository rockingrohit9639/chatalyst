import { InstallProvider } from '@slack/oauth'
import { env } from '../env'
import { WebClient } from '@slack/web-api'

/** Used for initiating OAuth2 */
export const slackInstaller = new InstallProvider({
  clientId: env.NEXT_PUBLIC_SLACK_CLIENT_ID,
  clientSecret: env.SLACK_CLIENT_SECRET,
  stateSecret: env.SLACK_STATE_SECRET,
})

export const SLACK_SCOPES = ['channels:history', 'groups:history', 'im:history', 'mpim:history']

/**
 * Used for interacting with slack.
 * We also use this to exchange `code` with accessToken.
 */
export const slackClient = new WebClient()
