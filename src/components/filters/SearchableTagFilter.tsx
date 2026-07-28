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

interface SearchableTagFilterProps {
  selectedTag: string;
  onTagChange: (value: string) => void;
  tags: string[];
  placeholder?: string;
}

export const SearchableTagFilter: React.FC<SearchableTagFilterProps> = ({
  selectedTag,
  onTagChange,
  tags,
  placeholder = "All Tags",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedTagName = selectedTag === "all"
    ? placeholder
    : selectedTag;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-40 justify-start text-left font-normal h-9"
        >
          <span className="truncate">
            {selectedTagName}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search tags..." />
          <CommandList>
            <CommandEmpty>No tags found</CommandEmpty>
            <CommandItem
              value="all"
              onSelect={() => {
                onTagChange("all");
                setIsOpen(false);
              }}
            >
              {placeholder}
            </CommandItem>
            {Array.isArray(tags) && tags.map((tag) => (
              <CommandItem
                key={tag}
                value={tag}
                onSelect={() => {
                  onTagChange(tag);
                  setIsOpen(false);
                }}
              >
                {tag}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};