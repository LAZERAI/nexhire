"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle size={32} className="text-destructive" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        An unexpected error occurred. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all"
        >
          <RotateCcw size={18} /> Try Again
        </button>
        <Link 
          href="/" 
          className="px-6 py-2 bg-secondary text-foreground font-bold rounded-lg border border-border hover:bg-secondary/80 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
