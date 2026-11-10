import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MotionItem, AnimationOverrides } from '../types/motion';
import { MotionStage } from './MotionStage';
import { generateAIPrompt } from '../utils/motionUtils';
import {
  Sparkles,
  Sliders,
  Star,
  Copy,
  Check,
  Search,
  ArrowRight,
  ChevronDown,
  Activity,
  Layers,
  Cpu,
  Eye,
  Volume2,
  X,
  Compass,
  Zap,
} from 'lucide-react';

interface HomePageProps {
  items: MotionItem[];
  customText: string;
  overrides: AnimationOverrides;
  onEnterStudio: (item?: MotionItem) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedComp: string;
  onSelectComp: (comp: string) => void;
}

const CATEGORY_TABS = [
  { id: 'all', label: '全部动效' },
  { id: 'new', label: '最新发布 NEW' },
  { id: 'fav', label: '我的收藏' },
  { id: 'text', label: '文字 Text' },
  { id: 'button', label: '按钮 Button' },
  { id: 'control', label: '控件 Control' },
  { id: 'card', label: '卡片 Card' },
  { id: 'media', label: '媒体 Media' },
  { id: 'shape', label: '形状 Shape' },
  { id: 'bg', label: '背景 Bg' },
  { id: 'layout', label: '布局 Layout' },
  { id: 'cursor', label: '光标 Cursor' },
];

const SHOWCASE_PRESETS = [
  { id: 339, label: '激光雷达点云' },
  { id: 335, label: '机械分叶翻牌' },
  { id: 347, label: '悬链张拉曲面' },
  { id: 343, label: '钛金磁浮触感' },
  { id: 342, label: '墨染宣纸拓印' },
  { id: 333, label: '色散棱镜折射' },
];

const GalleryCard: React.FC<{
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
      { rootMargin: '250px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="group bg-[#0e1017] border border-[#1c2130] hover:border-[#cdff39]/60 rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(205,255,57,0.12)] hover:-translate-y-1"
    >
      {/* Live Card Preview */}
      <div
        onClick={() => onSelectForStudio(item)}
        className="h-44 w-full relative overflow-hidden bg-[#090b10] cursor-pointer"
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
          <div className="w-full h-full flex items-center justify-center text-[#4f566b] text-xs font-mono">
            <span>{item.txt || item.zh}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
          <span className="font-mono text-[10px] px-2 py-0.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-md text-[#cdff39] font-bold">
            #{String(item.id).padStart(3, '0')}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-white/80 font-mono">
            {item.comp}
          </span>
        </div>

        {/* Top Right: NEW & Favorite */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
          {item.isNew && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider bg-[#cdff39] text-[#0a0c10] shadow-[0_0_12px_rgba(205,255,57,0.7)] uppercase flex items-center gap-1 pointer-events-none">
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

        {/* Hover Hint Overlay */}
        <div className="absolute inset-0 bg-[#090b10]/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none z-10">
          <span className="px-3 py-1.5 rounded-lg bg-[#cdff39] text-black font-bold text-xs flex items-center gap-1.5 shadow-lg">
            <Sliders className="w-3.5 h-3.5" />
            在工作台中调参
          </span>
        </div>
      </div>

      {/* Info & Action Footer */}
      <div className="p-3.5 flex flex-col gap-2 flex-1 justify-between bg-[#0e1017] border-t border-[#181c26]">
        <div>
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-bold text-xs text-white truncate">{item.zh}</h3>
            <span className="text-[10px] font-mono text-[#62687c] truncate">
              {item.en}
            </span>
          </div>
          <p className="text-[11px] text-[#71788e] line-clamp-2 mt-1 leading-relaxed">
            {item.desc}
          </p>
        </div>

        <div className="flex items-center gap-1.5 pt-1 border-t border-[#161a24]">
          <button
            onClick={() => onSelectForStudio(item)}
            className="flex-1 py-1.5 px-2 bg-[#161a26] hover:bg-[#22283a] text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-[#23293c]"
          >
            <Sliders className="w-3 h-3 text-[#cdff39]" />
            进入工作台
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

export const HomePage: React.FC<HomePageProps> = ({
  items,
  customText,
  overrides,
  onEnterStudio,
  favorites,
  onToggleFavorite,
  searchQuery,
  onSearchChange,
  selectedComp,
  onSelectComp,
}) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax mouse tilt coordinates
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Currently showcased item in the Hero visual stage
  const [showcaseId, setShowcaseId] = useState<number>(339);
  const showcaseItem = useMemo(() => {
    return items.find(it => it.id === showcaseId) || items[0];
  }, [items, showcaseId]);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  const handleScrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#07080c] text-[#e0e2ec] scroll-smooth">
      {/* ========================================================================= */}
      {/* HERO SECTION WITH ATMOSPHERIC 3D PARALLAX                                 */}
      {/* ========================================================================= */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-[88vh] flex flex-col justify-center items-center px-4 md:px-8 py-16 overflow-hidden border-b border-[#181c26]"
      >
        {/* Parallax Layer 1: Ambient Radiance & Dark Grid */}
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out"
          style={{
            transform: `translate3d(${mouseOffset.x * -25}px, ${mouseOffset.y * -25}px, 0)`,
          }}
        >
          {/* Neon Lime Radial Spot */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-radial from-[#cdff39]/12 via-[#cdff39]/3 to-transparent rounded-full blur-3xl pointer-events-none" />
          {/* Subtle cyan glow accent */}
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-radial from-[#38bdf8]/8 to-transparent rounded-full blur-3xl pointer-events-none" />
          {/* Grid mesh texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        {/* Parallax Layer 2: Floating Kinetic Badges */}
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-500 ease-out hidden lg:block"
          style={{
            transform: `translate3d(${mouseOffset.x * 40}px, ${mouseOffset.y * 40}px, 0)`,
          }}
        >
          {/* Badge 1: Top Left */}
          <div className="absolute top-20 left-[10%] px-3 py-1.5 rounded-xl bg-[#10131c]/80 backdrop-blur-md border border-[#212738] flex items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            <Cpu className="w-3.5 h-3.5 text-[#cdff39]" />
            <span className="text-[11px] font-mono font-semibold text-white/90">
              CUBIC-BEZIER TUNING
            </span>
          </div>

          {/* Badge 2: Right Top */}
          <div className="absolute top-28 right-[12%] px-3 py-1.5 rounded-xl bg-[#10131c]/80 backdrop-blur-md border border-[#212738] flex items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            <Volume2 className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="text-[11px] font-mono font-semibold text-white/90">
              13 SOUND ARCHETYPES
            </span>
          </div>

          {/* Badge 3: Bottom Left */}
          <div className="absolute bottom-28 left-[14%] px-3 py-1.5 rounded-xl bg-[#10131c]/80 backdrop-blur-md border border-[#212738] flex items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            <Activity className="w-3.5 h-3.5 text-[#e879f9]" />
            <span className="text-[11px] font-mono font-semibold text-white/90">
              SUB-MILLIMETER HAPTICS
            </span>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Version / Category Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141824] border border-[#252c40] text-xs font-mono mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#cdff39] animate-pulse" />
            <span className="text-[#cdff39] font-bold">FRAMLI-MOTION</span>
            <span className="text-white/40">/</span>
            <span className="text-white/80">350+ 工业级全品类动效工作台</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.08]">
            触手可及的{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cdff39] via-[#e2ff7a] to-[#38bdf8] drop-shadow-[0_0_35px_rgba(205,255,57,0.35)]">
              工业级动效
            </span>
            <br />
            与物理声学工坊
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-sm sm:text-base md:text-lg text-[#949cb3] leading-relaxed mb-10">
            专为现代 Web 开发者与高级设计工程师打造的动效平台。集成 350+ 经典机械、流体、
            光电与几何力学动效预设，配备毫秒级物理声学合成与贝塞尔曲线实时调试，一键导出生产级代码。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <button
              onClick={() => onEnterStudio(showcaseItem)}
              className="px-7 py-3.5 rounded-xl bg-[#cdff39] hover:bg-[#d8ff5c] text-black font-extrabold text-sm sm:text-base transition-all duration-200 shadow-[0_0_25px_rgba(205,255,57,0.4)] hover:shadow-[0_0_35px_rgba(205,255,57,0.6)] hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4 fill-current" />
              进入工作台调试
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={handleScrollToGallery}
              className="px-6 py-3.5 rounded-xl bg-[#141722]/80 hover:bg-[#1e2334] text-white font-bold text-sm sm:text-base border border-[#2a3146] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 cursor-pointer backdrop-blur-md shadow-lg"
            >
              <Compass className="w-4 h-4 text-[#cdff39]" />
              探索 350+ 预设画廊
              <ChevronDown className="w-4 h-4 text-white/50" />
            </button>
          </div>

          {/* Interactive Hero Motion Showcase Stage */}
          <div
            className="w-full max-w-3xl perspective-[1200px] transition-transform duration-300 ease-out"
            style={{
              transform: `rotateX(${mouseOffset.y * -14}deg) rotateY(${mouseOffset.x * 14}deg)`,
            }}
          >
            <div className="relative rounded-2xl bg-[#090b10] border border-[#242b3e] shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(205,255,57,0.1)] p-3 md:p-4 backdrop-blur-xl">
              {/* Window Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#181d2a] text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="font-mono text-[#788199] text-[11px] ml-2">
                    FRAMLI-STAGE // #{String(showcaseItem.id).padStart(3, '0')} {showcaseItem.en}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#cdff39]/15 text-[#cdff39] font-mono text-[10px] font-bold border border-[#cdff39]/30">
                    LIVE PREVIEW
                  </span>
                  <button
                    onClick={() => onEnterStudio(showcaseItem)}
                    className="px-2.5 py-1 rounded bg-[#1b202e] hover:bg-[#252c40] text-white text-[11px] font-semibold transition-colors flex items-center gap-1 border border-[#2b334a]"
                  >
                    在工作台中展开
                    <ArrowRight className="w-3 h-3 text-[#cdff39]" />
                  </button>
                </div>
              </div>

              {/* The Live Showcase Viewport */}
              <div className="h-64 sm:h-80 w-full relative rounded-xl overflow-hidden bg-[#050608] border border-[#141824] flex items-center justify-center">
                <MotionStage
                  item={showcaseItem}
                  customText={customText}
                  overrides={overrides}
                  theme={showcaseItem.bg || 'dark'}
                  replayKey={0}
                  className="w-full h-full"
                  interactive={true}
                />
              </div>

              {/* Showcase preset quick selector tabs */}
              <div className="mt-3 pt-2.5 border-t border-[#181d2a] flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="text-[#676f84] text-[11px] flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#cdff39]" />
                  精选旗舰动效速览:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {SHOWCASE_PRESETS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setShowcaseId(p.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        showcaseId === p.id
                          ? 'bg-[#cdff39] text-black font-bold shadow-sm'
                          : 'bg-[#12151f] text-[#868d9f] hover:text-white border border-[#1e2332]'
                      }`}
                    >
                      #{p.id} {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Key Value Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full max-w-4xl text-left">
            <div className="p-4 rounded-xl bg-[#0d0f16] border border-[#1a1f2c] flex flex-col gap-1">
              <span className="text-2xl sm:text-3xl font-black text-[#cdff39] font-mono">
                350+
              </span>
              <span className="text-xs font-bold text-white">工业级动效预设</span>
              <span className="text-[11px] text-[#71788e]">
                覆盖文字、按键、卡尺、黑曜石与索网等 9 大品类
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0d0f16] border border-[#1a1f2c] flex flex-col gap-1">
              <span className="text-2xl sm:text-3xl font-black text-[#38bdf8] font-mono">
                13 种
              </span>
              <span className="text-xs font-bold text-white">物理声学合成原型</span>
              <span className="text-[11px] text-[#71788e]">
                内置 Web Audio 引擎，毫秒级音画精准对齐
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0d0f16] border border-[#1a1f2c] flex flex-col gap-1">
              <span className="text-2xl sm:text-3xl font-black text-[#a78bfa] font-mono">
                16:9 / 9:16
              </span>
              <span className="text-xs font-bold text-white">双模自适应安全画布</span>
              <span className="text-[11px] text-[#71788e]">
                采用 cqw 容器查询，杜绝边框被裁切溢出
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0d0f16] border border-[#1a1f2c] flex flex-col gap-1">
              <span className="text-2xl sm:text-3xl font-black text-[#f472b6] font-mono">
                0-Config
              </span>
              <span className="text-xs font-bold text-white">一键代码与 AI 提示词</span>
              <span className="text-[11px] text-[#71788e]">
                即时复制 CSS、GSAP、React Motion 与提示词
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* GALLERY SECTION                                                           */}
      {/* ========================================================================= */}
      <section ref={galleryRef} className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Section Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-[#1b1f2c]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#cdff39]/10 text-[#cdff39] font-mono text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5" />
              PRESET LIBRARY
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              全量动效画廊
              <span className="text-sm font-mono font-normal text-[#788198] px-2 py-0.5 bg-[#141824] border border-[#23293c] rounded-md">
                共 {items.length} 款
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#788198] mt-1">
              自由筛选浏览，点击任意动效卡片即可将其载入工作台进行高精度的曲线、缓动与时长调参。
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#646b80]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="搜索预设名称、英文或编号..."
              className="w-full pl-9 pr-8 py-2 bg-[#10131d] border border-[#212738] focus:border-[#cdff39] rounded-xl text-xs text-white placeholder-[#555d72] outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#646b80] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onSelectComp(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedComp === tab.id
                  ? 'bg-[#cdff39] text-black font-bold shadow-[0_0_12px_rgba(205,255,57,0.3)]'
                  : 'bg-[#11141e] text-[#858ca0] hover:text-white hover:bg-[#181d2a] border border-[#1f2434]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {items.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#141824] border border-[#23293c] flex items-center justify-center text-[#6e768e] mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">未找到匹配的动效</h3>
            <p className="text-xs text-[#6e768e] mb-4">
              请尝试清除筛选条件或更换搜索关键词
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                onSelectComp('all');
              }}
              className="px-4 py-2 bg-[#cdff39] text-black font-bold text-xs rounded-lg"
            >
              重置所有筛选
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map(item => (
              <GalleryCard
                key={item.id}
                item={item}
                customText={customText}
                overrides={overrides}
                onSelectForStudio={onEnterStudio}
                isFav={favorites.includes(item.id)}
                onToggleFavorite={onToggleFavorite}
                copiedId={copiedId}
                onCopyPrompt={handleCopyPrompt}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-[#181c26] text-center text-xs text-[#5d6478]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-white">FRAMLI-MOTION</span>
            <span>· 专业级动效预览与参数调试工坊</span>
          </div>
          <div>集成 350+ 动效预设 · 基于 React 19 + TypeScript + Tailwind CSS</div>
        </div>
      </footer>
    </div>
  );
};
