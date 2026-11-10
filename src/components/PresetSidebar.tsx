import React, { useState, useRef, useEffect } from 'react';
import { MotionItem, AnimationOverrides } from '../types/motion';
import { COMPS } from '../motion-engine/motionData';
import { MotionStage } from './MotionStage';
import { Search, Star, Filter, X, LayoutGrid, Grid3X3, Grid2X2 } from 'lucide-react';

interface PresetSidebarProps {
  items: MotionItem[];
  selectedItem: MotionItem;
  onSelectItem: (item: MotionItem) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedComp: string;
  onSelectComp: (comp: string) => void;
  selectedWhen: string;
  onSelectWhen: (when: string) => void;
  selectedTech: string;
  onSelectTech: (tech: string) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  customText: string;
  overrides: AnimationOverrides;
}

const MiniCard: React.FC<{
  item: MotionItem;
  isSelected: boolean;
  isFav: boolean;
  onSelect: () => void;
  onToggleFav: () => void;
  customText: string;
  overrides: AnimationOverrides;
}> = ({
  item,
  isSelected,
  isFav,
  onSelect,
  onToggleFav,
  customText,
  overrides,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { rootMargin: '120px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={`group relative flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border ${
        isSelected
          ? 'bg-[#181c28] border-[#cdff39] shadow-[0_0_14px_rgba(205,255,57,0.3)] ring-1 ring-[#cdff39]/50 scale-[1.02]'
          : 'bg-[#10131b] border-[#1d2230] hover:border-[#384157] hover:bg-[#151924]'
      }`}
    >
      {/* Mini Motion Stage */}
      <div className="w-full aspect-[4/3] relative overflow-hidden bg-[#0a0c12] flex items-center justify-center">
        {isVisible ? (
          <MotionStage
            item={item}
            customText={customText}
            overrides={overrides}
            theme={item.bg || 'dark'}
            replayKey={0}
            className="w-full h-full pointer-events-none"
            interactive={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-[#4d546a] font-mono">
            {item.txt || item.zh}
          </div>
        )}

        {/* Top-Right: NEW badge and Favorite Icon */}
        <div className="absolute top-1 right-1 flex items-center gap-1 z-20">
          {item.isNew && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider bg-[#cdff39] text-[#0a0c10] shadow-[0_0_8px_rgba(205,255,57,0.7)] uppercase pointer-events-none">
              NEW
            </span>
          )}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onToggleFav();
            }}
            className={`p-1 rounded-md bg-black/60 backdrop-blur-xs transition-opacity ${
              isFav
                ? 'opacity-100 text-[#ffd700]'
                : 'opacity-0 group-hover:opacity-100 text-white/50 hover:text-white'
            }`}
            title={isFav ? '取消收藏' : '收藏'}
          >
            <Star className={`w-3 h-3 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Tech indicator badge (Top-Left) */}
        <span className="absolute top-1 left-1 px-1 py-0.2 rounded text-[8px] font-mono bg-black/70 backdrop-blur-xs text-white/70 pointer-events-none">
          {item.tech}
        </span>
      </div>

      {/* Streamlined Footer: Only ID and Title */}
      <div
        className={`px-2 py-1.5 flex items-center justify-between gap-1 border-t transition-colors ${
          isSelected
            ? 'bg-[#141822] border-[#cdff39]/40'
            : 'bg-[#0d1017] border-[#181d28]'
        }`}
      >
        <span
          className={`font-mono text-[10px] font-bold truncate ${
            isSelected ? 'text-[#cdff39]' : 'text-[#82889c]'
          }`}
        >
          #{String(item.id).padStart(3, '0')}
        </span>
        <span
          className={`text-[11px] font-medium truncate flex-1 text-right ${
            isSelected ? 'text-white font-bold' : 'text-[#c3c8d8]'
          }`}
          title={`${item.zh} (${item.en})`}
        >
          {item.zh}
        </span>
      </div>
    </div>
  );
};

export const PresetSidebar: React.FC<PresetSidebarProps> = ({
  items,
  selectedItem,
  onSelectItem,
  searchQuery,
  onSearchChange,
  selectedComp,
  onSelectComp,
  selectedWhen,
  onSelectWhen,
  selectedTech,
  onSelectTech,
  favorites,
  onToggleFavorite,
  customText,
  overrides,
}) => {
  const [columns, setColumns] = useState<2 | 3>(3);

  return (
    <aside className="w-[380px] md:w-[420px] lg:w-[460px] flex flex-col h-full bg-[#0b0d13] border-r border-[#1a1e2a] select-none shrink-0 transition-all duration-200">
      {/* Search Header */}
      <div className="p-3 border-b border-[#1a1e2a] flex flex-col gap-2.5 bg-[#0d0f16]">
        {/* Search bar and Column Density Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e7488]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder={`搜索 ${items.length} 款动效（名称/编号/标签）...`}
              className="w-full bg-[#131622] border border-[#232838] focus:border-[#cdff39] focus:outline-none rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-[#656c80] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6e7488] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 3-Column / 2-Column Density Switch */}
          <div className="flex items-center bg-[#131622] p-1 rounded-lg border border-[#232838]">
            <button
              onClick={() => setColumns(3)}
              className={`p-1.5 rounded-md transition-colors ${
                columns === 3
                  ? 'bg-[#cdff39] text-black font-bold shadow'
                  : 'text-[#6e7488] hover:text-white'
              }`}
              title="3列 紧凑画廊模式"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setColumns(2)}
              className={`p-1.5 rounded-md transition-colors ${
                columns === 2
                  ? 'bg-[#cdff39] text-black font-bold shadow'
                  : 'text-[#6e7488] hover:text-white'
              }`}
              title="2列 舒适画廊模式"
            >
              <Grid2X2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Component Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => onSelectComp('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all border ${
              selectedComp === 'all'
                ? 'bg-[#cdff39] text-black border-[#cdff39] font-bold shadow-[0_0_10px_rgba(205,255,57,0.25)]'
                : 'bg-[#141722] text-[#8e94a5] border-[#222736] hover:text-white hover:border-[#32394c]'
            }`}
          >
            全部
          </button>

          <button
            onClick={() => onSelectComp('fav')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all border flex items-center gap-1 ${
              selectedComp === 'fav'
                ? 'bg-[#ffd700] text-black border-[#ffd700] font-bold shadow-[0_0_10px_rgba(255,215,0,0.25)]'
                : 'bg-[#141722] text-[#8e94a5] border-[#222736] hover:text-amber-400 hover:border-amber-400/40'
            }`}
          >
            <Star className="w-3 h-3 fill-current" />
            收藏 ({favorites.length})
          </button>

          {COMPS.map(([key, label, color]) => (
            <button
              key={key}
              onClick={() => onSelectComp(key)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                selectedComp === key
                  ? 'bg-[#1d2230] text-white border-[#cdff39]'
                  : 'bg-[#141722] text-[#8e94a5] border-[#222736] hover:text-white hover:border-[#32394c]'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {label}
            </button>
          ))}
        </div>

        {/* Tech pills and count */}
        <div className="flex items-center justify-between text-[11px] text-[#787f95]">
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#52596d]">
              技术:
            </span>
            {['all', 'CSS', 'GSAP', 'Canvas'].map(tech => (
              <button
                key={tech}
                onClick={() => onSelectTech(tech)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  selectedTech === tech
                    ? 'bg-[#cdff39]/20 text-[#cdff39] font-bold'
                    : 'text-[#787f95] hover:text-white'
                }`}
              >
                {tech === 'all' ? '全部' : tech}
              </button>
            ))}
          </div>

          <span className="font-mono text-[10px] text-[#cdff39]">
            {items.length} 动效
          </span>
        </div>
      </div>

      {/* 3×N / 2×N Mini Gallery Grid */}
      <div className="flex-1 overflow-y-auto p-2.5">
        {items.length === 0 ? (
          <div className="py-16 text-center text-[#6e7488] text-xs flex flex-col items-center gap-2">
            <Filter className="w-6 h-6 opacity-40 text-amber-400" />
            <span>无匹配的动效预设</span>
            <button
              onClick={() => {
                onSearchChange('');
                onSelectComp('all');
                onSelectWhen('all');
                onSelectTech('all');
              }}
              className="text-[#cdff39] underline mt-1 text-[11px]"
            >
              重置筛选条件
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-2 ${
              columns === 3 ? 'grid-cols-3' : 'grid-cols-2'
            }`}
          >
            {items.map(item => (
              <MiniCard
                key={item.id}
                item={item}
                isSelected={selectedItem.id === item.id}
                isFav={favorites.includes(item.id)}
                onSelect={() => onSelectItem(item)}
                onToggleFav={() => onToggleFavorite(item.id)}
                customText={customText}
                overrides={overrides}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
