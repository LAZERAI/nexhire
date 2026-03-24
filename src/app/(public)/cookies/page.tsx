import Link from "next/link";
import { ArrowLeft, Bot } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
        <Bot size={32} className="text-primary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">Coming Soon</h1>
      <p className="text-xl text-muted-foreground max-w-md mb-8">
        We're currently drafting this legal document to ensure your data is safe and secure.
      </p>
      <Link 
        href="/" 
        className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors font-medium"
      >
        <ArrowLeft size={18} /> Back to Home
      </Link>
    </div>
  );
}
