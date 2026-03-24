import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">FlashyCardy</h1>
      <p className="text-lg text-muted-foreground">Your personal flashcard platform</p>
      <div className="mt-2 flex gap-3">
        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
          <Button variant="outline" className="cursor-pointer">Sign In</Button>
        </SignInButton>
        <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
          <Button className="cursor-pointer">Sign Up</Button>
        </SignUpButton>
      </div>
    </div>
  );
}
