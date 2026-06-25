import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createEventAction } from "@/lib/actions/events";

import {
      Field,
      FieldDescription,
      FieldError,
      FieldGroup,
      FieldLabel,
} from "@/components/ui/field"

const NewEventPage = async () => {

      // const 

      return (
            <div className='mx-auto w-full max-w-7xl'>
                  <Card>
                        <CardHeader>
                              <CardTitle>Create New Event</CardTitle>
                        </CardHeader>
                        <CardContent>
                              <form action={createEventAction} className="space-y-4">
                                    <Field>
                                          <FieldLabel htmlFor="title">
                                                Title
                                          </FieldLabel>
                                          <Input
                                                id="title"
                                                name="title"
                                                placeholder="Team dinner..."
                                          />
                                    </Field>

                                    <Field>
                                          <FieldLabel htmlFor="description">
                                                Description
                                          </FieldLabel>
                                          <Input
                                                id="description"
                                                name="description"
                                                placeholder="lorem ipsum dolor sit..."
                                          />
                                    </Field>

                                    <Field>
                                          <FieldLabel htmlFor="location">
                                                Location
                                          </FieldLabel>
                                          <Input
                                                id="location"
                                                name="location"
                                                placeholder="lorem ipsum dolor sit..."
                                          />
                                    </Field>

                                    <Field>
                                          <FieldLabel htmlFor="eventDate">
                                                Date and time
                                          </FieldLabel>
                                          <Input
                                                id="eventDate"
                                                name="eventDate"
                                                type="datetime-local"
                                          />
                                    </Field>

                                    <div className="flex items-center gap-3">
                                          <Button type="submit">Create Event</Button>
                                          <Button type="button" variant="outline" asChild>
                                                <Link href="/dashboard">Cancel</Link>
                                          </Button>
                                    </div>
                              </form>
                        </CardContent>
                  </Card>
            </div>
      )
}

export default NewEventPage