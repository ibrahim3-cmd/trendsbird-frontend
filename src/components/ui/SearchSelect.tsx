// components/ui/search-select.tsx
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X, Search } from "lucide-react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

// ============================================
// TYPES
// ============================================
export interface SearchSelectOption {
  label: string
  value: string
}

export interface SearchSelectProps {
  options: SearchSelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  isClearable?: boolean
  label?: string
}

// ============================================
// MAIN COMPONENT
// ============================================
const SearchSelect = React.forwardRef<HTMLButtonElement, SearchSelectProps>(
  (
    {
      options = [],
      value = "",
      onChange,
      placeholder = "Select option...",
      searchPlaceholder = "Type to search...",
      emptyText = "No results found.",
      className,
      disabled = false,
      isClearable = false,
      label,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState("")
    const [highlightedIndex, setHighlightedIndex] = React.useState(0)
    
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listRef = React.useRef<HTMLDivElement>(null)

    // Find selected option
    const selectedOption = React.useMemo(() => {
      return options.find((option) => option.value === value) || null
    }, [options, value])

    // Filter options based on search
    const filteredOptions = React.useMemo(() => {
      if (!searchValue.trim()) return options
      
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      )
    }, [options, searchValue])

    // Reset highlighted index when filtered options change
    React.useEffect(() => {
      setHighlightedIndex(0)
    }, [filteredOptions.length])

    // Handle selection
    const handleSelect = React.useCallback(
      (optionValue: string) => {
        if (onChange) {
          onChange(optionValue)
        }
        setOpen(false)
        setSearchValue("")
        setHighlightedIndex(0)
      },
      [onChange]
    )

    // Handle clear
    const handleClear = React.useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        if (onChange) {
          onChange("")
        }
        setSearchValue("")
      },
      [onChange]
    )

    // Handle keyboard navigation
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (!open) return

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault()
            setHighlightedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : prev
            )
            break
          case "ArrowUp":
            e.preventDefault()
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0))
            break
          case "Enter":
            e.preventDefault()
            if (filteredOptions[highlightedIndex]) {
              handleSelect(filteredOptions[highlightedIndex].value)
            }
            break
          case "Escape":
            e.preventDefault()
            setOpen(false)
            setSearchValue("")
            break
          case "Tab":
            setOpen(false)
            setSearchValue("")
            break
        }
      },
      [open, filteredOptions, highlightedIndex, handleSelect]
    )

    // Focus input when popover opens
    React.useEffect(() => {
      if (open) {
        const timer = setTimeout(() => {
          inputRef.current?.focus()
        }, 10)
        return () => clearTimeout(timer)
      } else {
        setSearchValue("")
        setHighlightedIndex(0)
      }
    }, [open])

    // Scroll highlighted item into view
    React.useEffect(() => {
      if (open && listRef.current) {
        const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement
        if (highlightedElement) {
          highlightedElement.scrollIntoView({ block: "nearest" })
        }
      }
    }, [highlightedIndex, open])

    return (
      <div className="relative w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}

        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          <PopoverPrimitive.Trigger asChild disabled={disabled}>
            <button
              ref={ref}
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-label={label || placeholder}
              disabled={disabled}
              className={cn(
                "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "hover:bg-accent/10",
                open && "ring-2 ring-ring ring-offset-2",
                className
              )}
            >
              <span
                className={cn(
                  "truncate text-left flex-1",
                  !selectedOption && "text-muted-foreground"
                )}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>

              <div className="flex items-center gap-1 ml-2 shrink-0">
                {isClearable && value && !disabled && (
                  <X
                    className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer transition-opacity"
                    onClick={handleClear}
                    aria-label="Clear selection"
                  />
                )}
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </div>
            </button>
          </PopoverPrimitive.Trigger>

          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align="start"
              sideOffset={4}
              onOpenAutoFocus={(e) => e.preventDefault()}
              className={cn(
                "z-50 w-[var(--radix-popover-trigger-width)] rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2",
                "data-[side=top]:slide-in-from-bottom-2"
              )}
            >
              {/* Search Input */}
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
                {searchValue && (
                  <X
                    className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer"
                    onClick={() => setSearchValue("")}
                  />
                )}
              </div>

              {/* Options List */}
              <div
                ref={listRef}
                role="listbox"
                className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1"
              >
                {filteredOptions.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {emptyText}
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={value === option.value}
                      onClick={() => handleSelect(option.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        highlightedIndex === index && "bg-accent text-accent-foreground",
                        value === option.value && "font-medium"
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="truncate">{option.label}</span>
                    </div>
                  ))
                )}
              </div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      </div>
    )
  }
)

SearchSelect.displayName = "SearchSelect"

export { SearchSelect }