interface SparklineProps {
  data: number[];
  color: string;
  w?: number;
  h?: number;
}

export function Sparkline({ data, color, w = 100, h = 30 }: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`)
    .join(" ");
  const lastY = h - ((data[data.length - 1]! - min) / range) * (h - 4) - 2;

  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={lastY} r={2.5} fill={color} />
    </svg>
  );
}
