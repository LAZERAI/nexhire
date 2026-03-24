import Link from "next/link";
import { Bot, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 animate-bounce">
        <Bot size={40} className="text-primary" />
      </div>
      <h1 className="text-5xl font-bold text-foreground mb-4">404</h1>
      <h2 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-10 text-lg">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        href="/" 
        className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
      >
        <Home size={20} /> Back to Homepage
      </Link>
    </div>
  );
}
