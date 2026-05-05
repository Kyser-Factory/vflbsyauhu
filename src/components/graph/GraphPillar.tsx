'use client';

import { cn } from "@/lib/utils";
import SectionFadeIn from "@/components/ui/section-fade-in";
import { ConstructBox } from "@/components/ui/construct-box";
import { DataInsightCard } from "./DataInsightCard";
import { BarGraph } from "./BarGraph";
import { DigitalAdoptionGraph } from "./DigitalAdoptionGraph";
import { PieChart } from "./PieChart";
import { TimeSeriesGraph } from "./TimeSeriesGraph";
import { Heatmap } from "./Heatmap";
import { DecisionGraph } from "./DecisionGraph";
import { AgentProcessGraph } from "./AgentProcessGraph";
import { MechanismFlowGraph } from "./MechanismFlowGraph";
import { ProjectPipelineGraph } from "./ProjectPipelineGraph";

interface GraphPillarProps {
  style?: 'pillar' | 'card';
  variant?: 'left' | 'right' | 'center';
  theme?: 'default' | 'industrial' | 'glass' | 'minimal';
  graphId: 'bar' | 'adoption' | 'pie' | 'time-series' | 'heatmap' | 'process' | 'decision' | 'flow' | 'funnel';
  title?: string;
  description?: string;
  data?: any;
  xLabels?: string[];
  yLabels?: string[];
  metrics?: any[];
  className?: string;
}

export default function GraphPillar({
  style = 'pillar',
  variant = 'left',
  theme = 'default',
  graphId = 'bar',
  title,
  description,
  data = [],
  xLabels = [],
  yLabels = [],
  metrics = [],
  className
}: GraphPillarProps) {
  
  const renderGraph = () => {
    const defaultColor = isIndustrial ? "hsl(var(--primary))" : "hsl(var(--primary))";
    
    switch (graphId) {
      case 'bar':
        return <BarGraph data={data} height={400} color="hsl(var(--primary))" />;
      case 'adoption':
        return <DigitalAdoptionGraph data={data} height={300} />;
      case 'pie':
        return <PieChart data={data} height={400} />;
      case 'time-series':
        return <TimeSeriesGraph data={data} height={400} color="hsl(var(--tertiary))" area />;
      case 'heatmap':
        return <Heatmap data={data} xLabels={xLabels} yLabels={yLabels} height={400} colorRange={["hsl(var(--muted))", "hsl(var(--quaternary))"]} />;
      case 'process':
        return <AgentProcessGraph steps={Array.isArray(data) ? data : []} compact />;
      case 'decision':
        return <DecisionGraph data={data} height={400} />;
      case 'flow':
        return <MechanismFlowGraph nodes={data.nodes} links={data.links} />;
      case 'funnel':
        return <ProjectPipelineGraph data={data} height={400} />;
      default:
        return <div className="p-12 border border-dashed border-border rounded-lg text-center text-muted-foreground uppercase font-black tracking-tighter">Graph Matrix Missing</div>;
    }
  };

  const isCenter = variant === 'center';
  const isRight = variant === 'right';
  const isIndustrial = theme === 'industrial';
  const isGlass = theme === 'glass';
  const isMinimal = theme === 'minimal';

  if (style === 'card') {
    return (
      <section className={cn(
        "py-24 px-6 relative overflow-hidden",
        isIndustrial ? "bg-black" : "bg-background",
        isMinimal && "py-12",
        className
      )}>
        {isIndustrial && <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />}
        <div className="max-w-6xl mx-auto">
          <DataInsightCard
            title={title}
            description={description}
            metrics={metrics}
            chartPosition={isRight ? 'right' : 'left'}
            className={cn(
              isIndustrial && "industrial-border",
              isGlass && "bg-white/5 backdrop-blur-xl border-white/10",
              isMinimal && "bg-transparent border-none shadow-none p-0"
            )}
          >
            {renderGraph()}
          </DataInsightCard>
        </div>
      </section>
    );
  }

  return (
    <section className={cn(
      "py-32 px-6 relative overflow-hidden",
      isIndustrial ? "bg-zinc-950 text-white" : "bg-background",
      isMinimal && "py-20",
      className
    )}>
      {isIndustrial && <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />}
      
      <div className={cn(
        "max-w-7xl mx-auto grid grid-cols-1 gap-16 items-center",
        isCenter ? "text-center" : "lg:grid-cols-2"
      )}>
        <div className={cn(
          "space-y-8",
          isRight && "lg:order-2",
          isCenter && "max-w-3xl mx-auto"
        )}>
          <SectionFadeIn distance={20}>
            <h2 className={cn(
              "text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] italic",
              isMinimal && "text-4xl md:text-6xl tracking-tight not-italic"
            )}>
              {title || "Operational Logic"}
            </h2>
          </SectionFadeIn>
          
          {description && (
            <SectionFadeIn delay={0.2} distance={10}>
              <p className={cn(
                "text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed italic",
                isMinimal && "text-lg md:text-xl not-italic"
              )}>
                {description}
              </p>
            </SectionFadeIn>
          )}

          {metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/10">
              {metrics.map((m, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary">{m.label}</div>
                  <div className="text-3xl font-black tracking-tighter uppercase">{m.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={cn(
          "relative min-h-[400px] flex items-center justify-center",
          isRight && "lg:order-1"
        )}>
          <ConstructBox className={cn(
            "w-full h-full p-4",
            isMinimal && "border-none bg-transparent shadow-none p-0"
          )}>
            {renderGraph()}
          </ConstructBox>
          
          {/* Decorative background element */}
          {!isMinimal && (
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 to-accent/5 blur-3xl -z-10 opacity-50" />
          )}
        </div>
      </div>
    </section>
  );
}
