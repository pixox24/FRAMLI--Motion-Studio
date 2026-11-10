import React, { useState } from 'react';
import { Sparkles, Home, Sliders, HelpCircle, X, Volume2, VolumeX } from 'lucide-react';
import { SoundSettings } from '../audio/soundEngine';

const SOCIAL_LINKS = [
  {
    id: 'x',
    label: 'X / @Gotoobig',
    shortLabel: 'X',
    href: 'https://x.com/Gotoobig',
    path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  },
  {
    id: 'github',
    label: 'GitHub 仓库',
    shortLabel: 'GitHub',
    href: 'https://github.com/pixox24/FRAMLI--Motion-Studio',
    path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
];

interface HeaderProps {
  viewMode: 'home' | 'studio';
  onViewModeChange: (mode: 'home' | 'studio') => void;
  totalCount: number;
  soundSettings: SoundSettings;
  onUpdateSoundSettings: (partial: Partial<SoundSettings>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  totalCount,
  soundSettings,
  onUpdateSoundSettings,
}) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
      <header className="h-14 border-b border-[#181c26] bg-[#090b10] px-4 md:px-6 flex items-center justify-between select-none shrink-0 z-20">
        {/* Brand identity (clickable to return home) */}
        <div
          onClick={() => onViewModeChange('home')}
          className="flex items-center gap-3 cursor-pointer group"
          title="点击返回首页"
        >
          <div className="w-8 h-8 rounded-lg bg-[#cdff39]/15 border border-[#cdff39] flex items-center justify-center text-[#cdff39] shadow-[0_0_12px_rgba(205,255,57,0.3)] group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 fill-current" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm text-white tracking-wide flex items-center gap-1.5 font-mono group-hover:text-[#cdff39] transition-colors">
                FRAMLI<span className="text-[#cdff39]">-MOTION</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.2 rounded-full text-[10px] font-mono bg-[#cdff39]/15 text-[#cdff39] border border-[#cdff39]/30 font-semibold">
                {totalCount} 预设
              </span>
            </div>
            <span className="text-[10px] text-[#6d7488] hidden md:block">
              专业动画预览与贝塞尔曲线调试工作台
            </span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-3">
          {/* Quick Audio Mute & Volume */}
          <div className="flex items-center gap-1.5 bg-[#12151e] px-2.5 py-1 rounded-xl border border-[#212738]">
            <button
              onClick={() =>
                onUpdateSoundSettings({ enabled: !soundSettings.enabled })
              }
              className={`p-1 rounded-md transition-colors ${
                soundSettings.enabled
                  ? 'text-[#cdff39] hover:bg-[#1a202c]'
                  : 'text-[#6e7488] hover:text-white'
              }`}
              title={soundSettings.enabled ? '音效已开启 (点击静音)' : '音效已静音 (点击开启)'}
            >
              {soundSettings.enabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {soundSettings.enabled && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={soundSettings.volume}
                onChange={e =>
                  onUpdateSoundSettings({ volume: parseFloat(e.target.value) })
                }
                className="w-16 h-1 cursor-pointer accent-[#cdff39]"
                title={`音量: ${Math.round(soundSettings.volume * 100)}%`}
              />
            )}
          </div>

          {/* Home vs Studio Navigation Button */}
          {viewMode === 'home' ? (
            <button
              onClick={() => onViewModeChange('studio')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#cdff39] hover:bg-[#d8ff5c] text-black shadow-[0_0_15px_rgba(205,255,57,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 fill-current" />
              <span>进入工作台</span>
            </button>
          ) : (
            <button
              onClick={() => onViewModeChange('home')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#12151e] hover:bg-[#1a202c] text-[#8e94a5] hover:text-white border border-[#212738] transition-all cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#cdff39]" />
              <span>返回首页</span>
            </button>
          )}

          {/* Guide / About Button */}
          <button
            onClick={() => setShowGuide(true)}
            className="p-2 rounded-lg bg-[#12151e] hover:bg-[#1b202c] border border-[#212738] text-[#8e94a5] hover:text-[#cdff39] transition-colors"
            title="工作台使用指南与项目说明"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* External links: author's X profile & source repository */}
          <div className="flex items-center gap-1 pl-2.5 border-l border-[#212738]">
            {SOCIAL_LINKS.map(link => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                title={link.label}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#12151e] hover:bg-[#1b202c] border border-[#212738] text-[#8e94a5] hover:text-[#cdff39] hover:border-[#cdff39]/40 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 shrink-0"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d={link.path} />
                </svg>
                <span className="hidden xl:inline text-[11px] font-mono font-semibold">
                  {link.shortLabel}
                </span>
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0f121a] border border-[#22283a] rounded-2xl max-w-lg w-full p-6 text-xs text-[#cad0e0] flex flex-col gap-4 shadow-2xl relative">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#1a1f2c] text-[#8e94a5] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-[#1c2232] pb-3">
              <Sparkles className="w-4 h-4 text-[#cdff39]" />
              Framli-Motion 工作台使用指南
            </div>

            <div className="flex flex-col gap-3 leading-relaxed">
              <div className="bg-[#141824] p-3 rounded-xl border border-[#23293c]">
                <span className="font-semibold text-white block mb-1">
                  1. 示例文本实时驱动
                </span>
                在顶部输入框中输入您想要测试的文本、标点或数字，340+ 款动效（支持字符分拆、路径轨迹、物理破碎等）将实时重绘生效。
              </div>

              <div className="bg-[#141824] p-3 rounded-xl border border-[#23293c]">
                <span className="font-semibold text-white block mb-1">
                  2. 贝塞尔曲线与时长微调
                </span>
                右侧 Inspector 面板内置可视化贝塞尔曲线手柄，支持拖动控制点（P1 / P2）或选择果冻回弹、迅猛爆发等预设，微调时长（0.2s - 6s）与各字元错开交错时间。
              </div>

              <div className="bg-[#141824] p-3 rounded-xl border border-[#23293c]">
                <span className="font-semibold text-white block mb-1">
                  3. 毫秒级音画同步声效
                </span>
                内置程序化 Web Audio 合成器，支持机械打字按键声、硬币旋转泛音、持续粒子消散、激光电弧等 13 种科幻与物理声学原型，音高与节奏随文字与时长毫秒级对齐。
              </div>

              <div className="bg-[#141824] p-3 rounded-xl border border-[#23293c]">
                <span className="font-semibold text-white block mb-1">
                  4. 多端代码与 AI 提示词导出
                </span>
                调参完成后，可一键复制 CSS Keyframes 规则、React Motion 代码、GSAP 补间逻辑，或直接复制包含精确动作与曲线的 AI 提示词。
              </div>
            </div>

            <div className="pt-2 border-t border-[#1c2232] flex items-center justify-between text-[11px] text-[#6d7488]">
              <span>Framli-Motion 全量动效工作台 ({totalCount} Presets)</span>
              <button
                onClick={() => setShowGuide(false)}
                className="px-4 py-1.5 bg-[#cdff39] hover:bg-[#d8ff5c] text-black font-bold rounded-lg transition-colors"
              >
                开始体验
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
