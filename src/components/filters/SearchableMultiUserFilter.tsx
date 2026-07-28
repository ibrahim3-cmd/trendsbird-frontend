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
  CommandGroup,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface User {
  _id: string;
  name?: string;
  role?: string;
}

interface SearchableMultiUserFilterProps {
  selectedUsers: string[];
  onUsersChange: (values: string[]) => void;
  users: User[];
  placeholder?: string;
  className?: string;
}

export const SearchableMultiUserFilter: React.FC<SearchableMultiUserFilterProps> = ({
  selectedUsers,
  onUsersChange,
  users,
  placeholder = "Select users...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedUserObjects = users.filter((user: User) => selectedUsers.includes(user._id));
  
  const handleUserToggle = (userId: string, checked: boolean) => {
    if (checked) {
      onUsersChange([...selectedUsers, userId]);
    } else {
      onUsersChange(selectedUsers.filter((id: string) => id !== userId));
    }
  };

  const removeUser = (userId: string) => {
    onUsersChange(selectedUsers.filter((id: string) => id !== userId));
  };

  const clearAll = () => {
    onUsersChange([]);
  };

  const isUserSelected = (userId: string) => selectedUsers.includes(userId);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal h-auto min-h-9 ${className}`}
        >
          <div className="flex flex-wrap items-center gap-1 w-full">
            {selectedUsers.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {selectedUsers.length <= 2 ? (
                  selectedUserObjects.map((user: User) => (
                    <Badge
                      key={user._id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {user?.name || 'Unknown'} ({user?.role || 'N/A'})
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          removeUser(user._id);
                        }}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5 cursor-pointer inline-flex items-center justify-center"
                      >
                        <X className="w-2 h-2" />
                      </span>
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    {selectedUsers.length} users selected
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAll();
                      }}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5 cursor-pointer inline-flex items-center justify-center"
                    >
                      <X className="w-2 h-2" />
                    </span>
                  </Badge>
                )}
              </>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align="start"
        style={{ maxHeight: '400px', overflowY: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin' }}
        onWheel={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            <CommandEmpty>No users found</CommandEmpty>
            
            {selectedUsers.length > 0 && (
              <CommandGroup heading="Selected">
                {selectedUserObjects.map((user: User) => (
                  <CommandItem
                    key={user._id}
                    className="flex items-center space-x-2 cursor-pointer"
                    onSelect={() => {
                      handleUserToggle(user._id, false);
                    }}
                  >
                    <Checkbox
                      checked={isUserSelected(user._id)}
                      onCheckedChange={(checked) =>
                        handleUserToggle(user._id, checked as boolean)
                      }
                    />
                    <span className="flex-1">
                      {user?.name || 'Unknown'} ({user?.role || 'N/A'})
                    </span>
                  </CommandItem>
                ))}
                <CommandItem
                  className="text-red-600 cursor-pointer"
                  onSelect={clearAll}
                >
                  Clear all selections
                </CommandItem>
              </CommandGroup>
            )}
            
            <CommandGroup heading="Available Users">
              {users
                .filter((user: User) => !selectedUsers.includes(user._id))
                .map((user: User) => (
                  <CommandItem
                    key={user._id}
                    className="flex items-center space-x-2 cursor-pointer"
                    onSelect={() => {
                      handleUserToggle(user._id, true);
                    }}
                  >
                    <Checkbox
                      checked={isUserSelected(user._id)}
                      onCheckedChange={(checked) =>
                        handleUserToggle(user._id, checked as boolean)
                      }
                    />
                    <span className="flex-1">
                      {user?.name || 'Unknown'} ({user?.role || 'N/A'})
                    </span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchableMultiUserFilter;