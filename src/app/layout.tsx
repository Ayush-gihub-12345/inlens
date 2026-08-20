import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://gov.inlens.in";
const SITE_TITLE = "gov.inLens — India's government, finally explained simply";
const SITE_DESCRIPTION =
  "Search any Indian government service, scheme, or exam. inLens explains eligibility, documents, fees, and process in plain language, then sends you to the official source to apply.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | gov.inLens",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "government services India",
    "gov.in",
    "PAN card",
    "Aadhaar card",
    "passport apply",
    "driving licence",
    "government schemes",
    "PM-KISAN",
    "UPSC exam",
  ],
  applicationName: "gov.inLens",
  authors: [{ name: "inLens" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "gov.inLens",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.svg",
  },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "gov.inLens",
  url: BASE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "inLens",
  url: "https://inlens.in",
  logo: `${BASE_URL}/favicon.svg`,
  description:
    "inLens is India's information layer, helping people find and understand public services online.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50">
        <JsonLd data={websiteLd} />
        <JsonLd data={organizationLd} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
