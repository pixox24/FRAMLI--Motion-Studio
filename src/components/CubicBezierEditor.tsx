import React, { useRef, useState, useEffect } from 'react';
import { CubicBezierCoords } from '../types/motion';
import { CURVE_PRESETS, formatCubicBezier, generateBezierPath } from '../utils/motionUtils';

interface CubicBezierEditorProps {
  coords: CubicBezierCoords;
  onChange: (coords: CubicBezierCoords, presetName?: string) => void;
}

export const CubicBezierEditor: React.FC<CubicBezierEditorProps> = ({
  coords,
  onChange,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingHandle, setDraggingHandle] = useState<1 | 2 | null>(null);

  const width = 220;
  const height = 180;
  const pad = 28;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2;

  // Convert normalized [0..1] coords to SVG pixel space
  const p0 = { x: pad, y: pad + plotH };
  const p3 = { x: pad + plotW, y: pad };
  const p1 = {
    x: pad + coords[0] * plotW,
    y: pad + plotH - coords[1] * plotH,
  };
  const p2 = {
    x: pad + coords[2] * plotW,
    y: pad + plotH - coords[3] * plotH,
  };

  const handlePointerDown = (handle: 1 | 2) => (e: React.PointerEvent) => {
    e.preventDefault();
    setDraggingHandle(handle);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingHandle || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert mouse pixels back to normalized [0..1] range
    const normX = Math.max(0, Math.min(1, (mouseX - pad) / plotW));
    // Allow y to slightly overshoot or undershoot [-0.8 .. 1.8] for elastic/back-out bounce
    const normY = Math.max(-0.8, Math.min(1.8, (pad + plotH - mouseY) / plotH));

    const newCoords: CubicBezierCoords = [...coords];
    if (draggingHandle === 1) {
      newCoords[0] = Math.round(normX * 100) / 100;
      newCoords[1] = Math.round(normY * 100) / 100;
    } else {
      newCoords[2] = Math.round(normX * 100) / 100;
      newCoords[3] = Math.round(normY * 100) / 100;
    }
    onChange(newCoords, '自定义曲线');
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingHandle) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      setDraggingHandle(null);
    }
  };

  const pathD = generateBezierPath(coords, width, height, pad);
  const formattedCss = formatCubicBezier(coords);

  return (
    <div className="flex flex-col gap-3">
      {/* Visual Canvas */}
      <div className="relative bg-[#08090d] border border-[#1e2330] rounded-xl p-3 flex flex-col items-center select-none shadow-inner">
        <div className="w-full flex items-center justify-between text-xs text-[#8e94a5] mb-1 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#cdff39]"></span>
            P1: ({coords[0]}, {coords[1]})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff]"></span>
            P2: ({coords[2]}, {coords[3]})
          </span>
        </div>

        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="cursor-crosshair overflow-visible"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Grid lines */}
          <rect
            x={pad}
            y={pad}
            width={plotW}
            height={plotH}
            fill="#0f1118"
            stroke="#1b1f2b"
            strokeDasharray="3 3"
          />
          {/* Diagonal baseline */}
          <line
            x1={p0.x}
            y1={p0.y}
            x2={p3.x}
            y2={p3.y}
            stroke="#262c3d"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Control handle lines */}
          <line
            x1={p0.x}
            y1={p0.y}
            x2={p1.x}
            y2={p1.y}
            stroke="#cdff39"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
          <line
            x1={p3.x}
            y1={p3.y}
            x2={p2.x}
            y2={p2.y}
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />

          {/* Bezier Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Start and End Anchor points */}
          <circle cx={p0.x} cy={p0.y} r="4" fill="#50576b" />
          <circle cx={p3.x} cy={p3.y} r="4" fill="#50576b" />

          {/* Control handle 1 (draggable) */}
          <circle
            cx={p1.x}
            cy={p1.y}
            r="8"
            fill="#cdff39"
            stroke="#08090d"
            strokeWidth="2.5"
            className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
            onPointerDown={handlePointerDown(1)}
          />

          {/* Control handle 2 (draggable) */}
          <circle
            cx={p2.x}
            cy={p2.y}
            r="8"
            fill="#00f0ff"
            stroke="#08090d"
            strokeWidth="2.5"
            className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
            onPointerDown={handlePointerDown(2)}
          />
        </svg>

        {/* Live CSS Bezier Code output */}
        <div className="w-full mt-2 pt-2 border-t border-[#181c26] flex items-center justify-between text-[11px] font-mono text-[#a5acbe]">
          <span>{formattedCss}</span>
        </div>

        {/* Dynamic preview motion runner */}
        <div className="w-full mt-2 h-2 bg-[#141822] rounded-full relative overflow-hidden">
          <div
            className="h-full w-6 rounded-full bg-[#cdff39] absolute shadow-[0_0_8px_#cdff39]"
            style={{
              animation: `curve-preview 2s ${formattedCss} infinite`,
            }}
          />
        </div>
      </div>

      {/* Preset Buttons Grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {CURVE_PRESETS.map(preset => {
          const isSelected =
            coords[0] === preset.coords[0] &&
            coords[1] === preset.coords[1] &&
            coords[2] === preset.coords[2] &&
            coords[3] === preset.coords[3];

          return (
            <button
              key={preset.name}
              onClick={() => onChange(preset.coords, preset.label)}
              className={`px-2.5 py-1.5 text-xs rounded-lg text-left transition-all border flex flex-col gap-0.5 ${
                isSelected
                  ? 'bg-[#cdff39]/15 border-[#cdff39] text-[#cdff39] font-medium shadow-[0_0_12px_rgba(205,255,57,0.15)]'
                  : 'bg-[#12151e] border-[#1f2433] text-[#9ca3af] hover:border-[#353c52] hover:text-white'
              }`}
            >
              <span className="font-semibold">{preset.label}</span>
              <span className="text-[10px] opacity-70 truncate font-mono">
                {preset.coords.join(', ')}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes curve-preview {
          0% { left: 0%; transform: translateX(0); }
          50% { left: calc(100% - 24px); transform: translateX(0); }
          100% { left: 0%; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
