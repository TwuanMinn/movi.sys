interface MiniBarProps {
  value: number;
  max: number;
  color: string;
  h?: number;
}

export function MiniBar({ value, max, color, h = 6 }: MiniBarProps) {
  return (
    <div style={{ width: "100%", height: h, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
      <div
        style={{
          width: `${Math.min((value / max) * 100, 100)}%`,
          height: "100%",
          background: color,
          borderRadius: 3,
          transition: "width 0.8s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
}
