import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Астерия — юридическое агентство. Защищаем в судах и сделках",
  description:
    "Юридическое агентство Астерия защищает интересы людей и бизнеса в судах и сделках. 300+ дел доведено до результата, 95% решений в пользу клиента. Онлайн по всей России, первая консультация бесплатно.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
