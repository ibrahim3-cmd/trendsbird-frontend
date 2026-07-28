import React, { useState, useEffect, useRef } from 'react';
import { Building, ChevronDown, Loader2, X } from 'lucide-react';
import { useGetAllOrgQuery } from '@/redux/features/org/orgApiSlice';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface OrgSelectProps {
  value?: string;
  onValueChange: (orgId: string, orgData?: { _id: string; orgName: string }) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  required?: boolean;
  errorMessage?: string;
}

const OrgSelect: React.FC<OrgSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select organization...",
  className,
  disabled = false,
  error = false,
  label = "Organization",
  required = false,
  errorMessage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch organizations with search term
  const { data: allOrgs, isLoading } = useGetAllOrgQuery({
    page: 1,
    limit: 10000,
    searchTerm: searchTerm
  });

  const organizations = allOrgs?.data || [];

  // Get display name for selected organization
  const getSelectedOrgDisplay = () => {
    if (!value) return placeholder;
    const org = organizations.find((o: { _id: string; orgName: string }) => o._id === value);
    return org ? org.orgName : placeholder;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Reset search term when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    } else {
      // Focus input when dropdown opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  const handleSelectOrg = (org: { _id: string; orgName: string }) => {
    onValueChange(org._id, org);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange('');
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Label */}
      {label && (
        <Label htmlFor="org" className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center w-full px-3 py-2 text-sm rounded-md border bg-background",
          "hover:bg-accent hover:text-accent-foreground transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          !value && "text-muted-foreground",
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "ring-2 ring-ring ring-offset-2",
          label && "mt-1"
        )}
      >
        <Building className="mr-2 h-4 w-4 shrink-0" />
        <span className="flex-1 text-left truncate">
          {getSelectedOrgDisplay()}
        </span>
        <div className="flex items-center gap-1">
          {value && !disabled && (
            <X
              className="h-4 w-4 text-muted-foreground hover:text-foreground"
              onClick={handleClearSelection}
            />
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isOpen && "transform rotate-180"
            )}
          />
        </div>
      </button>

      {/* Custom Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search organizations..."
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Results List */}
          <div className="max-h-[300px] overflow-y-auto p-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading organizations...
              </div>
            ) : organizations.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No organizations found
              </div>
            ) : (
              <div className="space-y-1">
                {organizations.map((org: { _id: string; orgName: string }) => (
                  <button
                    key={org._id}
                    type="button"
                    onClick={() => handleSelectOrg(org)}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm rounded-sm",
                      "hover:bg-accent hover:text-accent-foreground transition-colors",
                      value === org._id && "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{org.orgName}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default OrgSelect;
