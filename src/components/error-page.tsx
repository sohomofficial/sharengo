import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  return (
    <main className="min-h-screen place-content-center">
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h2 className="mb-6 text-5xl font-semibold">Whoops!</h2>
        <h3 className="mb-1.5 text-3xl font-semibold">Something went wrong</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          The room you&apos;re looking for isn&apos;t found, we suggest you back
          to home.
        </p>
        <Button size="lg" className="rounded-lg text-base shadow-sm" asChild>
          <Link href="/">Back to home page</Link>
        </Button>
      </div>
    </main>
  );
}
