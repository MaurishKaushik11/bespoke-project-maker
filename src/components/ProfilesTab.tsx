import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEventStore } from "@/store/useEventStore";
import { Plus, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ProfilesTab() {
  const [newProfileName, setNewProfileName] = useState("");
  const { profiles, addProfile, fetchProfiles, loading, error, clearError } = useEventStore();

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleAddProfile = async () => {
    if (newProfileName.trim()) {
      try {
        await addProfile(newProfileName.trim());
        setNewProfileName("");
        toast.success("Profile added successfully");
      } catch (error) {
        toast.error("Failed to add profile");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Profiles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter profile name..."
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddProfile();
              }
            }}
            disabled={loading}
          />
          <Button onClick={handleAddProfile} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {profiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {loading ? "Loading profiles..." : "No profiles yet. Add your first profile above."}
            </div>
          ) : (
            profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">{profile.name}</div>
                  <div className="text-sm text-muted-foreground">{profile.timezone}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
