import { useEffect, useId, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

export type MechanismNode = {
  id: string;
  label: string;
  column: number;
  row: number;
};

export type MechanismLink = {
  source: string;
  target: string;
};

type MechanismFlowGraphProps = {
  title?: string;
  nodes?: MechanismNode[];
  links?: MechanismLink[];
};

function wrapSvgText(
  text: d3.Selection<SVGTextElement, unknown, null, undefined>,
  width: number,
  lineHeightEm = 1.2
) {
  text.each(function () {
    const node = d3.select(this);
    const words = (node.text() ?? "").split(/\s+/).filter(Boolean);
    const x = Number(node.attr("x"));
    const y = Number(node.attr("y"));

    node.text("");

    let line: string[] = [];
    let lineNumber = 0;
    let tspan = node
      .append("tspan")
      .attr("x", x)
      .attr("y", y)
      .attr("dy", `${lineNumber * lineHeightEm}em`);

    for (const word of words) {
      line.push(word);
      tspan.text(line.join(" "));
      const tspanNode = tspan.node();
      if (tspanNode && tspanNode.getComputedTextLength() > width && line.length > 1) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        lineNumber += 1;
        tspan = node
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", `${lineNumber * lineHeightEm}em`)
          .text(word);
      }
    }
  });
}

export function MechanismFlowGraph({ title = "", nodes = [], links = [] }: MechanismFlowGraphProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(0);
  const markerId = useId().replace(/:/g, "-");

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
    const margin = { top: 34, right: 34, bottom: 34, left: 34 };
    const minCanvasWidth = 980;
    const canvasWidth = Math.max(width, minCanvasWidth);
    const innerWidth = Math.max(canvasWidth - margin.left - margin.right, 1);
    const maxColumn = Math.max(...nodes.map((node) => node.column), 0);
    const maxRow = Math.max(...nodes.map((node) => node.row), 0);
    const rowHeight = 92;
    const nodeH = 74;
    const height = margin.top + margin.bottom + (maxRow + 1) * rowHeight;
    const nodeW = Math.max(Math.min(innerWidth / Math.max(maxColumn + 1.7, 1), 240), 180);

    const xScale = d3
      .scaleLinear()
      .domain([0, Math.max(maxColumn, 1)])
      .range([margin.left + nodeW / 2, canvasWidth - margin.right - nodeW / 2]);

    const positionedNodes = nodes.map((node) => ({
      ...node,
      x: xScale(node.column),
      y: margin.top + node.row * rowHeight + nodeH / 2,
      w: nodeW,
      h: nodeH,
    }));

    const byId = new Map(positionedNodes.map((node) => [node.id, node]));
    const positionedLinks = links
      .map((link) => {
        const source = byId.get(link.source);
        const target = byId.get(link.target);
        if (!source || !target) return null;
        return { source, target };
      })
      .filter((link): link is NonNullable<typeof link> => link !== null);

    return { canvasWidth, height, nodeW, positionedNodes, positionedLinks };
  }, [links, nodes, width]);

  useEffect(() => {
    if (!svgRef.current || width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${layout.canvasWidth} ${layout.height}`);

    const defs = svg.append("defs");
    defs
      .append("marker")
      .attr("id", markerId)
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "hsl(var(--border))");

    const graph = svg.append("g");

    layout.positionedLinks.forEach(({ source, target }) => {
      const startX = source.x + source.w / 2;
      const endX = target.x - target.w / 2;
      const startY = source.y;
      const endY = target.y;
      const curve = Math.max((endX - startX) * 0.45, 48);
      const d = `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`;

      graph
        .append("path")
        .attr("d", d)
        .attr("fill", "none")
        .attr("stroke", "hsl(var(--primary) / 0.7)")
        .attr("stroke-width", 1.4)
        .attr("marker-end", `url(#${markerId})`);
    });

    layout.positionedNodes.forEach((node) => {
      const rectX = node.x - node.w / 2;
      const rectY = node.y - node.h / 2;

      graph
        .append("rect")
        .attr("x", rectX)
        .attr("y", rectY)
        .attr("width", node.w)
        .attr("height", node.h)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("fill", "hsl(var(--card) / 0.8)")
        .attr("stroke", "hsl(var(--border) / 0.5)")
        .attr("stroke-width", 1);

      const text = graph
        .append("text")
        .attr("x", node.x)
        .attr("y", rectY + 24)
        .attr("text-anchor", "middle")
        .attr("fill", "hsl(var(--foreground))")
        .style("font-size", "14px")
        .style("font-weight", 700)
        .attr("class", "uppercase tracking-tight")
        .text(node.label);

      wrapSvgText(text, layout.nodeW - 24, 1.2);
    });
  }, [layout, markerId, width]);

  return (
    <div ref={hostRef} className="w-full overflow-x-auto">
      <svg
        ref={svgRef}
        width={layout.canvasWidth}
        height={layout.height}
        className="block min-w-[980px]"
        role="img"
        aria-label={title}
      />
    </div>
  );
}

export default MechanismFlowGraph;
