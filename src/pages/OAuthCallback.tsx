import { useEffect, useState } from "react";

export default function OAuthCallback() {
  const [status, setStatus] = useState<"sending" | "success" | "fallback">("sending");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    const payload = code
      ? { type: "CALENDLY2_OAUTH_SUCCESS", code }
      : { type: "CALENDLY2_OAUTH_ERROR", error: error || "unknown_error" };

    // Store in localStorage as fallback for when window.opener is lost
    // (happens during new user registration flows with multiple redirects)
    if (code) {
      try {
        localStorage.setItem("calendly_oauth_code", JSON.stringify({ code, timestamp: Date.now() }));
      } catch {}
    }

    let messageSent = false;

    const sendMessage = () => {
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(payload, window.location.origin);
          // Also try wildcard as backup
          window.opener.postMessage(payload, "*");
          messageSent = true;
          setStatus("success");
        } else if (window.parent && window.parent !== window) {
          window.parent.postMessage(payload, window.location.origin);
          window.parent.postMessage(payload, "*");
          messageSent = true;
          setStatus("success");
        }
      } catch {}
      return messageSent;
    };

    // Try sending immediately
    sendMessage();

    // Retry a few times in case opener isn't ready yet
    const retryIntervals = [100, 300, 600, 1000];
    const retryTimeouts: NodeJS.Timeout[] = [];
    
    retryIntervals.forEach((delay) => {
      retryTimeouts.push(setTimeout(() => {
        if (!messageSent) sendMessage();
      }, delay));
    });

    // Close window after giving enough time for message delivery
    // Use longer delay to ensure parent receives the message
    const closeTimeout = setTimeout(() => {
      if (!messageSent) {
        setStatus("fallback");
      }
      // Give a bit more time before closing
      setTimeout(() => {
        try { window.close(); } catch {}
      }, 500);
    }, 1500);

    return () => {
      retryTimeouts.forEach(clearTimeout);
      clearTimeout(closeTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-sm text-gray-600">
        {status === "sending" && "Finishing authentication…"}
        {status === "success" && "Connected! This window will close automatically."}
        {status === "fallback" && "Authentication complete. You may close this window and refresh the page."}
      </div>
    </div>
  );
}
