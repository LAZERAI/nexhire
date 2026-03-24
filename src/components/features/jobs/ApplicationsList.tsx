"use client";

import { useState } from "react";
import { Briefcase, Calendar, Building2, ChevronRight, XCircle, CheckCircle2, Clock } from "lucide-react";
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

const TABS = ["All", "Active", "Hired", "Rejected"];

export default function ApplicationsList({ applications }: { applications: Application[] }) {
  const [activeTab, setActiveTab] = useState("All");

  const filteredApps = applications.filter(app => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return ["pending", "interviewing"].includes(app.status);
    return app.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hired": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "interviewing": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "hired": return <CheckCircle2 size={14} />;
      case "rejected": return <XCircle size={14} />;
      case "interviewing": return <Briefcase size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
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
            <div key={app.id} className="group p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary border border-border flex items-center justify-center shrink-0">
                  <Building2 size={24} className="text-muted-foreground" />
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
                  {app.status}
                </div>
                <Link href={`/jobs/${app.jobs.title}`} className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronRight size={20} />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-secondary/5">
            <Briefcase size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-foreground mb-2">No applications found</h3>
            <p className="text-muted-foreground mb-6">You haven't applied to any {activeTab !== "All" ? activeTab.toLowerCase() : ""} jobs yet.</p>
            <Link href="/jobs" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all">
              Find Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
