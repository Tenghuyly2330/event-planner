import { Button } from './ui/button'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { notFound } from 'next/navigation'
import { Field } from './ui/field'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { submitOrUpdateRsvpAction } from '@/lib/actions/events';

const InviteRsvpContent = async ({ token, submitted }: { token: string; submitted: boolean }) => {

  const row = await prisma.eventInvite.findFirst({
    where: {token},
    include:{
      event:{
        select:{
          id:true,
          title:true,
          description:true,
          location:true,
          eventDate:true,
        },
      },
    },
  });

  if(!row){
    notFound();
  }

  const e = row.event;
  const event = {
    title: e.title,
    description: e.description,
    location: e.location,
    eventDate: e.eventDate ? e.eventDate.toISOString() : null,
  }

  const submitRsvpForToken = submitOrUpdateRsvpAction.bind(null, token);

  return (
    <div className='mx-auto max-w-2xl w-full'>
      <Card>
        <CardHeader className='space-y-3'>
          <Badge variant="secondary">RSVP</Badge>
          <CardTitle className='text-3xl'>{event.title}</CardTitle>
          <p className='text-sm text-[var(--muted-foreground)]'>
            {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "No date selected"}
            {event.location ? `- ${event.location}` : ''}
          </p>
          {event.description ? (
            <p className='text-sm text-[var(--muted-foreground)]'>
              {event.description}
            </p>
          ) : null}
        </CardHeader>

        <CardContent>
          {submitted ? (
            <div className='mb-4 rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 text-sm'>
              Thank. Your RSVP has been recorded.
            </div>
          ) : null}
          <form action={submitRsvpForToken} className='space-y-3'>
            <Field>
              <Label htmlFor='name'>Name</Label>
              <Input type="text" name="name" id='name' required placeholder='Your name' />
            </Field>
            <Field>
              <Label htmlFor='email'>Email</Label>
              <Input type="email" name="email" id='email' required placeholder='you@example.com' />
            </Field>
            <Field>
              <Label htmlFor='status'>Attendance</Label>
              <select name="status" id="status" required defaultValue="going"
                className='flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3'>
                <option value="going">Going</option>
                <option value="maybe">Maybe</option>
                <option value="not_going">Not Going</option>
              </select>
            </Field>
            <Button type="submit">Submit RSVP</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default InviteRsvpContent