import { Button } from '~/components/ui/button'

export default async function Home() {
  return (
    <div className="flex h-full items-center justify-center">
      <form action="/api/integrations/slack/start">
        <Button>Connect slack</Button>
      </form>
    </div>
  )
}
