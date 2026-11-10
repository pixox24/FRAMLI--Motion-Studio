import React, { useState, useRef, useEffect } from 'react';
import { MotionItem, AnimationOverrides } from '../types/motion';
import { MotionStage } from './MotionStage';
import { generateAIPrompt } from '../utils/motionUtils';
import { Star, Sliders, Copy, Check, Sparkles } from 'lucide-react';

interface GalleryViewProps {
  items: MotionItem[];
  customText: string;
  overrides: AnimationOverrides;
  onSelectForStudio: (item: MotionItem) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
}

const LazyMotionCard: React.FC<{
  item: MotionItem;
  customText: string;
  overrides: AnimationOverrides;
  onSelectForStudio: (item: MotionItem) => void;
  isFav: boolean;
  onToggleFavorite: (id: number) => void;
  copiedId: number | null;
  onCopyPrompt: (item: MotionItem) => void;
}> = ({
  item,
  customText,
  overrides,
  onSelectForStudio,
  isFav,
  onToggleFavorite,
  copiedId,
  onCopyPrompt,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="group bg-[#0e1017] border border-[#1c2130] hover:border-[#cdff39]/50 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[0_4px_24px_rgba(205,255,57,0.08)]"
    >
      {/* Live Animation Stage Card */}
      <div
        onClick={() => onSelectForStudio(item)}
        className="h-44 w-full relative overflow-hidden bg-[#0a0c12] cursor-pointer"
      >
        {isVisible ? (
          <MotionStage
            item={item}
            customText={customText}
            overrides={overrides}
            theme={item.bg || 'dark'}
            replayKey={0}
            className="w-full h-full"
            interactive={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#555d73] text-xs font-mono">
            <span>{item.txt || item.zh}</span>
          </div>
        )}

        {/* Top floating badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
          <span className="font-mono text-[10px] px-2 py-0.5 bg-black/75 backdrop-blur-md border border-white/10 rounded-md text-[#cdff39] font-bold">
            #{String(item.id).padStart(3, '0')}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-white/80 font-mono">
            {item.tech}
          </span>
        </div>

        {/* Top-Right: NEW Badge & Favorite Button */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
          {item.isNew && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider bg-[#cdff39] text-[#0a0c10] shadow-[0_0_10px_rgba(205,255,57,0.7)] uppercase flex items-center gap-1 pointer-events-none">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              NEW
            </span>
          )}
          <button
            onClick={e => {
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
            className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-md transition-colors"
            title={isFav ? '取消收藏' : '收藏'}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                isFav ? 'text-[#ffd700] fill-current' : 'text-white/60'
              }`}
            />
          </button>
        </div>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-[#090b10]/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none z-10">
          <span className="px-3 py-1.5 rounded-lg bg-[#cdff39] text-black font-bold text-xs flex items-center gap-1.5 shadow-lg">
            <Sliders className="w-3.5 h-3.5" />
            进入工作台调参
          </span>
        </div>
      </div>

      {/* Info & Action Footer */}
      <div className="p-3 flex flex-col gap-2 flex-1 justify-between bg-[#0e1017] border-t border-[#181c26]">
        <div>
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-bold text-xs text-white truncate">{item.zh}</h3>
            <span className="text-[10px] font-mono text-[#62687c] truncate">
              {item.en}
            </span>
          </div>
          <p className="text-[11px] text-[#71788e] line-clamp-1 mt-0.5">
            {item.desc}
          </p>
        </div>

        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={() => onSelectForStudio(item)}
            className="flex-1 py-1.5 px-2 bg-[#161a26] hover:bg-[#202638] text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1 border border-[#23293c]"
          >
            <Sliders className="w-3 h-3 text-[#cdff39]" />
            调参
          </button>
          <button
            onClick={() => onCopyPrompt(item)}
            className="py-1.5 px-2.5 bg-[#121520] hover:bg-[#1c2132] text-[#8e94a5] hover:text-white text-xs rounded-lg transition-colors border border-[#202536]"
            title="复制 AI 提示词"
          >
            {copiedId === item.id ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const GalleryView: React.FC<GalleryViewProps> = ({
  items,
  customText,
  overrides,
  onSelectForStudio,
  favorites,
  onToggleFavorite,
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyPrompt = async (item: MotionItem) => {
    const text = generateAIPrompt(item, customText, overrides);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#07080c]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#1b1f2c]">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#cdff39]" />
              全量动效画廊 Gallery ({items.length} 款)
            </h2>
            <p className="text-xs text-[#71788e] mt-0.5">
              点击任意卡片即可将其载入工作台进行高精度的曲线、缓动与时长调参。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(item => (
            <LazyMotionCard
              key={item.id}
              item={item}
              customText={customText}
              overrides={overrides}
              onSelectForStudio={onSelectForStudio}
              isFav={favorites.includes(item.id)}
              onToggleFavorite={onToggleFavorite}
              copiedId={copiedId}
              onCopyPrompt={handleCopyPrompt}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
