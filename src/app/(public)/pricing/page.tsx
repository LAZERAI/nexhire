import Link from "next/link";
import { ArrowLeft, Check, Sparkles, Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Invest in your future.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Transparent pricing for ambitious candidates and growing companies. No hidden fees.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Free Tier */}
          <PricingCard 
            title="Basic"
            price="₹0"
            period="/mo"
            description="Essential tools for job seekers starting their journey."
            icon={<User size={24} />}
            features={[
              "Create a professional profile",
              "5 AI Resume Scans per month",
              "Apply to unlimited jobs",
              "Access community feed",
              "Basic job alerts"
            ]}
            ctaText="Get Started Free"
            ctaLink="/signup"
          />

          {/* Pro Tier - Highlighted */}
          <PricingCard 
            title="Pro Candidate"
            price="₹499"
            period="/mo"
            description="For serious job seekers who want to stand out."
            icon={<Sparkles size={24} />}
            highlighted={true}
            features={[
              "Everything in Basic",
              "Unlimited AI Resume Scans",
              "Priority application status",
              "Detailed resume gap analysis",
              "Profile highlighted to recruiters",
              "Exclusive webinar access"
            ]}
            ctaText="Upgrade to Pro"
            ctaLink="/signup?plan=pro"
          />

          {/* Recruiter Tier */}
          <PricingCard 
            title="Recruiter"
            price="₹2,999"
            period="/mo"
            description="Powerful tools to find and hire the best talent."
            icon={<Building2 size={24} />}
            features={[
              "Post unlimited job listings",
              "AI Candidate Matching",
              "Access full candidate database",
              "Advanced analytics dashboard",
              "Team collaboration tools",
              "Dedicated support"
            ]}
            ctaText="Start Hiring"
            ctaLink="/signup?role=recruiter"
          />
        </div>

        <div className="mt-20 text-center">
          <p className="text-muted-foreground mb-4">Need a custom enterprise plan?</p>
          <Link href="mailto:sales@nexhire.com" className="text-primary font-bold hover:underline">
            Contact our Sales Team
          </Link>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ 
  title, 
  price, 
  period, 
  description, 
  icon, 
  features, 
  ctaText, 
  ctaLink, 
  highlighted = false 
}: any) {
  return (
    <div className={cn(
      "relative p-8 rounded-2xl border bg-card transition-all duration-300 flex flex-col h-full",
      highlighted 
        ? "border-primary shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-105 z-10" 
        : "border-border hover:border-primary/30 hover:shadow-lg"
    )}>
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
          highlighted ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
        )}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground min-h-[40px]">{description}</p>
      </div>

      <div className="mb-8">
        <span className="text-4xl font-bold text-foreground">{price}</span>
        <span className="text-muted-foreground font-medium">{period}</span>
      </div>

      <div className="space-y-4 mb-8 flex-1">
        {features.map((feature: string, i: number) => (
          <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
            <Check size={16} className={cn("mt-0.5 shrink-0", highlighted ? "text-primary" : "text-foreground")} />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <Link 
        href={ctaLink}
        className={cn(
          "w-full py-3 rounded-lg font-bold text-center transition-all",
          highlighted 
            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25" 
            : "bg-secondary text-foreground border border-border hover:bg-secondary/80"
        )}
      >
        {ctaText}
      </Link>
    </div>
  );
}
