import type { Metadata } from "next";
import { AuthProvider } from "@/modules/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pi Web V2",
    template: "%s | Pi Web V2",
  },
  description: "Pi financial operations web system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
