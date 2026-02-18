"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileWarningPage } from "@/components/MobileWarning";
import { useShouldShowMobileWarning } from "@/hooks/useDeviceDetection";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ResponsiveAppWrapper>{children}</ResponsiveAppWrapper>
        </QueryClientProvider>
      </body>
    </html>
  );
}

/**
 * ResponsiveAppWrapper - Handles device detection and conditional rendering
 * Shows mobile warning page for small devices, full portfolio for larger screens
 */
function ResponsiveAppWrapper({ children }: { children: React.ReactNode }) {
  const { shouldShowWarning, dismissWarning } = useShouldShowMobileWarning();

  // Show stunning mobile warning page for small devices
  if (shouldShowWarning) {
    return <MobileWarningPage onDismiss={dismissWarning} />;
  }

  // Show full portfolio for tablets and larger
  return (
    <TooltipProvider>
      <Toaster />
      {children}
    </TooltipProvider>
  );
}
