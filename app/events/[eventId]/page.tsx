import { getSession } from "@/lib/auth/server";
import EventDetailContent from "@/components/event-detail-content";


export default async function EventDetailPage({params}: {params: Promise<{eventId: string}>}) {
      const { eventId } = await params;
      const session = await getSession();
      const userId = session?.data?.user?.id;

      return (
            <EventDetailContent eventId={eventId} userId={userId} />
      )
}