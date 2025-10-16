import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEventStore } from "@/store/useEventStore";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ProfileSelectorProps {
  multiple?: boolean;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
}

export function ProfileSelector({ multiple = false, value, onChange, placeholder = "Select profiles..." }: ProfileSelectorProps) {
  const [open, setOpen] = useState(false);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const { profiles, addProfile } = useEventStore();

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const handleSelect = (profileId: string) => {
    if (multiple) {
      const newValue = selectedValues.includes(profileId)
        ? selectedValues.filter((id) => id !== profileId)
        : [...selectedValues, profileId];
      onChange(newValue);
    } else {
      onChange(profileId);
      setOpen(false);
    }
  };

  const handleAddProfile = () => {
    if (newProfileName.trim()) {
      addProfile(newProfileName.trim());
      setNewProfileName("");
      setShowAddProfile(false);
      toast.success("Profile added successfully");
    }
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      return profiles.find((p) => p.id === selectedValues[0])?.name || placeholder;
    }
    return `${selectedValues.length} profiles selected`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            selectedValues.length > 0 && multiple && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          )}
        >
          {getDisplayText()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search profiles..." />
          <CommandList>
            <CommandEmpty>
              <div className="p-2">
                <p className="text-sm text-muted-foreground mb-2">No profiles found</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowAddProfile(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Profile
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {profiles.map((profile) => (
                <CommandItem
                  key={profile.id}
                  value={profile.name}
                  onSelect={() => handleSelect(profile.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(profile.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {profile.name}
                </CommandItem>
              ))}
              {profiles.length > 0 && (
                <CommandItem onSelect={() => setShowAddProfile(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Profile
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
        {showAddProfile && (
          <div className="border-t p-3 space-y-2">
            <Input
              placeholder="Profile name"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddProfile();
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddProfile}
                className="flex-1"
              >
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowAddProfile(false);
                  setNewProfileName("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
