import { Button } from '~/components/ui/button'
import { env } from '~/lib/env'

export default function Home() {
  return (
    <div>
      <Button>Home</Button>
      <a
        href={`https://slack.com/oauth/v2/authorize?client_id=${env.NEXT_PUBLIC_SLACK_CLIENT_ID}&scope=channels:history,groups:history,im:history,mpim:history&redirect_uri=${env.NEXT_PUBLIC_SLACK_REDIRECT_URI}`}
      >
        Connect to Slack
      </a>
    </div>
  )
}
