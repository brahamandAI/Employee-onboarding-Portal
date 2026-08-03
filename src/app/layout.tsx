import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ToastProvider, Toaster } from "@/components/ui/toast";
import { SITE } from "@/features/marketing/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "security services India",
    "manned guarding",
    "CCTV surveillance",
    "facility security",
    "Rakshak Securitas",
    "PSARA licensed security",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jakarta.variable} font-sans`} suppressHydrationWarning>
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
