import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "DNA AI",
  description: "Multi-Language AI Assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden bg-black text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
