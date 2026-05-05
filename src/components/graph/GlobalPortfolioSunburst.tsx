import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export type SunburstNode = {
  name: string;
  targetId?: string;
  sectionId?: string;
  value?: number;
  children?: SunburstNode[];
  color?: string;
};

type GlobalPortfolioSunburstProps = {
  data?: SunburstNode;
  height?: number;
};

const FLAG_MAP: Record<string, string> = {
  "Singapore": "https://flagcdn.com/w320/sg.png",
  "Indonesia": "https://flagcdn.com/w320/id.png",
  "Thailand & Malaysia": "https://flagcdn.com/w320/th.png",
  "Japan & Korea": "https://flagcdn.com/w320/jp.png",
  "Australia": "https://flagcdn.com/w320/au.png",
  "Europe & UK": "https://flagcdn.com/w320/eu.png"
};

const SECTOR_IMAGE_MAP: Record<string, string> = {
  "Hotels & Spas": "/assets/sales/hospitality_premium.png",
  "Travel": "/assets/sales/hospitality_premium.png",
  "Institutional": "/assets/sales/institutional_premium.png",
  "Manufacturing": "/assets/sales/manufacturing_premium.png",
  "Construction": "/assets/sales/construction_premium.png",
  "Events": "/assets/sales/events_premium.png",
  "Marketplaces": "/assets/sales/events_premium.png"
};

const CATEGORY_ICON_MAP: Record<string, string> = {
  "Infrastructure": "https://api.iconify.design/mdi:office-building.svg?color=white",
  "Service": "https://api.iconify.design/mdi:account-group.svg?color=white"
};

function getTargetLabel(targetId?: string | null) {
  if (!targetId) return "Target";
  return targetId
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function GlobalPortfolioSunburst({ data = { name: "Root" }, height = 700 }: GlobalPortfolioSunburstProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!svgRef.current || width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");

    // Flags for depth 1
    Object.entries(FLAG_MAP).forEach(([name, url]) => {
      const patternId = `flag-${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
      const pattern = defs.append("pattern")
        .attr("id", patternId)
        .attr("patternUnits", "objectBoundingBox")
        .attr("width", 1)
        .attr("height", 1);
      
      pattern.append("image")
        .attr("href", url)
        .attr("width", 200)
        .attr("height", 120)
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("opacity", 0.4);
    });

    // Sector Images for depth 3
    Object.entries(SECTOR_IMAGE_MAP).forEach(([name, url]) => {
      const patternId = `sector-${name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
      const pattern = defs.append("pattern")
        .attr("id", patternId)
        .attr("patternUnits", "objectBoundingBox")
        .attr("width", 1)
        .attr("height", 1);
      
      pattern.append("image")
        .attr("href", url)
        .attr("width", 300)
        .attr("height", 200)
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("opacity", 0.3);
    });

    const radius = Math.min(width, height) / 2;
    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const partition = d3.partition<SunburstNode>()
      .size([2 * Math.PI, radius]);

    const root = d3.hierarchy(data)
      .sum(d => d.value || 1)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    root.each((d: any) => {
      d.id = d.ancestors().reverse().map((a: any) => a.data.name).join("/");
    });

    partition(root);

    const arc = d3.arc<d3.HierarchyRectangularNode<SunburstNode>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius / 2)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1 - 1);

    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, root.children?.length || 10));
    const tooltip = d3.select(tooltipRef.current);

    const visualGroup = g.append("g").attr("class", "visual-segments");
    const categoryIconGroup = g.append("g").attr("class", "category-icons");
    const leafIconGroup = g.append("g").attr("class", "leaf-icons");
    const hitGroup = g.append("g").attr("class", "hit-areas");

    // Create clip-paths for target leaves
    root.descendants().filter(d => d.depth === 4).forEach((d: any, i) => {
      defs.append("clipPath")
        .attr("id", `clip-${i}`)
        .append("path")
        .attr("d", arc(d as any));
    });

    const visualPaths = visualGroup.selectAll("path")
      .data(root.descendants().filter(d => d.depth > 0))
      .join("path")
      .attr("fill", (d: any) => {
        if (d.depth === 1) {
          const patternId = `flag-${d.data.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
          if (FLAG_MAP[d.data.name]) return `url(#${patternId})`;
          return color(d.data.name);
        }
        if (d.depth === 3) {
          const patternId = `sector-${d.data.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
          if (SECTOR_IMAGE_MAP[d.data.name]) return `url(#${patternId})`;
        }
        const baseColor = d.depth === 2 ? color(d.parent.data.name) : d.depth === 3 ? color(d.parent.parent.data.name) : color(d.parent.parent.parent.data.name);
        return d3.interpolateRgb(baseColor, "hsl(var(--background))")(d.depth === 4 ? 0.5 : d.depth === 3 ? 0.3 : 0.1);
      })
      .attr("fill-opacity", d => (d.depth === 1 ? 0.9 : d.depth === 3 ? 0.6 : 0.4))
      .attr("stroke", "hsl(var(--background))")
      .attr("stroke-width", 0.5)
      .attr("stroke-opacity", 0.1)
      .attr("d", arc as any);

    // Render Category Icons (depth 2)
    const catIcons = categoryIconGroup.selectAll("image")
      .data(root.descendants().filter(d => d.depth === 2))
      .join("image")
      .attr("xlink:href", (d: any) => CATEGORY_ICON_MAP[d.data.name] || null)
      .attr("width", 24)
      .attr("height", 24)
      .attr("x", (d: any) => arc.centroid(d as any)[0] - 12)
      .attr("y", (d: any) => arc.centroid(d as any)[1] - 12)
      .attr("pointer-events", "none")
      .attr("opacity", 0.8)
      .attr("class", "category-icon");

    // Render Leaf Icons (depth 4)
    const leafIcons = leafIconGroup.selectAll("image")
      .data(root.descendants().filter(d => d.depth === 4))
      .join("image")
      .attr("xlink:href", (d: any) => {
        return null;
      })
      .attr("width", 32)
      .attr("height", 32)
      .attr("x", (d: any) => arc.centroid(d as any)[0] - 16)
      .attr("y", (d: any) => arc.centroid(d as any)[1] - 16)
      .attr("clip-path", (_d: any, i) => `url(#clip-${i})`)
      .attr("pointer-events", "none")
      .attr("opacity", 0.95)
      .attr("class", "leaf-brand-icon");

    hitGroup.selectAll("path")
      .data(root.descendants().filter(d => d.depth > 0))
      .join("path")
      .attr("d", arc as any)
      .attr("fill", "transparent")
      .style("cursor", "crosshair")
      .on("mouseenter", function(_event, d: any) {
        const offset = 25;
        const descendants = d.descendants();
        const descendantIds = new Set(descendants.map((desc: any) => desc.id));
        const angle = (d.x0 + d.x1) / 2;
        const tx = Math.sin(angle) * offset;
        const ty = -Math.cos(angle) * offset;

        visualPaths.filter((node: any) => descendantIds.has(node.id))
          .interrupt()
          .transition()
          .duration(350)
          .ease(d3.easeCubicOut)
          .attr("transform", `translate(${tx},${ty})`)
          .attr("fill-opacity", 0.95);

        catIcons.filter((node: any) => descendantIds.has(node.id))
          .interrupt()
          .transition()
          .duration(350)
          .ease(d3.easeCubicOut)
          .attr("transform", `translate(${tx},${ty})`)
          .attr("opacity", 1);

        leafIcons.filter((node: any) => descendantIds.has(node.id))
          .interrupt()
          .transition()
          .duration(350)
          .ease(d3.easeCubicOut)
          .attr("transform", `translate(${tx},${ty})`)
          .attr("opacity", 1);

        const label = d.depth === 1 ? 'REGION' : d.depth === 2 ? 'CATEGORY' : d.depth === 3 ? 'SECTOR' : 'TARGET';
        
        if (d.depth === 4 && d.data.targetId) {
          const targetTitle = getTargetLabel(d.data.targetId);

          tooltip
            .style("opacity", 1)
            .style("width", "620px")
            .html(`
              <div class="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
                <div class="border-b border-border bg-muted/50 p-4">
                  <div class="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80 mb-1">Target Profile</div>
                  <div class="text-base font-bold leading-tight text-foreground uppercase tracking-tight truncate">${targetTitle}</div>
                </div>
                <div class="p-4">
                  <div class="rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
                    ${getTargetLabel(d.data.targetId)}
                  </div>
                </div>
              </div>
            `);
          return;
        }

        tooltip
          .style("opacity", 1)
          .style("width", "auto")
          .html(`
            <div class="space-y-1 min-w-[140px] bg-card p-4 rounded-xl border border-border shadow-xl">
              <div class="text-[11px] font-bold uppercase tracking-widest text-primary/80">${label}</div>
              <div class="text-sm font-bold text-foreground uppercase">${d.data.name}</div>
              ${d.children ? `<div class="text-[11px] text-muted-foreground uppercase font-medium">Nodes: ${d.descendants().length - 1}</div>` : ''}
              ${d.data.sectionId ? `<div class="text-[11px] text-primary/60 uppercase font-bold mt-1">Click to Navigate</div>` : ''}
            </div>
          `);
      })
      .on("mousemove", function() {
        const tooltipNode = tooltip.node() as HTMLElement;
        const tooltipWidth = tooltipNode.offsetWidth;
        const tooltipHeight = tooltipNode.offsetHeight;

        const x = Math.max(24, Math.floor((window.innerWidth - tooltipWidth) / 2));
        const y = Math.max(24, Math.floor((window.innerHeight - tooltipHeight) / 2));

        tooltip
          .style("left", x + "px")
          .style("top", y + "px");
      })
      .on("click", function(_event, d: any) {
        if (d.data.sectionId) {
          const element = document.getElementById(d.data.sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
      })
      .on("mouseleave", function(_event, d: any) {
        const descendants = d.descendants();
        const descendantIds = new Set(descendants.map((desc: any) => desc.id));

        visualPaths.filter((node: any) => descendantIds.has(node.id))
          .interrupt()
          .transition()
          .duration(250)
          .ease(d3.easeCubicIn)
          .attr("transform", "translate(0,0)")
          .attr("fill-opacity", (node: any) => node.depth === 1 ? 0.9 : node.depth === 3 ? 0.6 : 0.4);

        catIcons.filter((node: any) => descendantIds.has(node.id))
          .interrupt()
          .transition()
          .duration(250)
          .ease(d3.easeCubicIn)
          .attr("transform", "translate(0,0)")
          .attr("opacity", 0.8);

        leafIcons.filter((node: any) => descendantIds.has(node.id))
          .interrupt()
          .transition()
          .duration(250)
          .ease(d3.easeCubicIn)
          .attr("transform", "translate(0,0)")
          .attr("opacity", 0.95);

        tooltip.style("opacity", 0);
      });

  }, [data, width, height]);

  return (
    <div ref={hostRef} className="w-full h-full relative overflow-visible">
      <svg ref={svgRef} width={width} height={height} className="overflow-visible" />
      <div 
        ref={tooltipRef} 
        className="fixed pointer-events-none opacity-0 bg-transparent z-[9999] transition-opacity duration-200"
        style={{ transform: 'translate3d(0,0,0)' }}
      />
    </div>
  );
}
