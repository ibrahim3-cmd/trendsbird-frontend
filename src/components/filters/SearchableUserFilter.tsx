import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";

interface User {
  _id: string;
  name?: string;
}

interface SearchableUserFilterProps {
  selectedUser: string;
  onUserChange: (value: string) => void;
  users: User[];
  placeholder?: string;
}

export const SearchableUserFilter: React.FC<SearchableUserFilterProps> = ({
  selectedUser,
  onUserChange,
  users,
  placeholder = "All Users",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedUserName = selectedUser === "all" 
    ? placeholder 
    : users.find(user => user._id === selectedUser)?.name || selectedUser;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-40 justify-start text-left font-normal h-9"
        >
          <span className="truncate">
            {selectedUserName}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            <CommandEmpty>No users found</CommandEmpty>
            <CommandItem
              value="all"
              onSelect={() => {
                onUserChange("all");
                setIsOpen(false);
              }}
            >
              {placeholder}
            </CommandItem>
            {Array.isArray(users) && users.map((user) => (
              <CommandItem
                key={user._id}
                value={user.name || user._id}
                onSelect={() => {
                  onUserChange(user._id);
                  setIsOpen(false);
                }}
              >
                {user.name || "N/A"}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};