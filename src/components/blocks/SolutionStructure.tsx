'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function SolutionStructure() {
  return (
    <div className="bg-[#f4f1ed] text-[#1a1a1a] font-sans selection:bg-primary selection:text-white pb-32">
      {/* Top Header Section */}
      <section className="pt-16 pb-12 px-6 max-w-7xl mx-auto border-b border-black/10">
        <div className="flex items-center gap-2 mb-12">
          <Icon icon="mdi:robot-industrial" className="w-8 h-8 text-primary" />
          <span className="text-xl font-black tracking-tighter uppercase italic">Innerflect</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
            Solution<br />Structure
          </h1>
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-60">We change how work gets done.</p>
            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-60">We design and build systems for reliable execution.</p>
          </div>
        </div>
      </section>

      {/* Context Grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 border border-black/10">
          <div className="bg-[#f4f1ed] p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Why This System Exists</h3>
            <div className="space-y-4">
              <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">
                Most companies:<br />
                • Use disconnected tools<br />
                • Rely on manual coordination<br />
                • Experiment with AI without structure
              </p>
              <div className="pt-4 border-t border-black/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Result:</p>
                <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed opacity-60 italic">
                  Inconsistency, Inefficiency, No Scalability
                </p>
              </div>
            </div>
            <div className="pt-4 flex justify-end">
               <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center opacity-30">
                 <Icon icon="mdi:close" className="w-5 h-5" />
               </div>
            </div>
          </div>

          <div className="bg-[#f4f1ed] p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">AI-Native Companies Are Different</h3>
            <div className="space-y-4">
              <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">
                • They operate through systems<br />
                • Decisions are structured<br />
                • Execution is coordinated
              </p>
            </div>
            <div className="pt-4 flex justify-end">
               <div className="w-10 h-10 rounded-full border border-primary/40 flex items-center justify-center text-primary">
                 <Icon icon="mdi:check" className="w-5 h-5" />
               </div>
            </div>
          </div>

          <div className="bg-[#f4f1ed] p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Core Principle</h3>
            <p className="text-[11px] font-medium leading-relaxed opacity-80">
              Every solution we deliver includes architecture and governance — even in small engagements.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 bg-black text-white flex items-center justify-center">
                  <Icon icon="mdi:view-grid" className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Local Architecture</p>
                  <p className="text-[9px] opacity-60">Defines how one system works (entry points)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 border border-black flex items-center justify-center">
                  <Icon icon="mdi:web" className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Global Architecture</p>
                  <p className="text-[9px] opacity-60">Defines how all systems work together</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f4f1ed] p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Without This:</h3>
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-black text-white flex items-center justify-center">
                  <Icon icon="mdi:link-variant-off" className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest">Systems Break</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full border border-black flex items-center justify-center">
                  <Icon icon="mdi:hubspot" className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest">AI Creates Chaos</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 border-b-4 border-black flex items-center justify-center">
                  <Icon icon="mdi:trending-down" className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest">Nothing Scales</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entry Points Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="relative mb-12 flex items-center justify-center">
          <div className="absolute inset-x-0 h-px bg-black/10" />
          <span className="relative bg-[#f4f1ed] px-8 text-[11px] font-black uppercase tracking-[0.4em] opacity-60 italic">Entry Points (System Sprints)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SprintCard 
            number="1"
            title="Website System Sprint"
            description="Turn your website into a working revenue system"
            youGet={[
              "Conversion-focused website",
              "Structured data capture",
              "Qualification logic (rules / AI)",
              "CRM + workflow integration",
              "First connected system"
            ]}
            useCases={[
              { label: "B2B lead generation", icon: "mdi:account-group" },
              { label: "SaaS landing page", icon: "mdi:monitor-dashboard" },
              { label: "Service business", icon: "mdi:briefcase" }
            ]}
            price="€6K - €12K"
          />
          <SprintCard 
            number="2"
            title="Communication System Foundation"
            description="Define how your company communicates — across humans and AI"
            youGet={[
              "Messaging system (value prop, structure)",
              "Tone and communication rules",
              "Content system across channels",
              "AI prompts/templates",
              "Coaching for internal use"
            ]}
            useCases={[
              { label: "Company scaling content", icon: "mdi:trending-up" },
              { label: "AI-generated consistency", icon: "mdi:robot" },
              { label: "Repositioning market message", icon: "mdi:bullseye-arrow" }
            ]}
            price="€4K - €10K"
          />
          <SprintCard 
            number="3"
            title="Revenue System Audit"
            description="Understand where revenue is leaking — and what to build next"
            youGet={[
              "Full revenue system map",
              "Bottleneck identification",
              "Opportunity prioritization",
              "AI Maturity Assessment",
              "Defined next system(s)",
              "Immediate action plan",
              "Coaching"
            ]}
            useCases={[
              { label: "Growth stagnation", icon: "mdi:alert-octagram" },
              { label: "Too many tools", icon: "mdi:hammer-screwdriver" },
              { label: "Scaling company losing efficiency", icon: "mdi:speedometer-slow" }
            ]}
            price="€4K - €8K"
          />
          <SprintCard 
            number="4"
            title="Agentic Workflow Sprint"
            description="Automate one critical workflow end-to-end"
            youGet={[
              "One fully optimized workflow",
              "Automation across tools",
              "AI-supported decisions",
              "Integrated execution logic"
            ]}
            useCases={[
              { label: "Lead follow-up automation", icon: "mdi:email-check" },
              { label: "Customer onboarding workflow", icon: "mdi:account-plus" },
              { label: "Outbound or support workflow", icon: "mdi:headset" }
            ]}
            price="€6K - €15K"
          />
        </div>
      </section>

      {/* Transformation Path Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto border-t border-black/10 mt-12">
        <div className="relative mb-16 flex items-center justify-center">
          <div className="absolute inset-x-0 h-px bg-black/10" />
          <span className="relative bg-[#f4f1ed] px-8 text-[11px] font-black uppercase tracking-[0.4em] opacity-60 italic text-center">Transformation Path (For companies ready to redesign how they operate)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {/* Connecting Arrows (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[30%] w-12 text-black/20">
            <Icon icon="mdi:arrow-right" className="w-8 h-8" />
          </div>
          <div className="hidden lg:block absolute top-12 left-[65%] w-12 text-black/20">
            <Icon icon="mdi:arrow-right" className="w-8 h-8" />
          </div>

          <PathStep 
            number="1"
            title="Architecture (Global)"
            subtitle="Why it matters: Without architecture, systems don't connect, AI cannot scale, complexity increases."
            youGet={[
              "Full system landscape",
              "Prioritization",
              "Governance model",
              "Scaling architecture",
              "Defined 1-3 systems"
            ]}
            price="€15K - €40K"
            icon="mdi:file-tree"
          />
          <PathStep 
            number="2"
            title="Implementation (System Build Cycles)"
            subtitle="Executed via Constrained System Sprints"
            youGet={[
              "1-3 full systems per cycle",
              "Integrated workflows",
              "AI-supported execution",
              "Connected system landscape"
            ]}
            price="€20K - €80K+"
            icon="mdi:cog"
          />
          <PathStep 
            number="3"
            title="Management (System Operations)"
            subtitle="Why it matters: Systems must evolve continuously"
            youGet={[
              "Monitoring",
              "Optimization",
              "Workflow improvements",
              "AI refinement",
              "Expansion into new systems"
            ]}
            price="€3K - €12K / month"
            icon="mdi:chart-timeline-variant"
          />
        </div>
      </section>

      {/* Recommended Packages */}
      <section className="py-12 px-6 max-w-7xl mx-auto border-t border-black/10 mt-12">
        <div className="relative mb-12 flex items-center justify-center">
          <div className="absolute inset-x-0 h-px bg-black/10" />
          <span className="relative bg-[#f4f1ed] px-8 text-[11px] font-black uppercase tracking-[0.4em] opacity-60 italic">Packages (Recommended Starting Points)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 border border-black/10">
          <PackageCard 
            title="Starter Package"
            items="Website System Sprint + Communication System Foundation"
            price="€10K - €18K"
            icon="mdi:rocket-launch"
          />
          <PackageCard 
            title="Growth Package"
            items="Revenue System Audit + 1 Agentic Workflow Sprint"
            price="€10K - €20K"
            icon="mdi:trending-up"
          />
          <PackageCard 
            title="Transformation Entry"
            items="Architecture + 1 Implementation Cycle"
            price="€30K - €90K"
            icon="mdi:domain"
          />
        </div>
      </section>

      {/* Footer Values */}
      <section className="py-12 px-6 max-w-7xl mx-auto border-t border-black/10 mt-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4 opacity-60">
             <Icon icon="mdi:sync" className="w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Systems Over Tools</span>
          </div>
          <div className="flex items-center gap-4 opacity-60">
             <Icon icon="mdi:web" className="w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-widest leading-tight">AI With Structure</span>
          </div>
          <div className="flex items-center gap-4 opacity-60">
             <Icon icon="mdi:vector-arrange-below" className="w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Execution That Scales</span>
          </div>
          <div className="flex items-center gap-4 opacity-60">
             <Icon icon="mdi:check-all" className="w-5 h-5" />
             <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Clear. Connected. Continuous.</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function SprintCard({ number, title, description, youGet, useCases, price }: any) {
  return (
    <div className="bg-white/50 backdrop-blur-sm p-8 flex flex-col h-full border border-black/5 hover:bg-white transition-all duration-500 group">
      <div className="flex items-start gap-4 mb-8">
        <div className="h-8 w-8 rounded-full bg-[#d9d4cc] text-black text-[10px] font-black flex items-center justify-center shrink-0">
          {number}
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black uppercase tracking-widest leading-tight group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-[10px] opacity-60 italic">{description}</p>
        </div>
      </div>

      <div className="flex-1 space-y-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">You get:</p>
          <ul className="space-y-2">
            {youGet.map((item: string, i: number) => (
              <li key={i} className="text-[10px] leading-tight flex items-start gap-2">
                <span className="opacity-30">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">Use cases:</p>
          <div className="space-y-3">
            {useCases.map((uc: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <Icon icon={uc.icon} className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all" />
                <span className="text-[10px] opacity-70 group-hover:opacity-100 transition-opacity">{uc.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-black/5">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-1">Price</p>
        <p className="text-sm font-black italic">{price}</p>
      </div>
    </div>
  );
}

function PathStep({ number, title, subtitle, youGet, price, icon }: any) {
  return (
    <div className="space-y-6 group">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-black text-white text-[12px] font-black flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
          {number}
        </div>
        <h4 className="text-lg font-black uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">{title}</h4>
      </div>
      
      <p className="text-[10px] opacity-60 font-medium leading-relaxed italic">{subtitle}</p>

      <div className="bg-white/40 p-6 space-y-6 border border-black/5 min-h-[250px] group-hover:bg-white/80 transition-all">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">You get:</p>
          <ul className="space-y-2">
            {youGet.map((item: string, i: number) => (
              <li key={i} className="text-[10px] leading-tight flex items-start gap-2">
                <span className="opacity-30">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end opacity-10 group-hover:opacity-30 transition-opacity">
           <Icon icon={icon} className="w-12 h-12" />
        </div>
      </div>

      <div className="pt-2 text-right">
        <p className="text-[9px] font-black uppercase tracking-widest opacity-20 mb-1">Price</p>
        <p className="text-xs font-black italic">{price}</p>
      </div>
    </div>
  );
}

function PackageCard({ title, items, price, icon }: any) {
  return (
    <div className="bg-[#f4f1ed] p-10 flex flex-col gap-6 group hover:bg-white transition-all duration-500">
      <div className="flex items-start gap-6">
        <div className="h-12 w-12 bg-black text-white flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
          <Icon icon={icon} className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-black uppercase tracking-widest leading-tight">{title}</h4>
          <p className="text-[10px] opacity-60 leading-tight pr-4">{items}</p>
        </div>
      </div>
      <div className="mt-auto">
        <p className="text-sm font-black italic">{price}</p>
      </div>
    </div>
  );
}
