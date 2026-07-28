import { useEffect, useRef, useCallback, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { DriveStep } from "driver.js";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useUpdateMeMutation } from "@/redux/features/user/user.api";

/**
 * Session storage key to prevent tour from starting multiple times in the same session
 */
const TOUR_STORAGE_KEY = 'onboarding_tour_started';

/**
 * Comprehensive onboarding tour steps covering all major system features.
 * Element IDs match sidebar item keys: tour-nav-{key}
 * The AppSidebar generates these IDs automatically from item.key
 */
const TOUR_STEPS: Array<{
  element: string;
  title: string;
  description: string;
  side?: "top" | "bottom" | "left" | "right";
}> = [
  // 1. Welcome & Navigation
  {
    element: "#sidebar-switcher",
    title: "Welcome to Tainc!",
    description:
      "Let's take a quick tour of your new workspace. Use this button to toggle the sidebar navigation anytime.",
    side: "right",
  },
  // Sidebar order (top → bottom)
  {
    element: "#tour-nav-analytics",
    title: "Analytics Dashboard",
    description:
      "View real-time business insights, track KPIs, revenue trends, and performance metrics all in one place.",
    side: "right",
  },
  {
    element: "#tour-nav-administration",
    title: "Administration",
    description:
      "Manage organization-level setup and administrative configurations from here.",
    side: "right",
  },
  {
    element: "#tour-nav-settings",
    title: "Settings - Important!",
    description:
      "Configure your organization, integrations, and preferences. This is where you'll set up email and phone services.",
    side: "right",
  },
  {
    element: "#tour-nav-calendar",
    title: "Calendar & Appointments",
    description:
      "Schedule appointments, view team availability, and sync with Google Calendar or Calendly.",
    side: "right",
  },
  {
    element: "#tour-nav-contacts",
    title: "Contacts Management",
    description:
      "Store and manage all your customers, leads, and vendors. Import contacts, add tags, and segment your audience.",
    side: "right",
  },
  {
    element: "#tour-nav-opportunity",
    title: "Opportunity",
    description:
      "Track your sales pipeline with a visual Kanban board. Move leads through stages from new to closed-won.",
    side: "right",
  },
  {
    // Sidebar key is manage-jobs, but AppSidebar strips manage- prefix -> jobs
    element: "#tour-nav-jobs",
    title: "Jobs",
    description:
      "Create, assign, and track jobs from start to finish. Schedule crews, manage tasks, and handle invoicing.",
    side: "right",
  },
  {
    element: "#tour-nav-conversations",
    title: "Conversations",
    description:
      "Unified inbox for all customer communications. Handle SMS, email, and chat in one place.",
    side: "right",
  },
  {
    element: "#tour-nav-automation",
    title: "Automation",
    description:
      "Create powerful workflows to automate follow-ups, reminders, and marketing campaigns.",
    side: "right",
  },
  {
    element: "#tour-nav-marketing",
    title: "Marketing",
    description:
      "Run email campaigns, manage ads, and track marketing performance.",
    side: "right",
  },
  {
    element: "#tour-nav-reporting",
    title: "Reporting",
    description:
      "Generate detailed reports on sales, jobs, team performance, and more.",
    side: "right",
  },
  {
    element: "#tour-nav-builder",
    title: "Builder",
    description:
      "Create custom forms, surveys, and landing pages with our builder.",
    side: "right",
  },
  {
    element: "#tour-nav-inventory",
    title: "Inventory Management",
    description:
      "Track products and equipment. Manage stock levels and get low-inventory alerts.",
    side: "right",
  },
  {
    element: "#tour-nav-training-modules",
    title: "Training Module",
    description:
      "Access training resources and modules for your team.",
    side: "right",
  },
  {
    element: "#tour-nav-vault",
    title: "Vault",
    description:
      "Store and manage important documents and assets securely.",
    side: "right",
  },
  {
    element: "#tour-nav-all-logs",
    title: "Logs",
    description:
      "Review activity logs to audit important actions across the system.",
    side: "right",
  },
  {
    element: "#theme-toggle",
    title: "Theme Toggle",
    description:
      "Switch between light and dark mode based on your preference. Your eyes will thank you!",
    side: "bottom",
  },

  // 5. Final step - this will have "Get Started" button
  {
    element: "body",
    title: "You're All Set!",
    description:
      "That's the tour! Click 'Get Started' to go to Settings and configure your integrations. Need help? Click your avatar for support options.",
    side: "top",
  },
];

/**
 * Custom CSS styles for the tour overlay to disable interactions
 */
const TOUR_OVERLAY_STYLES = `
  /* Dark overlay that blocks interactions */
  .driver-overlay {
    pointer-events: auto !important;
    cursor: not-allowed !important;
  }
  
  /* Popover should be interactive */
  .driver-popover {
    pointer-events: auto !important;
    z-index: 100001 !important;
  }

  /* Popover sizing: wider, responsive, and safe for long content */
  .driver-popover.driverjs-theme {
    width: 520px !important;
    max-width: calc(100vw - 32px) !important;
    min-width: 0 !important;
    max-height: calc(100vh - 96px) !important;
    box-sizing: border-box !important;
  }

  /* Allow full width for content inside the popover */
  .driver-popover.driverjs-theme .driver-popover-title,
  .driver-popover.driverjs-theme .driver-popover-description,
  .driver-popover.driverjs-theme .driver-popover-progress-text {
    max-width: 100% !important;
  }

  /* Prevent long descriptions from overflowing/breaking layout */
  .driver-popover.driverjs-theme .driver-popover-description {
    overflow-y: auto !important;
    max-height: calc(100vh - 260px) !important;
    overflow-wrap: anywhere !important;
  }
  
  /* Navigation buttons container */
  .driver-popover-navigation-btns {
    display: flex !important;
    gap: 4px !important;
    justify-content: flex-end !important;
    align-items: center !important;
    flex-wrap: nowrap !important;
  }

  /* Ensure buttons don't collapse and break layout */
  .driver-popover-prev-btn,
  .driver-popover-next-btn,
  .tour-skip-btn {
    white-space: nowrap !important;
    flex: 0 0 auto !important;
  }
  
  /* Close button in popover */
  .driver-popover-close-btn {
    pointer-events: auto !important;
    cursor: pointer !important;
  }
  
  /* All navigation buttons */
  .driver-popover-prev-btn,
  .driver-popover-next-btn {
    pointer-events: auto !important;
    cursor: pointer !important;
  }

  /* Improve button layout and prevent text clipping/ghosting */
  .driver-popover-prev-btn,
  .driver-popover-next-btn {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 10px 18px !important;
    min-width: 88px !important;
    height: auto !important;
    font-size: 15px !important;
    line-height: 1.4 !important;
    font-weight: 600 !important;
    border-radius: 10px !important;
    white-space: nowrap !important;
    box-sizing: border-box !important;
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
    backface-visibility: hidden !important;
    transform: translateZ(0) !important;
    color: #ffffff !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
    letter-spacing: 0.3px !important;
  }
  
  /* Ensure Next/Done button has proper background */
  .driver-popover-next-btn {
    background: #4F46E5 !important;
    border: none !important;
  }
  
  .driver-popover-next-btn:hover {
    background: #4338CA !important;
  }
  
  /* Back button styling */
  .driver-popover-prev-btn {
    background: #6B7280 !important;
    border: none !important;
    color: #ffffff !important;
  }
  
  .driver-popover-prev-btn:hover {
    background: #4B5563 !important;
  }
  
  /* Custom skip button styles */
  .tour-skip-btn {
    background: transparent !important;
    border: 1px solid #e5e7eb !important;
    color: #6b7280 !important;
    padding: 6px 14px !important;
    border-radius: 6px !important;
    font-size: 13px !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    font-weight: 500 !important;
    pointer-events: auto !important;
  }
  
  .tour-skip-btn:hover {
    background: #f3f4f6 !important;
    color: #374151 !important;
    border-color: #d1d5db !important;
  }
  
  /* Dark mode support for skip button */
  .dark .tour-skip-btn {
    border-color: #4b5563 !important;
    color: #9ca3af !important;
  }
  
  .dark .tour-skip-btn:hover {
    background: #374151 !important;
    color: #e5e7eb !important;
    border-color: #6b7280 !important;
  }
  
  /* Disable ALL other interactions when tour is active */
  body.tour-active {
    overflow: hidden !important;
  }
  
  body.tour-active *:not(.driver-popover):not(.driver-popover *):not(.driver-overlay):not(.driver-active-element):not([class*="driver-"]) {
    pointer-events: none !important;
  }
  
  /* Even the highlighted element should not be clickable */
  body.tour-active .driver-active-element {
    pointer-events: none !important;
  }
  
  /* Prevent scrolling on the page */
  body.tour-active,
  body.tour-active html {
    overflow: hidden !important;
    position: fixed !important;
    width: 100% !important;
    height: 100% !important;
  }
`;

/**
 * useOnboardingTour
 * - Lazy-loads Driver.js and presents a comprehensive first-time login tour.
 * - Shows exactly once per user using backend persistence (hasCompletedOnboarding field).
 * - Disables all other interactions during the tour.
 * - Only close/skip button and navigation buttons work.
 * - Clicking outside does NOT close the tour.
 * - Last step "Get Started" navigates to settings page.
 */
export function useOnboardingTour(options?: { enabled?: boolean }) {
  const navigate = useNavigate();
  const startedRef = useRef(false);
  const driverRef = useRef<ReturnType<typeof import("driver.js").driver> | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const [isTourActive, setIsTourActive] = useState(false);
  
  // Get user info from backend
  const { data: userData, isLoading: isUserLoading } = useUserInfoQuery(undefined);
  const [updateMe] = useUpdateMeMutation();

  const user = userData?.data;
  // Check backend field for tour completion status
  const hasCompletedOnboarding = user?.hasCompletedOnboarding ?? true; // Default to true to prevent showing while loading

  // Helper function to check if tour was already started in this session
  const hasTourStartedThisSession = useCallback(() => {
    return sessionStorage.getItem(TOUR_STORAGE_KEY) === 'true';
  }, []);

  // Helper function to mark tour as started in this session
  const markTourStartedThisSession = useCallback(() => {
    sessionStorage.setItem(TOUR_STORAGE_KEY, 'true');
  }, []);

  // Helper function to clear session storage when tour completes
  const clearTourSessionStorage = useCallback(() => {
    sessionStorage.removeItem(TOUR_STORAGE_KEY);
  }, []);

  // Inject custom CSS styles for tour
  const injectStyles = useCallback(() => {
    if (styleRef.current) return;
    const style = document.createElement("style");
    style.id = "tour-overlay-styles";
    style.textContent = TOUR_OVERLAY_STYLES;
    document.head.appendChild(style);
    styleRef.current = style;
    document.body.classList.add("tour-active");
  }, []);

  // Remove custom CSS styles
  const removeStyles = useCallback(() => {
    if (styleRef.current) {
      styleRef.current.remove();
      styleRef.current = null;
    }
    document.body.classList.remove("tour-active");
  }, []);

  // Mark tour as completed in backend
  const markCompleted = useCallback(async (navigateToSettings: boolean = false) => {
    try {
      // Persist to backend - this ensures tour won't show again on any device
      await updateMe({ hasCompletedOnboarding: true }).unwrap();
      
      // Clean up styles and session storage
      clearTourSessionStorage();
      removeStyles();
      setIsTourActive(false);
      
      if (navigateToSettings) {
        toast.success("Tour completed! Let's configure your settings.");
        // Small delay to ensure cleanup is complete before navigation
        setTimeout(() => navigate("/settings"), 100);
      } else {
        toast.info("Tour skipped. You can restart it from your profile menu anytime.");
      }
    } catch (error) {
      console.error("Failed to mark onboarding as completed:", error);
      // Still clean up even if backend fails
      clearTourSessionStorage();
      removeStyles();
      setIsTourActive(false);
      toast.error("Failed to save tour progress. Please try again.");
    }
  }, [updateMe, removeStyles, navigate, clearTourSessionStorage]);

  // Skip tour handler
  const skipTour = useCallback(() => {
    if (driverRef.current) {
      try {
        driverRef.current.destroy();
      } catch {
        // Ignore destroy errors
      }
      driverRef.current = null;
    }
    clearTourSessionStorage();
    markCompleted(false);
  }, [markCompleted, clearTourSessionStorage]);

  useEffect(() => {
    const enabled = options?.enabled ?? true;
    
    // Don't start if:
    // - Disabled
    // - Still loading user data
    // - User has already completed onboarding
    // - Already started this session
    // - Already started in this session (from sessionStorage)
    if (!enabled || isUserLoading || hasCompletedOnboarding || startedRef.current || hasTourStartedThisSession()) {
      return;
    }

    const start = async () => {
      // Guard against double-start (React StrictMode can double-invoke effects)
      if (startedRef.current || hasTourStartedThisSession()) return;
      startedRef.current = true;
      markTourStartedThisSession();

      try {
        // Lazy-load driver.js
        const { driver } = await import("driver.js");

        // Inject custom styles to disable page interactions
        injectStyles();
        setIsTourActive(true);

        // Wait for sidebar to fully render
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Filter steps to only include elements that exist in the DOM
        const filteredSteps: DriveStep[] = TOUR_STEPS.filter((step) => {
          if (step.element === "body") return true;
          try {
            return !!document.querySelector(step.element);
          } catch {
            return false;
          }
        }).map((step) => ({
          element: step.element,
          popover: {
            title: step.title,
            description: step.description,
            side: step.side,
          },
        }));

        // Ensure we have at least a welcome and final step
        if (filteredSteps.length < 2) {
          filteredSteps.unshift({
            element: "#sidebar-switcher",
            popover: {
              title: "Welcome to Tainc!",
              description: "Use the sidebar to navigate through all features. Let's get started!",
              side: "right",
            },
          });
        }

        // Create driver instance with custom configuration
        const drv = driver({
          showProgress: true,
          animate: true,
          allowClose: false, // Disable clicking X to close - we'll handle it ourselves
          overlayClickNext: false, // Disable clicking overlay to go next
          overlayColor: "rgba(15, 23, 42, 0.80)", // Darker overlay for better focus
          stagePadding: 10,
          stageRadius: 8,
          nextBtnText: "Next",
          prevBtnText: "Back",
          doneBtnText: "Get Started!",
          progressText: "{{current}} of {{total}}",
          steps: filteredSteps,
          popoverClass: "driverjs-theme",
          
          // Add skip button and handle close button when popover renders
          onPopoverRender: (popover: { wrapper: HTMLElement }) => {
            const isLastStep = !!driverRef.current?.isLastStep?.() && filteredSteps.length > 0;

            const navigationBtns = popover.wrapper.querySelector(".driver-popover-navigation-btns");
            if (navigationBtns) {
              // Check if skip button already exists
              const existingSkip = navigationBtns.querySelector(".tour-skip-btn");
              if (!existingSkip) {
                const skipBtn = document.createElement("button");
                skipBtn.className = "tour-skip-btn";
                skipBtn.textContent = "Skip Tour";
                skipBtn.type = "button";
                skipBtn.onclick = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  skipTour();
                };
                // Insert skip button at the beginning
                navigationBtns.insertBefore(skipBtn, navigationBtns.firstChild);
              }
            }
            
            // Make close button (X) work to skip the tour
            const closeBtn = popover.wrapper.querySelector(".driver-popover-close-btn");
            if (closeBtn) {
              (closeBtn as HTMLElement).style.pointerEvents = "auto";
              (closeBtn as HTMLElement).style.cursor = "pointer";
              (closeBtn as HTMLElement).onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                skipTour();
              };
            }

            // Make the final step wider (prevents layout breaking) and force Get Started to close + navigate
            if (isLastStep) {
              popover.wrapper.style.width = "520px";
              popover.wrapper.style.maxWidth = "calc(100vw - 48px)";

              const nextBtn = popover.wrapper.querySelector(
                ".driver-popover-next-btn"
              ) as HTMLButtonElement | null;

              if (nextBtn) {
                nextBtn.onclick = async (e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  // Close the tour immediately
                  if (driverRef.current) {
                    try {
                      driverRef.current.destroy();
                    } catch {
                      // ignore
                    }
                    driverRef.current = null;
                  }

                  // Persist completion + navigate to settings
                  await markCompleted(true);
                };
              }
            } else {
              // Reset any last-step width overrides
              popover.wrapper.style.width = "";
              popover.wrapper.style.maxWidth = "";
            }
          },
          
          // Final cleanup when tour is destroyed
          onDestroyed: () => {
            driverRef.current = null;
            removeStyles();
            setIsTourActive(false);
          },
        } as any);

        driverRef.current = drv;
        
        // Start the tour
        drv.drive();
        
      } catch (e) {
        console.warn("Onboarding tour failed to start:", e);
        startedRef.current = false;
        clearTourSessionStorage();
        removeStyles();
        setIsTourActive(false);
      }
    };

    // Delay start to ensure DOM is ready and sidebar is rendered
    const timeoutId = window.setTimeout(start, 700);

    // Cleanup function
    return () => {
      window.clearTimeout(timeoutId);
      if (driverRef.current) {
        try {
          driverRef.current.destroy();
        } catch {
          // Ignore cleanup errors
        }
        driverRef.current = null;
      }
      removeStyles();
      // Don't clear session storage here - only clear when tour actually completes
    };
  }, [options?.enabled, isUserLoading, hasCompletedOnboarding, markCompleted, skipTour, injectStyles, removeStyles, hasTourStartedThisSession, markTourStartedThisSession]);

  return { isTourActive };
}

/**
 * Call this to reset the tour (useful for testing or "Show Tour Again" feature).
 * This updates the backend to allow the tour to show again.
 */
export async function resetOnboardingTour() {
  try {
    const { axiosInstance } = await import("@/lib/axios");
    await axiosInstance.patch("/user/update-me", { hasCompletedOnboarding: false });
    toast.success("Tour reset! Refreshing page to start the tour...");
    // Force page reload to restart the tour
    setTimeout(() => window.location.reload(), 500);
  } catch (error) {
    console.error("Failed to reset onboarding tour:", error);
    toast.error("Failed to reset tour. Please try again.");
  }
}

/**
 * @deprecated Use backend hasCompletedOnboarding field instead
 * This function is kept for backward compatibility but does nothing now.
 * Tour is now automatically shown for users who haven't completed it.
 */
export function queueOnboardingAfterLogin() {
  // No longer needed - tour is controlled by backend hasCompletedOnboarding field
  console.log("queueOnboardingAfterLogin is deprecated - tour is now controlled by backend");
}
