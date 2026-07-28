import React, { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TagsInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    suggestions?: string[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    maxTags?: number;
}

export function TagsInput({
    value = [],
    onChange,
    suggestions = [],
    placeholder = "Type to add tags...",
    className,
    disabled = false,
    maxTags,
}: TagsInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter suggestions based on input value and exclude already selected tags
    const filteredSuggestions = suggestions.filter(
        (suggestion) =>
            suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
            !value.some(tag => tag.toLowerCase() === suggestion.toLowerCase())
    );

    // Handle clicking outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        const normalizedTag = trimmedTag.toLowerCase();
        
        // Always clear input first
        setInputValue("");
        setIsOpen(false);
        setHighlightedIndex(-1);
        
        if (
            trimmedTag &&
            !value.some(existingTag => existingTag.toLowerCase() === normalizedTag) &&
            (!maxTags || value.length < maxTags)
        ) {
            // Always store tags in lowercase to ensure consistency
            onChange([...value, normalizedTag]);
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((tag) => tag !== tagToRemove));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setIsOpen(newValue.length > 0 && filteredSuggestions.length > 0);
        setHighlightedIndex(-1);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
                addTag(filteredSuggestions[highlightedIndex]);
            } else if (inputValue.trim()) {
                addTag(inputValue);
            }
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            removeTag(value[value.length - 1]);
        } else if (e.key === "ArrowDown" && isOpen) {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev < filteredSuggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp" && isOpen) {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setHighlightedIndex(-1);
        } else if (e.key === "Tab") {
            if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
                e.preventDefault();
                addTag(filteredSuggestions[highlightedIndex]);
            }
        }
    };

    const handleInputFocus = () => {
        if (inputValue && filteredSuggestions.length > 0) {
            setIsOpen(true);
        }
    };

    const handleInputBlur = () => {
        // Small delay to allow click events on suggestions to work
        setTimeout(() => {
            setIsOpen(false);
            setHighlightedIndex(-1);
        }, 150);
    };

    const handleSuggestionClick = (suggestion: string) => {
        addTag(suggestion);
        inputRef.current?.focus();
    };

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <div
                className={cn(
                    "flex flex-wrap gap-1 p-2 border border-input rounded-md bg-background min-h-[40px] items-center",
                    disabled && "cursor-not-allowed opacity-50",
                    "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
                )}
                onClick={() => !disabled && inputRef.current?.focus()}
            >
                {value.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs h-6 pr-1 gap-1"
                    >
                        {tag}
                        {!disabled && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeTag(tag);
                                }}
                                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </Badge>
                ))}
                <Input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder={value.length === 0 ? placeholder : ""}
                    disabled={disabled || (maxTags !== undefined && value.length >= maxTags)}
                    className="border-0 shadow-none p-0 h-6 flex-1 min-w-[120px] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-md max-h-48 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                        <div
                            key={suggestion}
                            className={cn(
                                "px-3 py-2 text-sm cursor-pointer transition-colors",
                                index === highlightedIndex
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-accent hover:text-accent-foreground"
                            )}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}

            {maxTags && (
                <div className="text-xs text-muted-foreground mt-1">
                    {value.length}/{maxTags} tags
                </div>
            )}
        </div>
    );
}