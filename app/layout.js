import { Fredoka, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  title: "LegoBricksLink — LEGO Sets & Minifigures, organized by theme",
  description:
    "Browse LEGO sets and minifigures by theme and subtheme, with full spec sheets on every product — pieces, packaging, designer, and price.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-body antialiased">
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
