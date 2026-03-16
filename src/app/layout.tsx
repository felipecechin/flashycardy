import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import { Button } from "@/components/ui/button";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Flashy Cardy",
  description: "Learn faster with smart flashcards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} antialiased`}>
        <ClerkProvider
          appearance={{
            theme: dark,
            variables: {
              fontFamily: "var(--font-poppins)",
            },
          }}
        >
          <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-white/6 bg-zinc-950/80 px-6 backdrop-blur-md">
            <span className="text-lg font-bold tracking-tight text-white">
              ⚡ Flashy Cardy
            </span>
            <div className="flex items-center gap-2">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-zinc-300 hover:text-white"
                  >
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    size="sm"
                    className="text-sm bg-violet-600 text-white hover:bg-violet-500 border-0 px-4"
                  >
                    Get started
                  </Button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
