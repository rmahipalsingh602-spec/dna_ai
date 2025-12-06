import "./globals.css";

export const metadata = {
  title: "DNA AI • Ultra Premium",
  description: "Next-level AI with multi-language + voice",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-black via-gray-900 to-purple-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
