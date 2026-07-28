import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleOAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      if (window.opener) {
        window.opener.postMessage(
          { type: "GOOGLE_OAUTH_ERROR", error },
          window.location.origin
        );
      }
      window.close();
      return;
    }

    if (code) {
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "GOOGLE_OAUTH_SUCCESS",
            code,
            redirectTo: "/settings?tab=integrations",
          },
          window.location.origin
        );

        window.close();
      } else {
        navigate("/settings?tab=integrations");
      }
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing Google authentication...</p>
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
