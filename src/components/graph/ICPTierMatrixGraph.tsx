import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

export type TierDataPoint = {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
};

type ICPTierMatrixGraphProps = {
  data?: TierDataPoint[];
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
};

export function ICPTierMatrixGraph({
  data = [],
  height = 240,
  xAxisLabel = "Operational Chaos ->",
  yAxisLabel = "Revenue Potential <-",
}: ICPTierMatrixGraphProps) {
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
    const margin = { top: 40, right: 100, bottom: 50, left: 60 };
    const xScale = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);

    return { margin, xScale, yScale };
  }, [width, height]);

  useEffect(() => {
    if (!svgRef.current || width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (data.length === 0) {
      return;
    }

    const { xScale, yScale, margin } = layout;

    svg
      .append("line")
      .attr("x1", margin.left)
      .attr("y1", height - margin.bottom)
      .attr("x2", width - margin.right)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "currentColor")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.2);

    svg
      .append("line")
      .attr("x1", margin.left)
      .attr("y1", margin.top)
      .attr("x2", margin.left)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "currentColor")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.2);

    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 0)
      .attr("fill", (d) => d.color)
      .attr("stroke", "rgba(255,255,255,0.3)")
      .attr("stroke-width", 1)
      .transition()
      .duration(800)
      .attr("r", 10);

    svg
      .selectAll(".target-label")
      .data(data)
      .join("text")
      .attr("class", "target-label")
      .attr("x", (d) => xScale(d.x) + 14)
      .attr("y", (d) => yScale(d.y) + 5)
      .text((d) => d.id)
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("fill", "currentColor")
      .attr("opacity", 0)
      .transition()
      .delay(400)
      .duration(400)
      .attr("opacity", 0.9);

    svg
      .append("text")
      .attr("x", margin.left + (width - margin.left - margin.right) / 2)
      .attr("y", height - 12)
      .attr("text-anchor", "middle")
      .text(xAxisLabel)
      .attr("font-size", "13px")
      .attr("fill", "currentColor")
      .attr("font-weight", "bold")
      .attr("opacity", 0.6);

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(margin.top + (height - margin.top - margin.bottom) / 2))
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .text(yAxisLabel)
      .attr("font-size", "13px")
      .attr("fill", "currentColor")
      .attr("font-weight", "bold")
      .attr("opacity", 0.6);
  }, [data, layout, width, height, xAxisLabel, yAxisLabel]);

  return (
    <div ref={hostRef} className="w-full">
      <svg ref={svgRef} width={width} height={height} className="text-foreground" />
    </div>
  );
}

export default ICPTierMatrixGraph;
