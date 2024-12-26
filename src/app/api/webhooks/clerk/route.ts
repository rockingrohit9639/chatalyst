import { WebhookEvent } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { env } from '~/lib/env'
import { prisma } from '~/lib/db'

export async function POST(request: Request) {
  const wh = new Webhook(env.CLERK_SIGNING_SECRET)
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  /* If there are no headers, error out */
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ success: false, message: 'Error: Missing Svix headers' }, { status: 400 })
  }

  const payload = await request.json()
  const body = JSON.stringify(payload)

  let event: WebhookEvent

  /* Verify the webhook */
  try {
    event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch {
    return NextResponse.json({ success: false, message: 'Error: Verification error' }, { status: 400 })
  }

  switch (event.type) {
    case 'user.created': {
      await prisma.user.create({
        data: {
          clerkId: event.data.id,
          email: event.data.email_addresses[0].email_address,
          firstName: event.data.first_name!,
          lastName: event.data.last_name!,
          imageUrl: event.data.image_url,
        },
      })
      return NextResponse.json({ success: true, message: 'User created successfully' })
    }

    case 'user.updated': {
      await prisma.user.update({
        where: { clerkId: event.data.id },
        data: {
          firstName: event.data.first_name!,
          lastName: event.data.last_name!,
          imageUrl: event.data.image_url,
        },
      })
      return NextResponse.json({ success: true, message: 'User updated successfully' })
    }

    case 'user.deleted': {
      await prisma.user.delete({
        where: { clerkId: event.data.id },
      })
      return NextResponse.json({ success: true, message: 'User deleted successfully' })
    }

    default: {
      return NextResponse.json({ success: true, message: 'Unhandled event' })
    }
  }
}
