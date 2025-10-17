import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ProfileSelector } from "./ProfileSelector";
import { TimezoneSelector } from "./TimezoneSelector";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEventStore } from "@/store/useEventStore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

dayjs.extend(utc);
dayjs.extend(timezone);

export function CreateEventForm() {
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState("America/New_York");
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState<Date>();
  const [endTime, setEndTime] = useState("10:00");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { addEvent, currentProfile, loading, error, clearError, fetchProfiles, profiles } = useEventStore();

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleCreateEvent = async () => {
    if (!selectedProfiles.length) {
      toast.error("Please select at least one profile");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    // Create datetime strings in the selected timezone
    const startDateTime = dayjs.tz(
      `${dayjs(startDate).format("YYYY-MM-DD")} ${startTime}`,
      selectedTimezone
    );
    const endDateTime = dayjs.tz(
      `${dayjs(endDate).format("YYYY-MM-DD")} ${endTime}`,
      selectedTimezone
    );

    // Validate end is after start
    if (endDateTime.isBefore(startDateTime)) {
      toast.error("End date/time must be after start date/time");
      return;
    }

    try {
      // Store as UTC ISO strings
      await addEvent({
        profileIds: selectedProfiles,
        timezone: selectedTimezone,
        startDate: startDateTime.utc().toISOString(),
        endDate: endDateTime.utc().toISOString(),
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        createdBy: currentProfile?.id,
      });

      // Reset form
      setSelectedProfiles([]);
      setStartDate(undefined);
      setEndDate(undefined);
      setStartTime("09:00");
      setEndTime("10:00");
      setTitle("");
      setDescription("");

      toast.success("Event created successfully");
    } catch (error) {
      toast.error("Failed to create event");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Event</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Title (Optional)</Label>
          <Input
            placeholder="Event title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label>Description (Optional)</Label>
          <Input
            placeholder="Event description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label>Profiles</Label>
          <ProfileSelector
            multiple
            value={selectedProfiles}
            onChange={(value) => setSelectedProfiles(value as string[])}
          />
        </div>

        <div className="space-y-2">
          <Label>Timezone</Label>
          <TimezoneSelector value={selectedTimezone} onChange={setSelectedTimezone} />
        </div>

        <div className="space-y-2">
          <Label>Start Date & Time</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? dayjs(startDate).format("PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-32"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>End Date & Time</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? dayjs(endDate).format("PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-32"
              disabled={loading}
            />
          </div>
        </div>

        <Button onClick={handleCreateEvent} className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Create Event
        </Button>
      </CardContent>
    </Card>
  );
}
