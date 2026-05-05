import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

export type PipelineStage = {
  stage: string;
  count: number;
  color: string;
};

type ProjectPipelineGraphProps = {
  data?: PipelineStage[];
  height?: number;
};

export function ProjectPipelineGraph({ data = [], height = 200 }: ProjectPipelineGraphProps) {
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
    const margin = { top: 20, right: 100, bottom: 20, left: 100 };
    const yScale = d3.scaleBand().domain(data.map(d => d.stage)).range([margin.top, height - margin.bottom]).padding(0.2);
    const maxVal = d3.max(data, d => d.count) || 100;
    
    return { margin, yScale, maxVal };
  }, [data, width, height]);

  useEffect(() => {
    if (!svgRef.current || width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { yScale, margin, maxVal } = layout;

    const g = svg.append("g");

    const getX = (val: number) => {
      const w = (val / maxVal) * (width - margin.left - margin.right);
      return (width - w) / 2;
    };

    const getWidth = (val: number) => (val / maxVal) * (width - margin.left - margin.right);

    // Funnel Sections
    g.selectAll("polygon")
      .data(data.slice(0, -1))
      .join("polygon")
      .attr("points", (d, i) => {
        const next = data[i+1];
        const x1 = getX(d.count);
        const x2 = x1 + getWidth(d.count);
        const x3 = getX(next.count) + getWidth(next.count);
        const x4 = getX(next.count);
        const y1 = yScale(d.stage)! + yScale.bandwidth();
        const y2 = y1;
        const y3 = yScale(next.stage)!;
        const y4 = y3;
        return `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`;
      })
      .attr("fill", d => d.color)
      .attr("opacity", 0.15);

    // Rects
    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", d => getX(d.count))
      .attr("y", d => yScale(d.stage)!)
      .attr("width", d => getWidth(d.count))
      .attr("height", yScale.bandwidth())
      .attr("fill", d => d.color)
      .attr("opacity", 0.8);

    // Labels (Left)
    g.selectAll(".stage-label")
      .data(data)
      .join("text")
      .attr("class", "stage-label")
      .attr("x", d => getX(d.count) - 15)
      .attr("y", d => yScale(d.stage)! + yScale.bandwidth() / 2 + 5)
      .attr("text-anchor", "end")
      .text(d => d.stage)
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("fill", "currentColor")
      .attr("opacity", 0.8);

    // Counts (Right)
    g.selectAll(".count-label")
      .data(data)
      .join("text")
      .attr("class", "count-label")
      .attr("x", d => getX(d.count) + getWidth(d.count) + 15)
      .attr("y", d => yScale(d.stage)! + yScale.bandwidth() / 2 + 5)
      .text(d => `${d.count} Projects`)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "currentColor");

  }, [data, layout, width, height]);

  return (
    <div ref={hostRef} className="w-full h-full">
      <svg ref={svgRef} width={width} height={height} className="text-foreground" />
    </div>
  );
}

export default ProjectPipelineGraph;
