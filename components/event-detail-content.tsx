import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation";
import type { RsvpStatus as PrismaRsvpStatus } from "@/app/generated/prisma/enums";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { createInviteLinkAction } from "@/lib/actions/events";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

function countByStatus(rsvps: { status: PrismaRsvpStatus }[]) {

      let goingCount = 0;
      let maybeCount = 0;
      let notGoingCount = 0;


      for (const rsvp of rsvps) {
            if (rsvp.status === "going") goingCount++;
            else if (rsvp.status === "maybe") maybeCount++;
            else if (rsvp.status === "not_going") notGoingCount++;
      }

      return { goingCount, maybeCount, notGoingCount };
}

export default async function EventDetailContent({ eventId, userId }: { eventId: string, userId: string | undefined }) {

      const row = await prisma.event.findFirst({
            where: { id: eventId, ownerUserId: userId },
            select: {
                  id: true,
                  title: true,
                  description: true,
                  location: true,
                  eventDate: true,
                  invites: { select: { token: true } },
                  rsvps: { select: { status: true } }
            }
      });

      if (!row) {
            notFound();
      }

      const counts = countByStatus(row.rsvps);

      const event = {
            id: row.id,
            title: row.title,
            description: row.description,
            location: row.location,
            eventDate: row.eventDate ? row.eventDate.toISOString() : null,
            inviteToken: row.invites?.token ?? null,
            ...counts,
      };

      const rsvpRows = await prisma.eventRsvp.findMany({
            where: { eventId},
            orderBy: { respondedAt: "desc" },
            select: { id: true, name: true, email: true, status: true, respondedAt: true },
      });

      const rsvps = rsvpRows.map((r) => ({
            id: r.id,
            name: r.name,
            email: r.email,
            status: r.status,
            respondedAt: r.respondedAt ? r.respondedAt.toISOString() : null,
      }));

      const createInviteActionForEvent = createInviteLinkAction.bind(null, event.id);

      const inviteUrl = event.inviteToken ? `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/invite/${event.inviteToken}` : null;

      return (
            <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-2">
                              <h1 className="text-2xl font-semibold tracking-tight">{event.title}</h1>
                              <p>
                                    {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "No date selected"}
                                    {event.location ? ` - ${event.location}` : ""}
                              </p>

                              {event.description && <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">{event.description}</p>}
                        </div>

                        <Button asChild variant="outline">
                              <Link href={"/dashboard"}>
                                    Back
                              </Link>
                        </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                        <Badge>Going {event.goingCount}</Badge>
                        <Badge variant="secondary">Maybe {event.maybeCount}</Badge>
                        <Badge variant="outline">
                              Not Going {event.notGoingCount}
                        </Badge>
                  </div>

                  <Card>
                        <CardHeader>Invite Link</CardHeader>
                        <CardContent>
                              <p>Share this link with your friends to invite them to the event</p>

                              {inviteUrl ? (
                                    <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 text-sm my-2">
                                          {inviteUrl}
                                    </div>
                              ) : (
                                    <p className="text-sm text-[var(--muted-foreground)]">No Invite Link Generated Yet</p>
                              )}
                              <form action={createInviteActionForEvent}>
                                    <Button type="submit">Generate Link</Button>
                              </form>
                        </CardContent>
                  </Card>

                  <Card>
                        <CardHeader>
                              <CardTitle>Attendees</CardTitle>
                        </CardHeader>
                        <CardContent>
                              {rsvps.length === 0 ? (
                                    <p className="text-sm text-[var(--muted-foreground)]">No RSVPs yet</p>
                              ) : (
                                    <Table>
                                          <TableHeader>
                                                <TableRow>
                                                      <TableHead>Name</TableHead>
                                                      <TableHead>Email</TableHead>
                                                      <TableHead>Status</TableHead>
                                                      <TableHead>Responded At</TableHead>
                                                </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                                {rsvps.map((rsvp) => (
                                                      <TableRow key={rsvp.id}>
                                                            <TableCell>{rsvp.name}</TableCell>
                                                            <TableCell>{rsvp.email}</TableCell>
                                                            <TableCell>
                                                                  <Badge variant="secondary">{rsvp.status === "not_going" ? "Not Going" : rsvp.status === "maybe" ? "Maybe" : "Going"}</Badge>
                                                            </TableCell>
                                                            <TableCell>{rsvp.respondedAt ? new Date(rsvp.respondedAt).toLocaleDateString() : ""}</TableCell>
                                                      </TableRow>
                                                ))}
                                          </TableBody>
                                    </Table>
                              )}
                        </CardContent>
                  </Card>
            </div>
      )
}