import "./globals.css";

export const metadata = {
  title: "CineWeb",
  description: "Catálogo moderno de filmes e séries"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
