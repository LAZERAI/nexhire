"use client";

import { useState } from "react";
import Link from "next/link";
import { signup, signInWithGoogle } from "../actions";
import { Bot, Mail, Lock, User, ArrowRight, Briefcase, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-110 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Bot size={24} className="text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">NexHire</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create an account</h1>
          <p className="text-muted-foreground">Join the future of recruitment</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <form action={signup} className="space-y-6">
            <input type="hidden" name="role" value={role} />
            
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setRole("candidate")}
                className={cn(
                  "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                  role === "candidate" 
                    ? "bg-primary/10 border-primary text-primary ring-1 ring-primary" 
                    : "bg-background border-input text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <User size={24} />
                <span className="text-xs font-bold uppercase tracking-wider">Candidate</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={cn(
                  "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
                  role === "recruiter" 
                    ? "bg-primary/10 border-primary text-primary ring-1 ring-primary" 
                    : "bg-background border-input text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Briefcase size={24} />
                <span className="text-xs font-bold uppercase tracking-wider">Recruiter</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="full_name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
            </div>

            {searchParams.error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
                {searchParams.error}
              </div>
            )}

            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              Sign Up <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <form action={signInWithGoogle}>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-full">
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Google
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
