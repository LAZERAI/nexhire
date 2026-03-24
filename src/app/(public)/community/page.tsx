"use client";

import { useState } from "react";
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  MoreHorizontal,
  BadgeCheck,
  TrendingUp,
  Briefcase,
  Lightbulb,
  Newspaper,
  Plus,
  Heart,
  Flame,
  X,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CATEGORIES = ["All", "Hiring", "Career Tips", "Industry News"];

const SAMPLE_POSTS = [
  {
    id: "1",
    author: "Arjun Nair",
    role: "Senior Architect",
    reputation: "Expert",
    timestamp: "2h ago",
    title: "The rise of Rust in Kochi's Fintech scene",
    content: "Seeing a massive shift towards Rust for backend services in Infopark. Companies are prioritizing performance and safety over rapid iteration speed for core financial ledgers. If you're a C++ or Go dev, now is the time to pivot! We've seen a 40% increase in Rust job postings locally in the last quarter alone. The ecosystem is maturing rapidly with crates like Axum and Tokio becoming standard.",
    reactions: { like: 42, heart: 12, fire: 5, discuss: 8 },
    category: "Industry News",
    initials: "AN",
    color: "bg-orange-500/20 text-orange-500"
  },
  {
    id: "2",
    author: "Meera Krishnan",
    role: "HR Head @ Coderzon",
    reputation: "Hiring Manager",
    timestamp: "5h ago",
    title: "We're hiring 10+ AI Engineers in Kochi!",
    content: "Coderzon is expanding its AI division significantly. We're looking for passionate engineers who want to work on cutting-edge LLM applications and agentic workflows. We offer competitive salaries matched with Bangalore standards, hybrid work options, and a generous learning budget. Apply through the NexHire jobs board for priority review - we check those applications first!",
    reactions: { like: 89, heart: 45, fire: 20, discuss: 32 },
    category: "Hiring",
    initials: "MK",
    color: "bg-blue-500/20 text-blue-500"
  },
  {
    id: "3",
    author: "Rahul Varma",
    role: "Lead Developer",
    reputation: "Mentor",
    timestamp: "1d ago",
    title: "How to ace your Next.js 15 interviews",
    content: "With the release of Next.js 15, interviewers are looking for deep understanding of Server Actions, partial prerendering, and the new caching semantics. Don't just follow tutorials—understand the 'why' behind the architecture. Be prepared to explain the difference between Server Components and Client Components in depth, and how hydration works. Pro tip: Build a small project using the new `use` hook to demonstrate you're up to date.",
    reactions: { like: 156, heart: 80, fire: 60, discuss: 15 },
    category: "Career Tips",
    initials: "RV",
    color: "bg-green-500/20 text-green-500"
  },
  {
    id: "4",
    author: "Anjali Menon",
    role: "Product Designer",
    reputation: "Rising Star",
    timestamp: "1d ago",
    title: "Digital transformation in Kerala government sectors",
    content: "Exciting projects coming up in the public sector. The focus on UI/UX is finally getting the attention it deserves with the new K-Smart initiative. Great opportunities for local designers to make a real impact on citizen services. We're moving away from clunky, bureaucratic interfaces to modern, accessible design systems. It's a huge challenge but incredibly rewarding.",
    reactions: { like: 34, heart: 10, fire: 2, discuss: 5 },
    category: "Industry News",
    initials: "AM",
    color: "bg-purple-500/20 text-purple-500"
  },
  {
    id: "5",
    author: "Siddharth Das",
    role: "Full Stack Dev",
    reputation: "Top Contributor",
    timestamp: "2d ago",
    title: "Remote work vs. Kochi office culture",
    content: "After 3 years of fully remote work, I visited a coworking space in SmartCity yesterday. The energy was infectious! While I love the freedom of remote, I realized I missed the whiteboard sessions and casual coffee chats. Hybrid seems to be the sweet spot for Kerala's tech community right now. What's your preference? Are you team Remote, Office, or Hybrid?",
    reactions: { like: 67, heart: 20, fire: 15, discuss: 45 },
    category: "Career Tips",
    initials: "SD",
    color: "bg-yellow-500/20 text-yellow-500"
  },
  {
    id: "6",
    author: "Priya Lakshmi",
    role: "Technical Recruiter",
    reputation: "Recruiter",
    timestamp: "3d ago",
    title: "Top 5 skills for 2026 graduates",
    content: "Beyond just coding, hiring managers are looking for: 1. AI Tooling proficiency (Cursor, Copilot), 2. Systems thinking and architecture basics, 3. Soft skills and communication, 4. Cloud-native architecture (AWS/Azure), 5. Open source contributions. A GitHub profile with real commits beats a polished resume every single time.",
    reactions: { like: 210, heart: 100, fire: 50, discuss: 28 },
    category: "Career Tips",
    initials: "PL",
    color: "bg-pink-500/20 text-pink-500"
  },
  {
    id: "7",
    author: "David John",
    role: "CTO @ TechWave",
    reputation: "Executive",
    timestamp: "4d ago",
    title: "Why we chose Kochi for our new R&D center",
    content: "Many asked why we picked Kochi over Bangalore or Hyderabad. The answer is simple: Talent retention and quality of life. The talent pool here is incredibly loyal and eager to learn. Plus, the infrastructure in Infopark is world-class without the crushing traffic. We're bullish on Kerala's tech future and are investing heavily in local partnerships.",
    reactions: { like: 340, heart: 150, fire: 80, discuss: 60 },
    category: "Industry News",
    initials: "DJ",
    color: "bg-indigo-500/20 text-indigo-500"
  },
  {
    id: "8",
    author: "Fatima Bi",
    role: "DevRel Engineer",
    reputation: "Community Lead",
    timestamp: "5d ago",
    title: "KochiFOSS 2026 was a blast!",
    content: "Just recovered from an amazing weekend at KochiFOSS. Over 500 attendees, 20+ talks, and endless networking. The highlight was definitely the workshop on building decentralized social networks. If you missed it, we'll be uploading the recordings to our YouTube channel next week. Huge shoutout to the volunteers who made it happen!",
    reactions: { like: 120, heart: 60, fire: 40, discuss: 12 },
    category: "Industry News",
    initials: "FB",
    color: "bg-teal-500/20 text-teal-500"
  },
  {
    id: "9",
    author: "Kiran Thomas",
    role: "Freelance Developer",
    reputation: "Pro",
    timestamp: "6d ago",
    title: "Freelancing rates in 2026: A reality check",
    content: "Don't undervalue yourself! I see too many local devs charging 2020 rates. Inflation is real, and your skills are valuable. For a senior React dev, you should be charging at least $40-$60/hr for international clients. Don't compete on price; compete on quality and reliability. Let's lift the whole market up together.",
    reactions: { like: 180, heart: 40, fire: 90, discuss: 55 },
    category: "Career Tips",
    initials: "KT",
    color: "bg-cyan-500/20 text-cyan-500"
  },
  {
    id: "10",
    author: "Software Solutions Inc.",
    role: "Company Page",
    reputation: "Verified Company",
    timestamp: "1w ago",
    title: "Walk-in Drive: Java Developers (2-5 Yrs)",
    content: "We are conducting a walk-in drive this Saturday at our Geo Infopark office. Positions open for Java Spring Boot developers with Microservices experience. Bring your updated resume and a valid ID proof. On-spot offer rollout for selected candidates! Check our careers page for the full JD.",
    reactions: { like: 95, heart: 10, fire: 5, discuss: 40 },
    category: "Hiring",
    initials: "SS",
    color: "bg-red-500/20 text-red-500"
  }
];

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<typeof SAMPLE_POSTS[0] | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userReactions, setUserReactions] = useState<Record<string, string[]>>({});

  const toggleReaction = (postId: string, type: string) => {
    setUserReactions(prev => {
      const postReactions = prev[postId] || [];
      if (postReactions.includes(type)) {
        return { ...prev, [postId]: postReactions.filter(r => r !== type) };
      }
      return { ...prev, [postId]: [...postReactions, type] };
    });
  };

  const filteredPosts = SAMPLE_POSTS.filter(post => 
    activeCategory === "All" || post.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">Community</h1>
            <p className="text-muted-foreground">Share insights and grow with the Kerala tech network.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <Plus size={20} />
            <span>Create Post</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border shrink-0",
                activeCategory === cat 
                  ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                  : "bg-card border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {filteredPosts.map(post => (
            <article 
              key={post.id} 
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/20 transition-all group cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full border border-border flex items-center justify-center font-bold text-lg shrink-0",
                    post.color
                  )}>
                    {post.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-foreground hover:underline">{post.author}</span>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary border border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <BadgeCheck size={10} className="text-primary" />
                        {post.reputation}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">
                      {post.role} • {post.timestamp}
                    </div>
                  </div>
                </div>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="mb-4">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/5 text-primary text-[10px] font-bold uppercase border border-primary/10 mb-3">
                  {getCategoryIcon(post.category)}
                  {post.category}
                </div>
                <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed line-clamp-2">
                  {post.content}
                </p>
                <span className="text-primary text-sm font-medium mt-1 inline-block hover:underline">Read more</span>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-4">
                  <ReactionButton 
                    icon={<ThumbsUp size={18} />} 
                    count={post.reactions.like} 
                    active={userReactions[post.id]?.includes('like')} 
                    onClick={() => toggleReaction(post.id, 'like')}
                    label="Like"
                  />
                  <ReactionButton 
                    icon={<Heart size={18} />} 
                    count={post.reactions.heart} 
                    active={userReactions[post.id]?.includes('heart')} 
                    onClick={() => toggleReaction(post.id, 'heart')}
                    label="Insightful"
                  />
                  <ReactionButton 
                    icon={<Flame size={18} />} 
                    count={post.reactions.fire} 
                    active={userReactions[post.id]?.includes('fire')} 
                    onClick={() => toggleReaction(post.id, 'fire')}
                    label="Fire"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-secondary">
                    <MessageSquare size={18} />
                    <span>{post.reactions.discuss}</span>
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-primary transition-colors rounded hover:bg-secondary">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <Users size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-foreground mb-2">No posts yet in this category</h3>
            <p className="text-muted-foreground">Be the first to share something with the community!</p>
          </div>
        )}
      </div>

      {/* Full Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedPost(null)}>
          <div className="bg-background border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={cn(
                  "w-14 h-14 rounded-full border border-border flex items-center justify-center font-bold text-xl shrink-0",
                  selectedPost.color
                )}>
                  {selectedPost.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg text-foreground">{selectedPost.author}</span>
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary border border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <BadgeCheck size={12} className="text-primary" />
                      {selectedPost.reputation}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{selectedPost.role} • {selectedPost.timestamp}</div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-4">{selectedPost.title}</h2>
              <div className="text-muted-foreground leading-relaxed text-lg mb-8 whitespace-pre-wrap">
                {selectedPost.content}
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <MessageSquare size={18} /> Discussion ({selectedPost.reactions.discuss})
                </h3>
                <div className="bg-secondary/20 rounded-xl p-8 text-center border border-border border-dashed">
                  <p className="text-muted-foreground mb-4">Sign in to join the conversation.</p>
                  <Link href="/login" className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all inline-block">
                    Log In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowCreateModal(false)}>
          <div className="bg-background border border-border w-full max-w-md rounded-2xl shadow-2xl p-8 text-center relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Lock size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to Post</h2>
            <p className="text-muted-foreground mb-8">
              Join the conversation! You need an account to create posts and engage with the community.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all">
                Log In
              </Link>
              <Link href="/signup" className="w-full py-3 bg-secondary text-foreground font-bold rounded-lg border border-border hover:bg-secondary/80 transition-all">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReactionButton({ icon, count, active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium transition-all px-2 py-1 rounded hover:bg-secondary",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
      title={label}
    >
      {icon}
      <span>{count + (active ? 1 : 0)}</span>
    </button>
  );
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "Hiring": return <Briefcase size={10} />;
    case "Career Tips": return <Lightbulb size={10} />;
    case "Industry News": return <TrendingUp size={10} />;
    default: return <Newspaper size={10} />;
  }
}
