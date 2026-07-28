import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  ArrowLeft,
  Search,
  FileQuestion,
  Compass,
} from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const popularPages = [
    { name: "Dashboard", path: "/analytics", icon: Home },
    { name: "Leads", path: "/manage-leads", icon: Compass },
    { name: "About", path: "/about", icon: FileQuestion },
    { name: "Contact", path: "/contact", icon: Search },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950 p-4 relative overflow-hidden">
      {/* Animated floating orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-violet-200/20 dark:bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Card className="relative max-w-lg w-full border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
        {/* Animated gradient border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent animate-pulse"></div>
        
        <CardContent className="p-8">
          {/* 404 Hero Section */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Floating Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500/20 rounded-2xl blur-lg animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 p-3 rounded-2xl border border-violet-100 dark:border-violet-900/50 animate-bounce" style={{ animationDuration: '3s' }}>
                  <FileQuestion className="w-8 h-8 text-violet-500 dark:text-violet-400" strokeWidth={1.5} />
                </div>
              </div>
              
              {/* 404 Number */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 blur-2xl opacity-20 animate-pulse"></div>
                <h1 className="relative text-7xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-in zoom-in duration-700">
                  404
                </h1>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-500">
              Page Not Found
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed animate-in fade-in slide-in-from-bottom-3 duration-700">
              The page you're looking for doesn't exist or has been moved
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
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
          </div>

          {/* Quick Links Grid */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-5 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 text-center">
              Popular pages
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {popularPages.map((page, index) => {
                const Icon = page.icon;
                return (
                  <button
                    key={page.path}
                    onClick={() => navigate(page.path)}
                    className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-900/50 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/10 rounded-lg blur transition-all duration-200"></div>
                      <Icon className="relative w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-200" strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200 leading-tight">
                      {page.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Help Footer */}
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Still lost?{" "}
              <a href="/contact" className="text-gray-900 dark:text-white hover:underline font-medium underline-offset-2 transition-colors">
                Get help from support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
