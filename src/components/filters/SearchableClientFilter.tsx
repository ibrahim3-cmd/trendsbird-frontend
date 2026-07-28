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

interface Client {
  _id: string;
  name?: string;
}

interface SearchableClientFilterProps {
  selectedClient: string;
  onClientChange: (value: string) => void;
  clients: Client[];
  placeholder?: string;
}

export const SearchableClientFilter: React.FC<SearchableClientFilterProps> = ({
  selectedClient,
  onClientChange,
  clients,
  placeholder = "All Clients",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedClientName = selectedClient === "all" 
    ? placeholder 
    : clients.find(client => client._id === selectedClient)?.name || selectedClient;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-48 justify-start text-left font-normal h-9"
        >
          <span className="truncate">
            {selectedClientName}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search clients..." />
          <CommandList>
            <CommandEmpty>No clients found</CommandEmpty>
            <CommandItem
              value="all"
              onSelect={() => {
                onClientChange("all");
                setIsOpen(false);
              }}
            >
              {placeholder}
            </CommandItem>
            {Array.isArray(clients) && clients.map((client) => (
              <CommandItem
                key={client._id}
                value={client.name || client._id}
                onSelect={() => {
                  onClientChange(client._id);
                  setIsOpen(false);
                }}
              >
                {client.name || "N/A"}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};