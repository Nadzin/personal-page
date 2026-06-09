import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kai Nadezkin | Systems Researcher & Automation Engineer",
    template: "%s | Kai Nadezkin"
  },
  description: "Official portfolio of Kai Nadezkin: diving into the intersection of Cloud Native Infrastructure, AI-assisted Process Automation, and Scalable Enterprise Solutions.",
  keywords: [
    "Kai Nadezkin", 
    "Nadezkin", 
    "Nadzin", 
    "Kai", 
    "Systems Researcher", 
    "Automation Engineer", 
    "Ansible Expert", 
    "Cloud Native Architect", 
    "GraphRAG", 
    "Bioinformatics", 
    "Germany Automation Specialist"
  ],
  authors: [{ name: "Kai Nadezkin", url: "https://nadezkin.de" }],
  creator: "Kai Nadezkin",
  publisher: "Kai Nadezkin",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://nadezkin.de",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nadezkin.de",
    siteName: "Kai Nadezkin Portfolio",
    title: "Kai Nadezkin | Systems Researcher & Automation Engineer",
    description: "Official portfolio of Kai Nadezkin: diving into the intersection of Cloud Native Infrastructure, AI-assisted Process Automation, and Scalable Enterprise Solutions.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kai Nadezkin - Systems Researcher & Automation Engineer",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kai Nadezkin | Systems Researcher & Automation Engineer",
    description: "Official portfolio of Kai Nadezkin: diving into the intersection of Cloud Native Infrastructure, AI-assisted Process Automation, and Scalable Enterprise Solutions.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Kai Nadezkin",
    "familyName": "Nadezkin",
    "givenName": "Kai",
    "url": "https://nadezkin.de",
    "email": "kai@nadezkin.de",
    "telephone": "+49 172 5605753",
    "jobTitle": "Technology Consultant & Automation Architect",
    "worksFor": {
      "@type": "Organization",
      "name": "IBM Deutschland GmbH"
    },
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "Reutlingen University"
      },
      {
        "@type": "EducationalOrganization",
        "name": "DHBW Villingen-Schwenningen"
      }
    ],
    "sameAs": [
      "https://github.com/Nadzin",
      "https://www.linkedin.com/in/kai-nadezkin-870b8425a/"
    ],
    "description": "Technology consultant and systems engineer specializing in Cloud Native Infrastructure, AI-assisted Process Automation, and Scalable Enterprise Solutions."
  };

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
