import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

export type MaturityDataPoint = {
  label: string;
  value: number;
  color: string;
};

type MarketMaturityGraphProps = {
  data?: MaturityDataPoint[];
  height?: number;
};

export function MarketMaturityGraph({ data = [], height = 150 }: MarketMaturityGraphProps) {
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
    const margin = { top: 20, right: 80, bottom: 20, left: 100 };
    const yScale = d3.scaleBand().domain(data.map(d => d.label)).range([margin.top, height - margin.bottom]).padding(0.3);
    const xScale = d3.scaleLinear().domain([0, 100]).range([margin.left, width - margin.right]);

    return { margin, xScale, yScale };
  }, [data, width, height]);

  useEffect(() => {
    if (!svgRef.current || width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { xScale, yScale, margin } = layout;

    // Bars
    svg.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", margin.left)
      .attr("y", d => yScale(d.label)!)
      .attr("width", 0)
      .attr("height", yScale.bandwidth())
      .attr("fill", d => d.color)
      .attr("opacity", 0.8)
      .transition()
      .duration(1000)
      .attr("width", d => xScale(d.value) - margin.left);

    // Labels (Left)
    svg.selectAll(".row-label")
      .data(data)
      .join("text")
      .attr("class", "row-label")
      .attr("x", margin.left - 10)
      .attr("y", d => yScale(d.label)! + yScale.bandwidth() / 2 + 5)
      .attr("text-anchor", "end")
      .text(d => d.label)
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("fill", "currentColor")
      .attr("opacity", 0.8);

    // Values (Right)
    svg.selectAll(".val-label")
      .data(data)
      .join("text")
      .attr("class", "val-label")
      .attr("x", d => xScale(d.value) + 10)
      .attr("y", d => yScale(d.label)! + yScale.bandwidth() / 2 + 5)
      .text(d => `${d.value}%`)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "currentColor")
      .attr("opacity", 0)
      .transition()
      .delay(800)
      .attr("opacity", 1);

  }, [data, layout, width, height]);

  return (
    <div ref={hostRef} className="w-full h-full">
      <svg ref={svgRef} width={width} height={height} className="text-foreground" />
    </div>
  );
}

export default MarketMaturityGraph;
