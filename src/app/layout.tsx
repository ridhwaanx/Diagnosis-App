import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import ThemeProviderWrapper from "./theme-provider";
import Navigation from "../components/Navigation"
import "./globals.css";
import { CssBaseline } from "@mui/material";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Smart-Diagnosis App",
  description: "AI Powered Doctor",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <CssBaseline/>
      <body className={`${publicSans.variable} antialiased`} style={{ height: '100%', backgroundImage: "url('/images/bluebg.jpg')", // Path to image
      backgroundSize: 'cover', // Cover the entire box
      backgroundPosition: 'center', // Center the image
      backgroundRepeat: 'no-repeat'}} >
        <ThemeProviderWrapper>
          <Navigation />
          <main>
            {children}
          </main>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
