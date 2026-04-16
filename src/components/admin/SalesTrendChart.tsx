'use client';

import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { fetchSalesTrend, SalesTrendPoint, TimeRange, formatINR } from '@/lib/analytics';

const TIME_TABS: { label: string; value: TimeRange }[] = [
  { label: '7D', value: 'week' },
  { label: '30D', value: 'month' },
  { label: '1Y', value: 'year' },
  { label: 'All', value: 'overall' },
];

export default function SalesTrendChart({ initialRange = 'month' }: { initialRange?: TimeRange }) {
  const [range, setRange] = useState<TimeRange>(initialRange);
  const [data, setData] = useState<SalesTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    setLoading(true);
    fetchSalesTrend(supabase, range)
      .then(setData)
      .finally(() => setLoading(false));
  }, [range]);

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + d.orders, 0);

  // Build SVG path
  const W = 800;
  const H = 200;
  const PAD_X = 10;
  const PAD_Y = 20;

  function buildPath() {
    if (data.length < 2) return '';
    const pts = data.map((d, i) => {
      const x = PAD_X + (i / (data.length - 1)) * (W - PAD_X * 2);
      const y = PAD_Y + ((1 - d.revenue / maxRevenue) * (H - PAD_Y * 2));
      return { x, y };
    });
    // Smooth bezier
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const cp1x = (pts[i - 1].x + pts[i].x) / 2;
      const cp1y = pts[i - 1].y;
      const cp2x = (pts[i - 1].x + pts[i].x) / 2;
      const cp2y = pts[i].y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i].x} ${pts[i].y}`;
    }
    return { path, pts };
  }

  const chart = data.length >= 2 ? buildPath() : null;
  const areaPath = chart
    ? `${chart.path} L ${chart.pts[chart.pts.length - 1].x} ${H - PAD_Y} L ${PAD_X} ${H - PAD_Y} Z`
    : '';

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8161B]/10 border border-[#E8161B]/20 flex items-center justify-center">
            <TrendingUp size={18} className="text-[#E8161B]" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">Sales Trend</h3>
            <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase">Revenue over time</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
          {TIME_TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setRange(t.value)}
              className={`px-4 py-1.5 rounded-lg font-mono text-[10px] tracking-widest uppercase transition-all duration-200 ${
                range === t.value
                  ? 'bg-[#E8161B] text-white shadow-[0_2px_8px_rgba(232,22,27,0.4)]'
                  : 'text-white/30 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="flex gap-8">
        <div>
          <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase mb-1">Total Revenue</p>
          <p className="font-display font-black text-2xl text-white">{formatINR(totalRevenue)}</p>
        </div>
        <div>
          <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase mb-1">Total Orders</p>
          <p className="font-display font-black text-2xl text-white">{totalOrders}</p>
        </div>
        {data.length > 0 && (
          <div>
            <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase mb-1">Avg / Order</p>
            <p className="font-display font-black text-2xl text-white">{formatINR(totalOrders > 0 ? totalRevenue / totalOrders : 0)}</p>
          </div>
        )}
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-[200px] flex items-center justify-center">
          <div className="w-8 h-8 border border-[#E8161B]/30 border-t-[#E8161B] rounded-full animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center">
          <p className="font-mono text-[10px] text-white/20 tracking-widest uppercase">No data for selected period</p>
        </div>
      ) : data.length < 2 ? (
        <div className="h-[200px] flex items-center justify-center">
          <div className="text-center">
            <p className="font-display font-black text-white text-2xl">{formatINR(data[0]?.revenue ?? 0)}</p>
            <p className="font-mono text-[10px] text-white/30 tracking-widest uppercase mt-2">{data[0]?.date}</p>
          </div>
        </div>
      ) : (
        <div className="relative h-[200px] w-full" onMouseLeave={() => setHoveredIdx(null)}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E8161B" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#E8161B" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map(f => (
              <line
                key={f}
                x1={PAD_X}
                y1={PAD_Y + (1 - f) * (H - PAD_Y * 2)}
                x2={W - PAD_X}
                y2={PAD_Y + (1 - f) * (H - PAD_Y * 2)}
                stroke="rgba(255,255,255,0.04)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            ))}
            {/* Area fill */}
            <path d={areaPath} fill="url(#areaGrad)" />
            {/* Line */}
            {chart && (
              <path
                d={chart.path}
                fill="none"
                stroke="#E8161B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {/* Hover dots */}
            {chart && chart.pts.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={24}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                />
                {hoveredIdx === i && (
                  <>
                    <circle cx={pt.x} cy={pt.y} r={5} fill="#E8161B" stroke="#0A0A0A" strokeWidth="2" />
                    <line
                      x1={pt.x} y1={PAD_Y}
                      x2={pt.x} y2={H - PAD_Y}
                      stroke="rgba(232,22,27,0.3)"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                  </>
                )}
              </g>
            ))}
          </svg>

          {/* Tooltip */}
          {hoveredIdx !== null && data[hoveredIdx] && chart && (
            <div
              className="absolute pointer-events-none bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-center shadow-xl transform -translate-x-1/2 -translate-y-full -mt-3 z-10"
              style={{
                left: `${(chart.pts[hoveredIdx].x / W) * 100}%`,
                top: `${(chart.pts[hoveredIdx].y / H) * 100}%`
              }}
            >
              <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase">{data[hoveredIdx].date}</p>
              <p className="font-display font-black text-sm text-white">{formatINR(data[hoveredIdx].revenue)}</p>
              <p className="font-mono text-[9px] text-white/40">{data[hoveredIdx].orders} order{data[hoveredIdx].orders !== 1 ? 's' : ''}</p>
            </div>
          )}

          {/* X axis labels (first, mid, last) */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between">
            {[data[0], data[Math.floor(data.length / 2)], data[data.length - 1]].map((d, i) => (
              <p key={i} className="font-mono text-[9px] text-white/20">{d?.date}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
