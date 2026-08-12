export default function Logo({ className = "" }: { className?: string }) {
  const r = 11;
  const d = r * 0.866;
  const petalos = [
    [0, -r],
    [d, -r / 2],
    [d, r / 2],
    [0, r],
    [-d, r / 2],
    [-d, -r / 2],
  ];

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
      <circle cx="24" cy="24" r={r} fill="none" stroke="currentColor" strokeWidth="1.2" />
      {petalos.map(([x, y], i) => (
        <circle
          key={i}
          cx={24 + x}
          cy={24 + y}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.75"
        />
      ))}
    </svg>
  );
}
