import React from 'react';
import {
  MotionItem,
  AnimationOverrides,
  ViewportMode,
  StageTheme,
} from '../types/motion';
import { MotionStage } from './MotionStage';
import {
  RotateCcw,
  Play,
  Pause,
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Type,
  Sparkles,
} from 'lucide-react';

interface StudioCanvasProps {
  item: MotionItem;
  customText: string;
  onCustomTextChange: (text: string) => void;
  overrides: AnimationOverrides;
  onUpdateOverrides: (partial: Partial<AnimationOverrides>) => void;
  replayKey: number;
  onReplay: () => void;
  stageTheme: StageTheme;
  viewportMode: ViewportMode;
  onViewportModeChange: (mode: ViewportMode) => void;
}

const SAMPLE_TEXT_PRESETS = [
  'FRAMLI-MOTION',
  '动效工作台',
  'NEON GLOW ✦',
  '128,450',
  'CLICK HERE',
  '✦ DISINTEGRATE ✦',
];

export const StudioCanvas: React.FC<StudioCanvasProps> = ({
  item,
  customText,
  onCustomTextChange,
  overrides,
  onUpdateOverrides,
  replayKey,
  onReplay,
  stageTheme,
  viewportMode,
  onViewportModeChange,
}) => {
  const getViewportWidthClass = () => {
    switch (viewportMode) {
      case '9:16':
      case 'mobile':
        return 'w-[316px] sm:w-[336px] aspect-[9/16] max-h-[600px] rounded-[36px] p-2.5 border-2 border-[#262c3e] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-white/10';
      case 'tablet':
        return 'w-[560px] max-w-full aspect-[4/3] max-h-[460px] rounded-2xl p-2 border border-[#1e2333] shadow-2xl';
      case '16:9':
      case 'responsive':
      default:
        return 'w-full max-w-4xl aspect-[16/9] max-h-[520px] rounded-2xl p-2 border border-[#1e2333] shadow-2xl';
    }
  };

  const isPhoneMode = viewportMode === '9:16' || viewportMode === 'mobile';

  return (
    <main className="flex-1 flex flex-col h-full bg-[#07080c] relative overflow-hidden">
      {/* Top Controls Bar: Custom Text & Viewports */}
      <div className="p-3 border-b border-[#181c26] bg-[#0b0c10] flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Custom text input */}
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <div className="relative flex-1">
            <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#cdff39]" />
            <input
              type="text"
              value={customText}
              onChange={e => onCustomTextChange(e.target.value)}
              placeholder={`输入测试文字（当前预设: ${item.txt || item.zh}）...`}
              className="w-full bg-[#12151e] border border-[#23293a] focus:border-[#cdff39] focus:outline-none rounded-lg pl-9 pr-14 py-1.5 text-xs text-white placeholder-[#686f82] transition-colors"
            />
            {customText && (
              <button
                onClick={() => onCustomTextChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#8e94a5] hover:text-[#cdff39] bg-[#1a1f2c] px-1.5 py-0.5 rounded border border-[#272f42]"
              >
                还原
              </button>
            )}
          </div>

          {/* Quick Preset Pills */}
          <div className="hidden 2xl:flex items-center gap-1">
            {SAMPLE_TEXT_PRESETS.slice(0, 2).map(preset => (
              <button
                key={preset}
                onClick={() => onCustomTextChange(preset)}
                className="px-2 py-1 rounded bg-[#131620] hover:bg-[#1a1f2e] border border-[#22283a] text-[10px] text-[#9ca3af] hover:text-white transition-colors whitespace-nowrap"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Viewport switchers with explicit 16:9, 4:3, and 9:16 ratios */}
        <div className="flex items-center gap-1 bg-[#12151e] p-1 rounded-lg border border-[#202534]">
          <button
            onClick={() => onViewportModeChange('16:9')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
              viewportMode === '16:9' || viewportMode === 'responsive'
                ? 'bg-[#cdff39] text-black font-bold shadow-[0_0_10px_rgba(205,255,57,0.25)]'
                : 'text-[#7e859a] hover:text-white'
            }`}
            title="16:9 宽屏画布模式 (标准桌面横屏)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>16:9 宽屏</span>
          </button>
          <button
            onClick={() => onViewportModeChange('tablet')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
              viewportMode === 'tablet'
                ? 'bg-[#cdff39] text-black font-bold shadow-[0_0_10px_rgba(205,255,57,0.25)]'
                : 'text-[#7e859a] hover:text-white'
            }`}
            title="4:3 平板模式 (Tablet)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>4:3 平板</span>
          </button>
          <button
            onClick={() => onViewportModeChange('9:16')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
              viewportMode === '9:16' || viewportMode === 'mobile'
                ? 'bg-[#cdff39] text-black font-bold shadow-[0_0_10px_rgba(205,255,57,0.25)]'
                : 'text-[#7e859a] hover:text-white'
            }`}
            title="9:16 竖屏手机模式 (短视频/移动端)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>9:16 手机</span>
          </button>
        </div>
      </div>

      {/* Center Stage Arena */}
      <div className="flex-1 overflow-auto p-4 md:p-6 flex items-center justify-center relative">
        <div
          className={`${getViewportWidthClass()} transition-all duration-300 relative bg-[#0e1017] flex flex-col`}
        >
          {/* Smartphone Top Island (only in 9:16 mode) */}
          {isPhoneMode && (
            <div className="w-full flex flex-col items-center pt-0.5 pb-1 select-none">
              <div className="w-20 h-3.5 bg-[#06070a] rounded-full border border-white/10 flex items-center justify-center gap-2 px-2 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1b202e]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#20273a]" />
              </div>
            </div>
          )}

          {/* Top Window Title bar */}
          <div
            className={`h-7 px-3 flex items-center justify-between border-b border-[#1c2130] bg-[#0c0e15] ${
              isPhoneMode ? 'rounded-t-2xl' : 'rounded-t-xl'
            } text-[11px] text-[#71788e]`}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              <span className="ml-2 font-mono text-[10px] text-[#cdff39] font-semibold truncate max-w-[140px] sm:max-w-none">
                #{String(item.id).padStart(3, '0')} {item.zh}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              <span className="px-1.5 py-0.5 bg-[#171b26] text-[#cdff39] font-bold rounded text-[9px] border border-[#262c3e]">
                {isPhoneMode ? '9:16' : viewportMode === 'tablet' ? '4:3' : '16:9'}
              </span>
              <span className="hidden sm:inline">{item.tech}</span>
            </div>
          </div>

          {/* Interactive Motion Canvas Stage */}
          <div
            className={`flex-1 w-full min-h-0 relative ${
              isPhoneMode ? 'rounded-b-2xl' : 'rounded-b-xl'
            } overflow-hidden flex items-center justify-center`}
          >
            <MotionStage
              item={item}
              customText={customText}
              overrides={overrides}
              theme={stageTheme}
              replayKey={replayKey}
              className="w-full h-full"
            />
          </div>

          {/* Smartphone Bottom Home Bar (only in 9:16 mode) */}
          {isPhoneMode && (
            <div className="w-full flex justify-center py-1 select-none">
              <div className="w-24 h-1 bg-white/20 rounded-full" />
            </div>
          )}

          {/* Interactive touch hint footer */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] font-mono text-white/30 bg-black/50 backdrop-blur-sm px-3 py-0.5 rounded-full border border-white/5 whitespace-nowrap">
            点击舞台可交互
          </div>
        </div>
      </div>

      {/* Bottom Playback & Speed Bar */}
      <div className="h-14 bg-[#0a0c12] border-t border-[#181c26] px-4 md:px-5 flex items-center justify-between gap-2 select-none overflow-x-auto">
        {/* Playback trigger controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReplay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#cdff39] hover:bg-[#d8ff5c] text-black font-bold text-xs transition-all shadow-[0_0_12px_rgba(205,255,57,0.2)] active:scale-95 whitespace-nowrap"
            title="重新触发并播放动画"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            重播
          </button>
        </div>

        {/* Speed multiplier selector */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-mono text-[#6c7287] whitespace-nowrap">倍速:</span>
          <div className="flex items-center gap-1 bg-[#12151e] p-1 rounded-lg border border-[#1e2332]">
            {[0.25, 0.5, 1.0, 1.5, 2.0].map(speed => (
              <button
                key={speed}
                onClick={() => onUpdateOverrides({ playbackSpeed: speed })}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                  overrides.playbackSpeed === speed
                    ? 'bg-[#cdff39] text-black font-bold'
                    : 'text-[#82889c] hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Zoom Scale Slider */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#82889c] shrink-0">
          <span className="font-mono text-[11px] whitespace-nowrap">缩放:</span>
          <input
            type="range"
            min="0.6"
            max="1.5"
            step="0.05"
            value={overrides.scale}
            onChange={e =>
              onUpdateOverrides({ scale: parseFloat(e.target.value) })
            }
            className="w-16 cursor-pointer"
          />
          <span className="font-mono text-[11px] text-[#cdff39] w-8">
            {Math.round(overrides.scale * 100)}%
          </span>
        </div>
      </div>
    </main>
  );
};
