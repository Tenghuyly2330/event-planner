import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-8">
      <section className="space-y-6">
        <Badge variant="secondary" className="w-full">NEON auth + Prisma + Next.js</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, deserunt?
        </h1>
        <div className="">
          <Button variant="ghost" asChild>
            <Link href="/auth/sign-up">Create Account</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Open Dashboard</Link>
          </Button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Create Event</CardTitle>
            <CardDescription>Set title, date and details in seconds.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shared the invited link</CardTitle>
            <CardDescription>Generate a unique link for each event and share it with your friends to get their RSVPs.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Track Attendance</CardTitle>
            <CardDescription>See who's coming and who's not.</CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
