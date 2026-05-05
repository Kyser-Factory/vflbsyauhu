"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Icon } from "@iconify/react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

type DecisionNode = {
  id: string;
  label: string;
  variant?: "success" | "warning" | "error";
  children?: DecisionNode[];
};

type DecisionGraphProps = {
  width?: number;
  height?: number;
  data?: DecisionNode;
};

const DEMO_TREE: DecisionNode = {
  id: "root",
  label: "Decision Architecture",
  children: [
    {
      id: "insight",
      label: "Analyze Intent",
      variant: "success",
      children: [
        { id: "shape", label: "Shape Content", variant: "success" },
        { id: "hold", label: "Hold for Review", variant: "warning" },
      ],
    },
    {
      id: "route",
      label: "Route Action",
      variant: "success",
      children: [
        { id: "form", label: "Open Form", variant: "success" },
        { id: "search", label: "Search Data", variant: "warning" },
        { id: "stop", label: "Stop Flow", variant: "error" },
      ],
    },
  ],
};

function nodeColor(node: d3.HierarchyNode<DecisionNode>) {
  if (node.data.id === "root") return "var(--primary)";
  if (node.data.variant === "success") return "var(--primary)";
  if (node.data.variant === "warning") return "#f59e0b";
  if (node.data.variant === "error") return "var(--destructive)";
  return "var(--muted)";
}

export function DecisionGraph({
  width = 800,
  height = 400,
  data = DEMO_TREE,
}: DecisionGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 120, bottom: 40, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const root = d3.hierarchy(data);
    const treeLayout = d3.tree<DecisionNode>().size([innerHeight, innerWidth]);
    treeLayout(root);

    const g = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const link = d3
      .linkHorizontal<d3.HierarchyPointLink<DecisionNode>, d3.HierarchyPointNode<DecisionNode>>()
      .x((d) => d.y)
      .y((d) => d.x);

    g.selectAll("path.link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("d", (d) => link(d as d3.HierarchyPointLink<DecisionNode>) ?? "")
      .attr("fill", "none")
      .attr("stroke", "hsl(var(--border))")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.4);

    const node = g
      .selectAll("g.node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    node
      .append("circle")
      .attr("r", (d) => (d.data.id === "root" ? 12 : 8))
      .attr("fill", (d) => nodeColor(d))
      .attr("stroke", "hsl(var(--card))")
      .attr("stroke-width", 1);

    node
      .append("text")
      .attr("dy", "0.35em")
      .attr("x", (d) => (d.children ? -16 : 16))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.label)
      .attr("fill", "hsl(var(--foreground))")
      .style("font-size", "9px")
      .style("font-weight", "900")
      .style("letter-spacing", "0.05em")
      .style("text-transform", "uppercase")
      .attr("class", "italic tracking-tight");
  }, [data, height, width]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg ref={svgRef} width="100%" height={height} className="max-w-full" />
    </div>
  );
}

export default DecisionGraph;
