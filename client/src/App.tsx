import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { MobileWarningPage } from "@/components/MobileWarning";
import { useShouldShowMobileWarning } from "@/hooks/useDeviceDetection";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * ResponsiveAppWrapper - Handles device detection and conditional rendering
 * Shows mobile warning page for small devices, full portfolio for larger screens
 */
function ResponsiveAppWrapper() {
  const { shouldShowWarning, dismissWarning } = useShouldShowMobileWarning();

  // Show stunning mobile warning page for small devices
  if (shouldShowWarning) {
    return <MobileWarningPage onDismiss={dismissWarning} />;
  }

  // Show full portfolio for tablets and larger
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ResponsiveAppWrapper />
    </QueryClientProvider>
  );
}

export default App;
