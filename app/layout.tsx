import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import { LabStoreProvider } from "@/lib/lab-store";

export const metadata: Metadata = {
  title: "SARP LAB Management System",
  description: "Construction materials laboratory workflow management",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: "/icons/apple-touch-icon.png"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SARP LAB"
  }
};

export const viewport: Viewport = {
  themeColor: "#5B193F"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <AuthProvider>
            <LabStoreProvider>
              <AppShell>{children}</AppShell>
            </LabStoreProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
