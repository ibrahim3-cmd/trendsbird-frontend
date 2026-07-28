import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  values: string[];
  setValues: (vals: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  showValuesInTrigger?: boolean;
  badgeClassName?: string;
  // Auto-adjust height based on content
  autoHeight?: boolean;
  // Max lines to show before scrolling
  maxLines?: number;
  // Disabled state
  disabled?: boolean;
}

export function MultiSelect({ 
  values, 
  setValues, 
  options, 
  placeholder = "Select...", 
  showValuesInTrigger = true, 
  badgeClassName,
  autoHeight = true,
  maxLines = 3,
  disabled = false
}: MultiSelectProps) {
  
  const removeValue = (valueToRemove: string, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setValues(values.filter(v => v !== valueToRemove));
  };

  // Calculate approximate height based on number of selected items
  const getContainerHeight = () => {
    if (!autoHeight) return 'auto';
    
    const baseHeight = 44; // min-h-[44px]
    const badgeHeight = 24; // approximate badge height
    const lineHeight = badgeHeight + 4; // badge height + gap
    
    // Calculate how many lines we need
    const badgesPerLine = 3; // approximate badges per line
    const linesNeeded = Math.ceil(values.length / badgesPerLine);
    const actualLines = Math.min(linesNeeded, maxLines);
    
    return `${baseHeight + (actualLines - 1) * lineHeight}px`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start items-start py-2 hover:bg-background relative"
          disabled={disabled}
          style={{ 
            height: autoHeight ? getContainerHeight() : 'auto',
            minHeight: '44px'
          }}
        >
          <div 
            className={cn(
              "flex gap-1 flex-wrap flex-1 overflow-auto items-center",
              autoHeight && "absolute inset-2"
            )}
          >
            {(!showValuesInTrigger || values.length === 0) && (
              <span className="text-muted-foreground py-1">{placeholder}</span>
            )}
            
            {showValuesInTrigger && values.map((v) => {
              const label = options.find((o) => o.value === v)?.label || v;
              return (
                <Badge 
                  key={v} 
                  variant="secondary"
                  className={cn(
                    "px-2 py-1 text-xs flex items-center gap-1 group flex-shrink-0",
                    badgeClassName
                  )}
                >
                  <span className="max-w-[120px] truncate">{label}</span>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => removeValue(v, e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        removeValue(v, e);
                      }
                    }}
                    className="opacity-60 group-hover:opacity-100 transition-opacity hover:bg-muted rounded-sm flex-shrink-0 cursor-pointer p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </div>
                </Badge>
              );
            })}
          </div>
          
          {/* Plus icon positioned absolutely to avoid affecting layout */}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-64" align="start">
        <Command>
          <CommandList>
            <div className="max-h-72 overflow-auto">
              <CommandGroup>
                {options.map((opt) => {
                  const selected = values.includes(opt.value);

                  return (
                    <CommandItem
                      key={opt.value}
                      onSelect={() => {
                        setValues(
                          selected 
                            ? values.filter((v) => v !== opt.value) 
                            : [...values, opt.value]
                        );
                      }}
                      className="flex items-center"
                    >
                      <Check className={cn("mr-2 h-4 w-4 flex-shrink-0", selected ? "opacity-100" : "opacity-0")} />
                      <span className="flex-1 truncate">{opt.label}</span>
                    </CommandItem>
                  );
                })}
                
                {options.length === 0 && (
                  <CommandItem disabled>
                    No options available
                  </CommandItem>
                )}
              </CommandGroup>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default MultiSelect;