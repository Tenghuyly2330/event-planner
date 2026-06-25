import { Button } from './ui/button'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import type { RsvpStatus as PrismaRsvpStatus } from '@/app/generated/prisma/enums';

function countByStatus(rsvps: { status: PrismaRsvpStatus }[]) {

  let goingCount = 0;
  let maybeCount = 0;
  let notGoingCount = 0;


  for (const rsvp of rsvps) {
    if(rsvp.status === "going") goingCount++;
    else if(rsvp.status === "maybe") maybeCount++;
    else if(rsvp.status === "not_going") notGoingCount++;
  }

  return {goingCount, maybeCount, notGoingCount};
}

const DashboardContent = async ({ userId }: { userId: string | undefined }) => {

  const rows = await prisma.event.findMany({
    where: {
      ownerUserId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      eventDate: true,
      location: true,
      rsvps: { select: {status: true} }
    },
  });


  const events = rows.map((e) => ({
    id: e.id,
    title: e.title,
    eventDate: e.eventDate ? e.eventDate.toISOString() : "",
    location: e.location,
    ...countByStatus(e.rsvps),
  }));


  return (
    <div className='flex flex-1 flex-col gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Your Events</h1>
          {" "}
          <p className='text-sm text-gray-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores repellendus est eum sapiente molestiae omnis dolorum, architecto culpa ex nostrum!</p>
        </div>

        <Button asChild>
          <Link href="/events/new">Create Event</Link>
        </Button>
      </div>

      {/* list of events */}
      {events.length === 0 ? (<Card>
        <CardHeader>
          <CardTitle>No events found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-[var(--muted-foreground)]'>Create your first event to get started</p>
        </CardContent>
      </Card>) : (
        <div className='grid gap-4 md:grid-cols-2'>
          {events.map((event) => (
            <Card key={event.id} className='space-y-3'>
              <CardHeader>
                <div className='flex items-start justify-between gap-2'>
                  <CardTitle className='text-lg'>{event.title}</CardTitle>
                  <Button size="sm" asChild>
                    <Link href={`/events/${event.id}`}>Open</Link>
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2 text-xs'>
                  <Badge>Going {event.goingCount}</Badge>
                  <Badge variant="secondary">Maybe {event.maybeCount}</Badge>
                  <Badge variant="outline">
                    {" "}
                    Not Going {event.notGoingCount}
                  </Badge>
                </div>
                <p>
                  {event.eventDate
                    ? new Date(event.eventDate).toLocaleDateString()
                    : "No date selected"}
                  {event.location ? ` - ${event.location}` : ""}
                </p>
              </CardHeader>
            </Card>
          ))}</div>
      )}
    </div>
  )
}

export default DashboardContent