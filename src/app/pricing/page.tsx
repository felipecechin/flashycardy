import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-28 pb-16 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Simple Pricing</h1>
        <p className="mt-3 text-muted-foreground text-lg">
          Choose the plan that works for you.
        </p>
      </div>
      <div className="w-full max-w-4xl">
        <PricingTable />
      </div>
    </main>
  );
}
