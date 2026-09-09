import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Noto_Serif_Thai, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import Header from "@/components/Header";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plusjakarta",
  display: "swap",
});

const notoSerifTh = Noto_Serif_Thai({
  subsets: ["thai"],
  weight: ["400", "600"],
  variable: "--font-noto-serif-th",
  display: "swap",
});

const notoSansTh = Noto_Sans_Thai({
  subsets: ["thai"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-sans-th",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fitcolor — randomize your outfit's color combination",
  description:
    "A fast, free, playful tool that randomizes outfit color combinations using real color-theory rules. No login, no clutter.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plusJakarta.variable} ${notoSerifTh.variable} ${notoSansTh.variable}`}>
      <body className="font-body min-h-screen">
        <I18nProvider>
          <ThemeProvider>
            <Header />
            <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 pb-24">{children}</main>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
