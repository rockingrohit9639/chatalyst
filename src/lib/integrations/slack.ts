import { InstallProvider } from '@slack/oauth'
import { env } from '../env'
import { WebClient } from '@slack/web-api'
import { UserIntegration } from '@prisma/client'
import { EmbedMessage, embedMessages } from '../ai/embed'

/** Used for initiating OAuth2 */
export const slackInstaller = new InstallProvider({
  clientId: env.NEXT_PUBLIC_SLACK_CLIENT_ID,
  clientSecret: env.SLACK_CLIENT_SECRET,
  stateSecret: env.SLACK_STATE_SECRET,
})

export const SLACK_SCOPES = [
  'channels:history',
  'channels:read',
  'groups:history',
  'groups:read',
  'im:history',
  'mpim:history',
]

/**
 * Used for interacting with slack.
 * We also use this to exchange `code` with accessToken.
 */
export const slackClient = new WebClient()

/**
 * This function sync slack messages.
 * Fetch messages from slack, create embeddings and save in database.
 */
export async function syncSlackIntegration(userIntegration: UserIntegration) {
  const userSlackClient = new WebClient(userIntegration.accessToken)

  /** Get all the conversations  */
  const conversations = await userSlackClient.conversations.list()
  const channels = conversations.channels
  if (!channels) {
    throw new Error('Something went wrong while fetching channels.')
  }

  const joinedChannels = channels.filter((channel) => channel.is_member)
  if (!joinedChannels.length) {
    throw new Error('You have not added Chatalyst to any channels yet.')
  }

  const allMessages: EmbedMessage[] = []

  for (const channel of joinedChannels) {
    const history = await userSlackClient.conversations.history({
      channel: channel.id!,
    })
    const messages = history.messages
    if (!messages?.length) {
      continue
    }

    const textMessages = messages
      .filter((message) => {
        if (!message.text || !message.client_msg_id) {
          return false
        }
        return true
      })
      .map((msg) => ({ id: msg.client_msg_id!, text: msg.text! }))

    allMessages.push(...textMessages)
  }

  await embedMessages(allMessages)
}
