import { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  Home,
  RefreshCw,
  Bug,
  Copy,
  CheckCircle,
} from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      copied: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    });
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleCopyError = () => {
    const errorText = `Error: ${this.state.error?.message}\n\nStack Trace:\n${this.state.error?.stack}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack}`;
    navigator.clipboard.writeText(errorText);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950 p-4">
          {/* Floating animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-red-200/20 dark:bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-200/20 dark:bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <Card className="relative max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 overflow-hidden">
            {/* Animated top border */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
            
            <CardContent className="p-6">
              {/* Floating Icon with Animation */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 p-4 rounded-2xl border border-red-100 dark:border-red-900/50 animate-bounce" style={{ animationDuration: '3s' }}>
                    <Bug className="w-8 h-8 text-red-500 dark:text-red-400" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-4">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 tracking-tight">
                  Something Went Wrong
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Don't worry, we're here to help
                </p>
              </div>

              {/* Error Message with Subtle Animation */}
              {this.state.error && (
                <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 dark:from-red-500/10 dark:to-orange-500/10 rounded-lg blur-sm"></div>
                    <div className="relative p-3 bg-white dark:bg-gray-950 border border-red-100 dark:border-red-900/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 dark:text-gray-300 break-words font-mono leading-relaxed">
                            {this.state.error.message}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={this.handleCopyError}
                          className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                        >
                          {this.state.copied ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 animate-in zoom-in duration-200" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Technical Details - Dev Only */}
                  {import.meta.env.DEV && this.state.error.stack && (
                    <details className="mt-2 group">
                      <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors">
                        View stack trace →
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-950 dark:bg-black rounded-lg text-[10px] leading-relaxed text-gray-300 max-h-32 overflow-auto border border-gray-800 animate-in slide-in-from-top-1 duration-300">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons with Hover Animations */}
              <div className="flex gap-2 mb-4">
                <Button
                  onClick={this.handleGoHome}
                  size="sm"
                  className="flex-1 h-9 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                >
                  <Home className="w-3.5 h-3.5 mr-1.5" />
                  Go Home
                </Button>
                <Button
                  onClick={this.handleRefresh}
                  size="sm"
                  variant="outline"
                  className="h-9 px-4 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
                <Button
                  onClick={this.handleReset}
                  size="sm"
                  variant="outline"
                  className="h-9 px-4 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Try Again
                </Button>
              </div>

              {/* Help Section */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Need assistance?{" "}
                  <a href="/contact" className="text-gray-900 dark:text-white hover:underline font-medium underline-offset-2 transition-colors">
                    Contact support
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
