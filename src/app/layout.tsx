import { Footer } from "./_component/_footer/Footer";
import "./globals.css";

const metadataItems = {
  title: "Bitwarden CSV Converter",
  description:
    "Microsoft Authenticatorで取得したCSVをBitwarden対応形式のCSVに変換する非公式ツール",
};

export const metadata = {
  metadataBase: new URL("https://359fc7419b44.ngrok-free.app/"),
  title: metadataItems.title,
  description: metadataItems.description,
  keywords: [
    "Authenticator",
    "Bitwarden",
    "Converter",
    "CSV",
    "変換ツール",
    "非公式ツール",
    "CSV変換",
    "Bitwarden CSV",
    "Authenticator CSV",
  ],
  openGraph: {
    title: metadataItems.title,
    description: metadataItems.description,
    images: [
      {
        url: "/openGraph-image.png", // 🌟 静的画像の指定
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@w_a59",
    creator: "@w_a59",
    title: metadataItems.title,
    description: metadataItems.description,
    images: ["/twitter-image.png"],
  },
};

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
