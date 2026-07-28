import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, subYears, isEqual } from "date-fns";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

const presetRanges = [
  { label: "Today", getRange: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
  { label: "Yesterday", getRange: () => ({ from: startOfDay(subDays(new Date(), 1)), to: endOfDay(subDays(new Date(), 1)) }) },
  { label: "This Week", getRange: () => ({ from: startOfWeek(new Date()), to: endOfWeek(new Date()) }) },
  { label: "This Month", getRange: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: "Last Month", getRange: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: "Last 3 Months", getRange: () => ({ from: startOfMonth(subMonths(new Date(), 2)), to: endOfMonth(new Date()) }) },
  { label: "Last 6 Months", getRange: () => ({ from: startOfMonth(subMonths(new Date(), 5)), to: endOfMonth(new Date()) }) },
  { label: "This Year", getRange: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }) },
  { label: "Last Year", getRange: () => ({ from: startOfYear(subYears(new Date(), 1)), to: endOfYear(subYears(new Date(), 1)) }) },
];

export function DateRangePicker({ value, onChange, placeholder = "Pick a date range", className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Check if current value matches any preset range
  useEffect(() => {
    if (!value?.from || !value?.to) {
      setActivePreset(null);
      return;
    }

    // Check against each preset
    for (const preset of presetRanges) {
      const presetRange = preset.getRange();
      
      // Compare dates by checking if they're equal
      const fromMatches = isEqual(value.from, presetRange.from);
      const toMatches = isEqual(value.to, presetRange.to);
      
      if (fromMatches && toMatches) {
        setActivePreset(preset.label);
        return;
      }
    }
    
    // If no preset matches
    setActivePreset(null);
  }, [value]);

  const handlePresetSelect = (preset: { label: string; getRange: () => DateRange }) => {
    const range = preset.getRange();
    onChange?.(range);
    setActivePreset(preset.label);
    setIsOpen(false);
  };

  const handleCalendarSelect = (range: DateRange | undefined) => {
    onChange?.(range);
    // Don't set activePreset here - let the useEffect handle it
  };

  const getDateRangeDisplay = () => {
    if (value?.from && value?.to) {
      // For preset ranges: "Last 3 Months (Oct 2025 - Dec 2025)"
      if (activePreset) {
        const fromFormatted = format(value.from, 'MMM yyyy');
        const toFormatted = format(value.to, 'MMM yyyy');
        return `${activePreset} (${fromFormatted} - ${toFormatted})`;
      }
      
      // For custom ranges: "Jan 01, 2026 - Jan 04, 2026"
      return `${format(value.from, 'MMM dd, yyyy')} - ${format(value.to, 'MMM dd, yyyy')}`;
    } else if (value?.from) {
      return `From ${format(value.from, 'MMM dd, yyyy')}`;
    } else if (value?.to) {
      return `Until ${format(value.to, 'MMM dd, yyyy')}`;
    }
    return placeholder;
  };

  const handleClear = () => {
    onChange?.(undefined);
    setActivePreset(null);
    setIsOpen(false);
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "justify-start text-left font-normal h-9",
            !value?.from && !value?.to && "text-muted-foreground",
            className
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span className="text-xs">{getDateRangeDisplay()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 max-w-none w-full">
        <div className="flex items-start">
          <div className="w-[160px] border-r p-2 space-y-0.5 shrink-0">
            {presetRanges.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-xs h-8 px-3 relative",
                  activePreset === preset.label && "bg-accent text-accent-foreground"
                )}
                onClick={() => handlePresetSelect(preset)}
              >
                {preset.label}
                {activePreset === preset.label && (
                  <Check className="ml-auto h-3 w-3" />
                )}
              </Button>
            ))}
          </div>
 
           <CalendarComponent
            initialFocus
            mode="range"
            selected={value}
            onSelect={handleCalendarSelect}
            numberOfMonths={2}
            className="p-3"
          />
         </div>
        <div className="flex items-center justify-between p-3 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button size="sm" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}