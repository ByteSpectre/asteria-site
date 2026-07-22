import type { Metadata } from "next";
import { Cormorant, Manrope, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const cormorant = Cormorant({
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

const jbMono = JetBrains_Mono({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500"],
  variable: "--font-jbmono",
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
      className={`${cormorant.variable} ${manrope.variable} ${jbMono.variable}`}
    >
      <body className="font-sans antialiased">
        <SmoothScroll>
          {children}
          <CustomCursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
