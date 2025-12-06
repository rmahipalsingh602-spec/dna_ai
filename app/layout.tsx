import "./globals.css";

export const metadata = {
  title: "DNA AI",
  description: "Multi-Language AI Assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PV48PPC5Q0"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PV48PPC5Q0');
            `,
          }}
        />
      </head>

      <body className="min-h-screen overflow-x-hidden bg-black text-white">
        {children}
      </body>
    </html>
  );
}
