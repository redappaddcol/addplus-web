export default function Salvavidas({
  progreso,
  size = 68,
}: {
  progreso: number;
  size?: number;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(progreso)));
  const stroke = 7;
  const radio = (size - stroke) / 2;
  const circunferencia = 2 * Math.PI * radio;
  const avance = (pct / 100) * circunferencia;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radio}
            fill="none"
            stroke="#E3DFD2"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radio}
            fill="none"
            stroke="#40573F"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${avance} ${circunferencia}`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-[#2B2B26]">
          {pct}%
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-[#9A9A8E]">Salvavidas</span>
    </div>
  );
}
