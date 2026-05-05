import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { I18nProvider } from "@/lib/i18n";
import { LabStoreProvider } from "@/lib/lab-store";

export const metadata: Metadata = {
  title: "SARP LAB Management System",
  description: "Construction materials laboratory workflow management"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <LabStoreProvider>
            <AppShell>{children}</AppShell>
          </LabStoreProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
