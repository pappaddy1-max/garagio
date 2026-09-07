import type { Metadata } from "next";

import "./globals.css";

import {
  CartProvider,
} from "./components/CartContext";

export const metadata: Metadata = {
  title:
    "Garagio | Piese auto pentru mașina ta",

  description:
    "Găsește piese compatibile, kituri de revizie și servicii pentru mașina ta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}