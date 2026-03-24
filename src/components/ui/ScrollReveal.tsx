"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function ScrollReveal({ 
  children, 
  className,
  threshold = 0.1,
  delay = 0 
}: { 
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);

  return (
    <div 
      ref={ref} 
      className={cn(
        "reveal-on-scroll", 
        isVisible ? "is-visible" : "",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
