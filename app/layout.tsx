import type { Metadata } from "next";
import {
  Source_Serif_4,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
} from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Астерия — юридическое агентство. Защищаем в судах и сделках",
  description:
    "Юридическое агентство Астерия защищает интересы людей и бизнеса в судах и сделках. 300+ дел доведено до результата, 95% решений в пользу клиента. Онлайн по всей России, первая консультация бесплатно.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${sourceSerif.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <SmoothScroll>
          {children}
          <CustomCursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
