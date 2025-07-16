import { Footer } from "./_component/_footer/Footer";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-slate-800 flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        <div className="w-full grid place-items-center">
          <Footer />
        </div>
      </body>
    </html>
  );
}
