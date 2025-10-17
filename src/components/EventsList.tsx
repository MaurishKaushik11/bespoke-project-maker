import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TimezoneSelector } from "./TimezoneSelector";
import { useEventStore } from "@/store/useEventStore";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Calendar, Clock, Loader2 } from "lucide-react";

dayjs.extend(utc);
dayjs.extend(timezone);

export function EventsList() {
  const [viewTimezone, setViewTimezone] = useState("America/New_York");
  const { events, currentProfile, profiles, loading, error, clearError, fetchEventsForProfile } = useEventStore();

  useEffect(() => {
    if (currentProfile) {
      fetchEventsForProfile(currentProfile.id);
    }
  }, [currentProfile, fetchEventsForProfile]);

  useEffect(() => {
    if (error) {
      console.error(error);
      clearError();
    }
  }, [error, clearError]);

  const displayEvents = currentProfile
    ? events.filter((e) => e.profileIds.includes(currentProfile.id))
    : [];

  const formatEventTime = (isoString: string) => {
    return dayjs(isoString).tz(viewTimezone).format("MMM DD, YYYY [at] hh:mm A");
  };

  const getProfileNames = (profileIds: string[]) => {
    return profileIds
      .map((id) => profiles.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  if (loading && events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>View in Timezone</Label>
          <TimezoneSelector value={viewTimezone} onChange={setViewTimezone} />
        </div>

        <div className="space-y-3 pt-2">
          {displayEvents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {currentProfile ? "No events found for this profile" : "Select a profile to view events"}
            </div>
          ) : (
            displayEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 border rounded-lg space-y-2 hover:bg-accent/50 transition-colors"
              >
                {event.title && (
                  <div className="font-semibold text-lg">{event.title}</div>
                )}
                {event.description && (
                  <div className="text-muted-foreground">{event.description}</div>
                )}
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{getProfileNames(event.profileIds)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <div className="font-medium">{formatEventTime(event.startDate)}</div>
                        <div className="text-muted-foreground">to {formatEventTime(event.endDate)}</div>
                      </div>
                    </div>
                    {event.updateLogs && event.updateLogs.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Updated {event.updateLogs.length} time{event.updateLogs.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
