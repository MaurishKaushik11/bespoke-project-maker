import { useState } from "react";
import { useEventStore } from "@/store/useEventStore";
import { ProfileSelector } from "@/components/ProfileSelector";
import { CreateEventForm } from "@/components/CreateEventForm";
import { EventsList } from "@/components/EventsList";
import { ProfilesTab } from "@/components/ProfilesTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { currentProfile, setCurrentProfile } = useEventStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold mb-2">Event Management</h1>
              <p className="text-muted-foreground">
                Create and manage events across multiple timezones
              </p>
            </div>
            <div className="w-64">
              <ProfileSelector
                value={currentProfile?.id || ""}
                onChange={(value) => setCurrentProfile(value as string)}
                placeholder="Select current profile..."
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">Create Event</TabsTrigger>
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-0">
            <div className="grid md:grid-cols-2 gap-6">
              <CreateEventForm />
              <EventsList />
            </div>
          </TabsContent>

          <TabsContent value="profiles">
            <div className="max-w-2xl">
              <ProfilesTab />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
