import { useState, ReactNode, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabItem {
  name: string;
  icon?: LucideIcon;
  component: ReactNode;
  key: string
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  tabs?: TabItem[];
  className?: string;
}

export function PageHeader({ title, description, icon: Icon, tabs, className }: PageHeaderProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get the tab from URL or default to first tab
  const getActiveTabIndex = useCallback(() => {
    if (!tabs || tabs.length === 0) return 0;

    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl) {
      const tabIndex = tabs.findIndex(tab => tab.key === tabFromUrl);
      return tabIndex !== -1 ? tabIndex : 0;
    }
    return 0;
  }, [searchParams, tabs]);

  const [activeTab, setActiveTab] = useState(getActiveTabIndex);

  // Update URL when tab changes
  const handleTabChange = (index: number) => {
    if (tabs && tabs[index]) {
      setActiveTab(index);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('tab', tabs[index].key);
      setSearchParams(newSearchParams);
    }
  };

  // Update active tab when URL changes (browser back/forward)
  useEffect(() => {
    const newActiveTab = getActiveTabIndex();
    setActiveTab(newActiveTab);
  }, [getActiveTabIndex]);

  return (
    <div className={cn("w-full", className)}>
      {/* Header with Icon and Title */}
      <div className="flex items-end gap-3 px-6 py-3 border rounded-t-lg">
        <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-lg">
          <Icon className="w-6 h-6 text-primary-text" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-[-2px] text-xs text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

      </div>

      {/* Border */}

      {/* Tabs (if provided) */}
      {tabs && tabs.length > 0 && (
        <div className="border border-t-0 border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max">
            {tabs.map((tab, index) => {
              const isActive = activeTab === index;
              const TabIcon = tab.icon;

              return (
                <button
                  key={index}
                  onClick={() => handleTabChange(index)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap",
                    isActive
                      ? "border-primary text-primary-text bg-primary"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  {TabIcon && <TabIcon className="w-4 h-4" />}
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}


      {/* Tab Content */}
      {tabs && tabs.length > 0 && (
        <div className="py-6">
          {tabs[activeTab]?.component}
        </div>
      )}
    </div>
  );
}
