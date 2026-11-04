import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anime Network Tamil",
  description: "Anime Network Tamil — watch your authorized anime collection."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
