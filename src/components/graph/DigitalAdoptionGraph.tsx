import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { cn } from "@/lib/utils";

export type AdoptionPoint = {
  year: string;
  value: number;
};

export type AdoptionMetric = {
  title: string;
  value: string;
  data: readonly AdoptionPoint[];
  color?: string;
};

type AdoptionSectionProps = {
  metrics?: readonly AdoptionMetric[];
  title?: string;
  className?: string;
};

export default function DigitalAdoptionSection({
  metrics = [],
  title = "Operational Velocity",
  className
}: AdoptionSectionProps) {
  // If no metrics provided, use empty ones to show structure in library
  const displayMetrics = metrics.length > 0 ? metrics : [
    { title: "Adoption", value: "84%", data: [{ year: "1", value: 10 }, { year: "2", value: 40 }, { year: "3", value: 84 }], color: "hsl(var(--primary))" },
    { title: "Efficiency", value: "92%", data: [{ year: "1", value: 20 }, { year: "2", value: 50 }, { year: "3", value: 92 }], color: "hsl(var(--secondary))" },
    { title: "Retention", value: "78%", data: [{ year: "1", value: 30 }, { year: "2", value: 60 }, { year: "3", value: 78 }], color: "hsl(var(--accent))" },
    { title: "Growth", value: "12x", data: [{ year: "1", value: 5 }, { year: "2", value: 25 }, { year: "3", value: 65 }], color: "hsl(var(--muted-foreground))" }
  ];

  return (
    <section className={cn("py-24 px-6 bg-background", className)}>
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-primary">
              {title}
            </h2>
            <p className="text-muted-foreground font-medium text-lg uppercase tracking-widest opacity-80">
              Synchronized Performance Metrics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayMetrics.slice(0, 4).map((metric, i) => (
            <div
              key={i}
              className="bg-card/40 backdrop-blur-2xl rounded-xl p-8 space-y-6 border border-border/10 shadow-xl hover:bg-card/60 transition-all duration-300"
            >
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                  {metric.title}
                </div>
                <div className="text-4xl font-black tracking-tighter">
                  {metric.value}
                </div>
              </div>

              <div className="h-24 w-full">
                <DigitalAdoptionGraph data={metric.data} color={metric.color} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DigitalAdoptionGraph({ data = [], height = 100, color = "hsl(var(--primary))" }: { data: readonly AdoptionPoint[], height?: number, color?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new ResizeObserver((entries) => {
      const nextWidth = Math.floor(entries[0]?.contentRect.width ?? 0);
      setWidth(nextWidth);
    });

    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(() => {
    const margin = { top: 10, right: 10, bottom: 20, left: 10 };
    const xScale = d3.scalePoint().domain(data.map(d => d.year)).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.value) || 100]).range([height - margin.bottom, margin.top]);

    return { margin, xScale, yScale };
  }, [data, width, height]);

  useEffect(() => {
    if (!svgRef.current || width === 0) return;
    if (data.length === 0) {
      d3.select(svgRef.current).selectAll("*").remove();
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { xScale, yScale, margin } = layout;

    const area = d3.area<AdoptionPoint>()
      .x(d => xScale(d.year)!)
      .y0(height - margin.bottom)
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    const line = d3.line<AdoptionPoint>()
      .x(d => xScale(d.year)!)
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Gradient ID unique to this instance
    const gradId = `grad-${Math.random().toString(36).substr(2, 9)}`;

    const defs = svg.append("defs");
    const grad = defs.append("linearGradient")
      .attr("id", gradId)
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
    grad.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.4);
    grad.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0);

    // Area
    svg.append("path")
      .datum(data)
      .attr("d", area)
      .attr("fill", `url(#${gradId})`);

    const strokeColor = color.includes('hsl') ? color : `hsl(var(--primary))`;

    // Line
    svg.append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", strokeColor)
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round");

  }, [data, layout, width, height, color]);

  return (
    <div ref={hostRef} className="w-full h-full">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
}
