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

interface Category {
  _id: string;
  categoryName: string;
  averageValue?: number;
}

interface SearchableMultiCategoryFilterProps {
  selectedCategories: string[];
  onCategoriesChange: (values: string[]) => void;
  categories: Category[];
  placeholder?: string;
  className?: string;
}

export const SearchableMultiCategoryFilter: React.FC<SearchableMultiCategoryFilterProps> = ({
  selectedCategories,
  onCategoriesChange,
  categories,
  placeholder = "Select categories...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedCategoryObjects = categories.filter((category: Category) => 
    selectedCategories.includes(category._id)
  );
  
  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    if (checked) {
      onCategoriesChange([...selectedCategories, categoryId]);
    } else {
      onCategoriesChange(selectedCategories.filter((id: string) => id !== categoryId));
    }
  };

  const removeCategory = (categoryId: string) => {
    onCategoriesChange(selectedCategories.filter((id: string) => id !== categoryId));
  };

  const clearAll = () => {
    onCategoriesChange([]);
  };

  const isCategorySelected = (categoryId: string) => selectedCategories.includes(categoryId);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal h-auto min-h-9 ${className}`}
        >
          <div className="flex flex-wrap items-center gap-1 w-full">
            {selectedCategories.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {selectedCategories.length <= 2 ? (
                  selectedCategoryObjects.map((category: Category) => (
                    <Badge
                      key={category._id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {category?.categoryName || 'Unknown'}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCategory(category._id);
                        }}
                        className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5 cursor-pointer inline-flex items-center justify-center"
                      >
                        <X className="w-2 h-2" />
                      </span>
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    {selectedCategories.length} categories selected
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
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search categories..." />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category: Category) => {
                const isSelected = isCategorySelected(category._id);
                return (
                  <CommandItem
                    key={category._id}
                    onSelect={() => handleCategoryToggle(category._id, !isSelected)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleCategoryToggle(category._id, Boolean(checked))
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{category.categoryName}</div>
                        {category.averageValue !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            Avg: ${category.averageValue.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
