import { SignInButton, SignUpButton, Show } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950">
      {/* Gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-700/25 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-700/20 blur-[100px]" />
        <div className="absolute right-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-fuchsia-700/15 blur-[80px]" />
      </div>

      {/* Decorative floating cards */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[7%] top-[22%] h-28 w-20 rotate-[-18deg] rounded-xl border border-white/10 bg-linear-to-br from-violet-500/20 to-indigo-500/10 shadow-lg backdrop-blur-sm" />
        <div className="absolute right-[9%] top-[18%] h-24 w-36 rotate-14 rounded-xl border border-white/10 bg-linear-to-br from-indigo-500/20 to-purple-500/10 shadow-lg backdrop-blur-sm" />
        <div className="absolute bottom-[24%] left-[11%] h-20 w-32 rotate-[8deg] rounded-xl border border-white/10 bg-linear-to-br from-fuchsia-500/15 to-violet-500/10 shadow-lg backdrop-blur-sm" />
        <div className="absolute bottom-[20%] right-[7%] h-28 w-20 -rotate-12 rounded-xl border border-white/10 bg-linear-to-br from-purple-500/20 to-indigo-500/10 shadow-lg backdrop-blur-sm" />
        <div className="absolute left-[20%] top-[60%] h-16 w-24 rotate-6 rounded-xl border border-white/10 bg-linear-to-br from-violet-400/10 to-fuchsia-400/10 shadow-lg backdrop-blur-sm" />
        <div className="absolute right-[18%] top-[55%] h-16 w-20 rotate-[-8deg] rounded-xl border border-white/10 bg-linear-to-br from-indigo-400/10 to-violet-400/10 shadow-lg backdrop-blur-sm" />
      </div>

      {/* Hero content */}
      <div className="relative flex flex-col items-center gap-6 px-6 pt-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
          ✨ Welcome to Flashy Cardy
        </div>

        {/* Title */}
        <h1 className="bg-linear-to-b from-white to-zinc-400 bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl">
          ⚡ Flashy Cardy
        </h1>

        {/* Tagline */}
        <p className="max-w-xs text-base text-zinc-500 sm:text-lg">
          Learn faster with smart flashcards.
        </p>

        {/* CTAs — shown when signed out */}
        <Show when="signed-out">
          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="h-11 cursor-pointer px-8 text-base bg-violet-600 text-white hover:bg-violet-500 border-0 shadow-lg shadow-violet-900/40"
              >
                Get started
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button
                size="lg"
                variant="outline"
                className="h-11 cursor-pointer px-8 text-base text-zinc-300 hover:text-white"
              >
                I already have an account
              </Button>
            </SignInButton>
          </div>
        </Show>

        {/* CTA — shown when signed in */}
        <Show when="signed-in">
          <Button
            size="lg"
            className="mt-2 h-11 px-8 text-base bg-violet-600 text-white hover:bg-violet-500 border-0 shadow-lg shadow-violet-900/40"
          >
            Go to dashboard →
          </Button>
        </Show>
      </div>
    </div>
  );
}
