"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
    value?: Date | string;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function DateTimePicker({
    value,
    onChange,
    placeholder = "Pick a date and time",
    disabled = false,
    className,
}: DateTimePickerProps) {
    const [open, setOpen] = React.useState(false);
    const selectedDate = value ? (typeof value === 'string' ? new Date(value) : value) : undefined;

    const [viewDate, setViewDate] = React.useState<Date>(selectedDate || new Date());
    const [yearInput, setYearInput] = React.useState(viewDate.getFullYear().toString());
    const [time, setTime] = React.useState(
        selectedDate ? format(selectedDate, "HH:mm") : "12:00"
    );

    React.useEffect(() => {
        setYearInput(viewDate.getFullYear().toString());
    }, [viewDate]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const handleYearChange = (increment: number) => {
        const newDate = new Date(viewDate);
        newDate.setFullYear(viewDate.getFullYear() + increment);
        setViewDate(newDate);
    };

    const handleMonthChange = (increment: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(viewDate.getMonth() + increment);
        setViewDate(newDate);
    };

    const handleYearInputChange = (value: string) => {
        // Limit to 4 digits
        const limitedValue = value.slice(0, 4);
        setYearInput(limitedValue);
        const year = parseInt(limitedValue);
        if (!isNaN(year) && year > 0 && year < 10000) {
            const newDate = new Date(viewDate);
            newDate.setFullYear(year);
            setViewDate(newDate);
        }
    };

    const handleDayClick = (day: number) => {
        const [hours, minutes] = time.split(":");
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, parseInt(hours), parseInt(minutes));
        onChange?.(newDate);
    };

    const handleTimeChange = (newTime: string) => {
        setTime(newTime);
        if (selectedDate) {
            const [hours, minutes] = newTime.split(":");
            const newDate = new Date(selectedDate);
            newDate.setHours(parseInt(hours), parseInt(minutes));
            onChange?.(newDate);
        }
    };

    const isSelectedDay = (day: number | null) => {
        if (!day || !selectedDate) return false;
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === viewDate.getMonth() &&
            selectedDate.getFullYear() === viewDate.getFullYear()
        );
    };

    const isToday = (day: number | null) => {
        if (!day) return false;
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === viewDate.getMonth() &&
            today.getFullYear() === viewDate.getFullYear()
        );
    };

    const days = getDaysInMonth(viewDate);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP p") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="p-2">
                    {/* Year and Month Controls */}
                    <div className="flex items-center justify-between mb-2">
                        {/* Year Control */}
                        <div className="flex items-center gap-1">
                            <div className="flex flex-col">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-6 p-0"
                                    onClick={() => handleYearChange(1)}
                                >
                                    <ChevronUp className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-6 p-0"
                                    onClick={() => handleYearChange(-1)}
                                >
                                    <ChevronDown className="h-3 w-3" />
                                </Button>
                            </div>
                            <Input
                                type="text"
                                value={yearInput}
                                onChange={(e) => handleYearInputChange(e.target.value)}
                                maxLength={4}
                                className="w-14 h-7 text-center text-xs font-semibold px-1"
                            />
                        </div>

                        {/* Month Control */}
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleMonthChange(-1)}
                            >
                                <ChevronDown className="h-4 w-4 rotate-90" />
                            </Button>
                            <div className="min-w-[100px] text-center text-sm font-semibold">
                                {MONTHS[viewDate.getMonth()]}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleMonthChange(1)}
                            >
                                <ChevronUp className="h-4 w-4 rotate-90" />
                            </Button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-x-0 gap-y-0.5">
                        {DAYS.map((day) => (
                            <div
                                key={day}
                                className="h-8 w-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
                            >
                                {day}
                            </div>
                        ))}

                        {days.map((day, index) => (
                            <div key={index} className="h-8 w-8">
                                {day && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDayClick(day)}
                                        className={cn(
                                            "h-8 w-8 p-0 font-normal",
                                            isSelectedDay(day) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                                            isToday(day) && !isSelectedDay(day) && "border border-primary",
                                            !isSelectedDay(day) && "hover:bg-accent"
                                        )}
                                    >
                                        {day}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Time Picker Section */}
                    <div className="mt-3 pt-3 border-t">
                        <Label htmlFor="time-picker" className="text-xs font-medium mb-2 flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Time
                        </Label>
                        <Input
                            id="time-picker"
                            type="time"
                            value={time}
                            onChange={(e) => handleTimeChange(e.target.value)}
                            className="w-full mt-2"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between mt-3 pt-3 border-t gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const now = new Date();
                                setViewDate(now);
                                setTime(format(now, "HH:mm"));
                                onChange?.(now);
                                setOpen(false);
                            }}
                        >
                            Now
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    onChange?.(undefined);
                                    setOpen(false);
                                }}
                            >
                                Clear
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => setOpen(false)}
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
