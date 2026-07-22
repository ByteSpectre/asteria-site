import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-inter",
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
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <SmoothScroll>
          {children}
          <CustomCursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
