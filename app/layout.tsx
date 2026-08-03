import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { SIDEBAR_BOOTSTRAP_SCRIPT } from "@/lib/sidebar-preference";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Schola — Campus OS",
    template: "%s · Schola",
  },
  description: "Premium school management platform for modern campuses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} h-full`}>
      <body className="min-h-full">
        <script
          dangerouslySetInnerHTML={{ __html: SIDEBAR_BOOTSTRAP_SCRIPT }}
        />
        {children}
      </body>
    </html>
  );
}
