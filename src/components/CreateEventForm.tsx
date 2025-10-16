import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ProfileSelector } from "./ProfileSelector";
import { TimezoneSelector } from "./TimezoneSelector";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, Plus } from "lucide-react";
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

  const { addEvent } = useEventStore();

  const handleCreateEvent = () => {
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

    // Store as UTC ISO strings
    addEvent({
      profileIds: selectedProfiles,
      timezone: selectedTimezone,
      startDate: startDateTime.utc().toISOString(),
      endDate: endDateTime.utc().toISOString(),
    });

    // Reset form
    setSelectedProfiles([]);
    setStartDate(undefined);
    setEndDate(undefined);
    setStartTime("09:00");
    setEndTime("10:00");
    
    toast.success("Event created successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Event</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? dayjs(startDate).format("MMM DD, YYYY") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="pl-10 w-32"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>End Date & Time</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? dayjs(endDate).format("MMM DD, YYYY") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="pl-10 w-32"
              />
            </div>
          </div>
        </div>

        <Button onClick={handleCreateEvent} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </CardContent>
    </Card>
  );
}
