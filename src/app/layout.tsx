import "./globals.css";
import type { Metadata } from "next";
import { Header } from "./_components/Header";

export const metadata: Metadata = {
  title: "BlogSite",  // サイトタイトル
  description: "Next.jsで作ったブログサイト",  // サイト説明
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
