import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leaders Note",
  description: "Leaders Note SpinX",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="flex min-h-screen">
            <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
