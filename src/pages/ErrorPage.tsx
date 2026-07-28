import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  Home,
  RefreshCw,
  ArrowLeft,
  FileQuestion,
  ServerCrash,
  WifiOff,
  ShieldAlert,
} from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = "An unexpected error occurred";
  let errorStatus = "Error";
  let errorIcon = AlertTriangle;
  let errorDescription = "Something went wrong. Please try again later.";

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status.toString();
    
    switch (error.status) {
      case 404:
        errorIcon = FileQuestion;
        errorMessage = "Page Not Found";
        errorDescription = "The page you're looking for doesn't exist or has been moved.";
        break;
      case 401:
        errorIcon = ShieldAlert;
        errorMessage = "Unauthorized";
        errorDescription = "You don't have permission to access this resource.";
        break;
      case 403:
        errorIcon = ShieldAlert;
        errorMessage = "Forbidden";
        errorDescription = "Access to this resource is forbidden.";
        break;
      case 500:
        errorIcon = ServerCrash;
        errorMessage = "Server Error";
        errorDescription = "Our server encountered an error. We're working to fix it.";
        break;
      case 503:
        errorIcon = WifiOff;
        errorMessage = "Service Unavailable";
        errorDescription = "The service is temporarily unavailable. Please try again later.";
        break;
      default:
        errorMessage = error.statusText || "An error occurred";
        errorDescription = error.data?.message || "Something went wrong.";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDescription = error.stack || "Please contact support if this problem persists.";
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const Icon = errorIcon;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950 p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-200/20 dark:bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-orange-200/20 dark:bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <Card className="relative max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
        {/* Animated accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
        
        <CardContent className="p-6">
          {/* Floating Icon with Status */}
          <div className="flex items-center justify-center mb-5">
            <div className="relative flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-lg animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 p-3 rounded-2xl border border-red-100 dark:border-red-900/50 animate-bounce" style={{ animationDuration: '3s' }}>
                  <Icon className="w-7 h-7 text-red-500 dark:text-red-400" strokeWidth={1.5} />
                </div>
              </div>
              <div className="text-left">
                <div className="text-4xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-left duration-700">
                  {errorStatus}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide uppercase">
                  Error
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="text-center mb-5 animate-in fade-in slide-in-from-bottom duration-500">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
              {errorMessage}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {errorDescription}
            </p>
          </div>

          {/* Technical Details - Dev Only */}
          {import.meta.env.DEV && error instanceof Error && error.stack && (
            <details className="mb-4 group">
              <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors mb-1">
                View technical details →
              </summary>
              <pre className="p-3 bg-gray-950 dark:bg-black rounded-lg text-[10px] leading-relaxed text-gray-300 max-h-32 overflow-auto border border-gray-800 animate-in slide-in-from-top-1 duration-300">
                {error.stack}
              </pre>
            </details>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mb-5">
            <Button
              onClick={handleGoHome}
              size="sm"
              className="flex-1 h-9 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              <Home className="w-3.5 h-3.5 mr-1.5" />
              Go Home
            </Button>
            <Button
              onClick={handleGoBack}
              size="sm"
              variant="outline"
              className="h-9 px-4 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </Button>
            <Button
              onClick={handleRefresh}
              size="sm"
              variant="outline"
              className="h-9 px-4 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Help Footer */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Need help?{" "}
              <a href="/contact" className="text-gray-900 dark:text-white hover:underline font-medium underline-offset-2 transition-colors">
                Contact support
              </a>
              {" "}or{" "}
              <a href="/faq" className="text-gray-900 dark:text-white hover:underline font-medium underline-offset-2 transition-colors">
                visit FAQ
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
