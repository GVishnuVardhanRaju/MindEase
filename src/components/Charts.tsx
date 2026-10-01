import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CheckIn } from "@/lib/wellness";
import { ari } from "@/lib/wellness";

gsap.registerPlugin(ScrollTrigger);

function useChartReveal(ref: React.RefObject<HTMLDivElement | null>) {
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;
    const context = gsap.context(() => {
      const svg = element.querySelector("svg");
      const bars = gsap.utils.toArray<SVGGraphicsElement>(".recharts-bar-rectangle", element);
      const lines = gsap.utils.toArray<SVGPathElement>(
        ".recharts-area-curve, .recharts-line-curve",
        element,
      );
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: element, start: "top 90%", once: true },
      });
      if (svg) timeline.fromTo(svg, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0);
      if (lines.length) {
        timeline.fromTo(
          lines[0]!,
          {
            strokeDasharray: lines[0]!.getTotalLength(),
            strokeDashoffset: lines[0]!.getTotalLength(),
          },
          { strokeDashoffset: 0, duration: 1.35, ease: "power3.out" },
          0.12,
        );
        lines.slice(1).forEach((line, index) => {
          const length = line.getTotalLength();
          timeline.fromTo(
            line,
            { strokeDasharray: length, strokeDashoffset: length },
            { strokeDashoffset: 0, duration: 1.35, ease: "power3.out" },
            0.24 + index * 0.12,
          );
        });
      }
      if (bars.length) {
        timeline.fromTo(
          bars,
          { autoAlpha: 0, scaleX: 0, transformOrigin: "left center" },
          { autoAlpha: 1, scaleX: 1, duration: 0.9, stagger: 0.07, ease: "power3.out" },
          0.12,
        );
      }
    }, element);
    return () => context.revert();
  }, [reduced, ref]);
}

export function TrendChart({
  entries,
  keys = ["ari"],
  height = 240,
}: {
  entries: CheckIn[];
  keys?: ("ari" | "mood" | "stress" | "sleep" | "activity")[];
  height?: number;
}) {
  const chartRef = useRef<HTMLDivElement>(null);
  useChartReveal(chartRef);
  const data = entries.map((x) => ({
    date: x.date.slice(5),
    ari: ari(x),
    mood: x.mood * 10,
    stress: x.stress * 10,
    sleep: x.sleep * 10,
    activity: x.activity * 10,
  }));
  return (
    <div
      ref={chartRef}
      className="chart-visual"
      style={{ height }}
      role="img"
      aria-label={`${keys.join(", ")} trends chart`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -26, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.24} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 5" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--foreground)",
            }}
          />
          {keys.map((key, i) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={["var(--primary)", "var(--teal)", "var(--caution)", "var(--positive)"][i % 4]}
              fill={i === 0 ? "url(#trendFill)" : "transparent"}
              strokeWidth={2.5}
              dot={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
export function TriggerChart({ data }: { data: { name: string; value: number }[] }) {
  const chartRef = useRef<HTMLDivElement>(null);
  useChartReveal(chartRef);
  return (
    <div ref={chartRef} className="chart-visual h-56" role="img" aria-label="Trigger factors chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 2, right: 18 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            dataKey="name"
            type="category"
            width={108}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--foreground)",
            }}
          />
          <Bar dataKey="value" fill="var(--teal)" radius={[0, 4, 4, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
