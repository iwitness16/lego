import { Fredoka, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
import { CartProvider } from "@/components/CartProvider";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-data",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://legobrickslink.com"
  ),
  title: "LegoBricksLink — LEGO Sets & Minifigures, organized by theme",
  description:
    "Browse LEGO sets and minifigures by theme and subtheme, with full spec sheets on every product — pieces, packaging, designer, and price.",
  icons: {
    icon:        "/logo.jpg",
    shortcut:    "/logo.jpg",
    apple:       "/logo.jpg",
  },
  openGraph: {
    title:       "LegoBricksLink — LEGO Sets & Minifigures",
    description: "Browse LEGO sets and minifigures by theme and subtheme, with full spec sheets on every product.",
    url:         "https://legobrickslink.com",
    siteName:    "LegoBricksLink",
    images: [
      {
        url:    "/logo.jpg",
        width:  800,
        height: 600,
        alt:    "LegoBricksLink logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "LegoBricksLink — LEGO Sets & Minifigures",
    description: "Browse LEGO sets and minifigures by theme and subtheme.",
    images:      ["/logo.jpg"],
  },
};

export const viewport = {
  width:        "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-body antialiased">
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingWidgets />
        </CartProvider>
      </body>
    </html>
  );
}
