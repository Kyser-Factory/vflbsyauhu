import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

export type UpsellDataPoint = {
  label: string;
  value: number;
  color: string;
};

type UpsellGapGraphProps = {
  data?: UpsellDataPoint[];
  height?: number;
};

export function UpsellGapGraph({ data = [], height = 200 }: UpsellGapGraphProps) {
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
    const margin = { top: 25, right: 20, bottom: 45, left: 20 };
    const innerWidth = Math.max(width - margin.left - margin.right, 1);
    const innerHeight = Math.max(height - margin.top - margin.bottom, 1);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top]);

    return { margin, innerWidth, innerHeight, x, y };
  }, [data, width, height]);

  useEffect(() => {
    if (!svgRef.current || width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { x, y } = layout;

    // Bars
    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.label)!)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - layout.margin.bottom - y(d.value))
      .attr("fill", (d) => d.color)
      .attr("opacity", 0.8)
      .attr("opacity", 0);

    svg.selectAll("rect")
      .transition()
      .duration(1000)
      .attr("opacity", 0.9);

    // Labels
    svg
      .selectAll(".label")
      .data(data)
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.label)! + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 8)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .attr("font-size", "13px")
      .attr("font-weight", "600")
      .attr("opacity", 0)
      .text((d) => `${d.value}%`)
      .transition()
      .delay(500)
      .duration(500)
      .attr("opacity", 1);

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - layout.margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0))
      .call((g) => g.select(".domain").remove())
      .selectAll("text")
      .attr("fill", "currentColor")
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("dy", "14px");

  }, [data, layout, width, height]);

  return (
    <div ref={hostRef} className="w-full">
      <svg ref={svgRef} width={width} height={height} className="text-foreground" />
    </div>
  );
}

export default UpsellGapGraph;
