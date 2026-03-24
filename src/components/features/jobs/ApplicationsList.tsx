"use client";

import { useState } from "react";
import { Briefcase, Calendar, Building2, ChevronRight, XCircle, CheckCircle2, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Application = {
  id: string;
  status: string;
  created_at: string;
  jobs: {
    title: string;
    location: string;
    companies: {
      name: string;
      logo_url: string | null;
    };
  };
};

const TABS = ["All", "Applied", "In Review", "Interview", "Hired", "Rejected"];

export default function ApplicationsList({ applications }: { applications: Application[] }) {
  const [activeTab, setActiveTab] = useState("All");

  const filteredApps = applications.filter(app => {
    if (activeTab === "All") return true;
    
    const status = app.status.toLowerCase();
    switch (activeTab) {
      case "Applied": return status === "pending" || status === "applied";
      case "In Review": return status === "reviewing" || status === "in-review";
      case "Interview": return status === "interviewing" || status === "interview";
      case "Hired": return status === "hired" || status === "offer";
      case "Rejected": return status === "rejected";
      default: return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "hired": 
      case "offer": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "interviewing": 
      case "interview": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "reviewing": 
      case "in-review": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "hired":
      case "offer": return <CheckCircle2 size={14} />;
      case "rejected": return <XCircle size={14} />;
      case "interviewing": 
      case "interview": return <Briefcase size={14} />;
      case "reviewing": 
      case "in-review": return <Eye size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border",
              activeTab === tab 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => (
            <div key={app.id} className="group p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0 font-bold text-lg text-primary">
                  {app.jobs.companies.logo_url ? (
                    <img src={app.jobs.companies.logo_url} alt={app.jobs.companies.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    app.jobs.companies.name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                    {app.jobs.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Building2 size={14} /> {app.jobs.companies.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> Applied {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider",
                  getStatusColor(app.status)
                )}>
                  {getStatusIcon(app.status)}
                  {formatStatus(app.status)}
                </div>
                <Link 
                  href={`/jobs/${app.jobs.title}`} 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-bold text-foreground transition-colors"
                >
                  View Job <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-secondary/5">
            <Briefcase size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-foreground mb-2">No applications found</h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === "All" 
                ? "You haven't applied to any jobs yet." 
                : `No applications with status "${activeTab}".`}
            </p>
            <Link href="/jobs" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all">
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
