import React, { useState } from 'react';
import {
  MotionItem,
  AnimationOverrides,
  CubicBezierCoords,
  ActiveTab,
  CodeFormat,
  StageTheme,
} from '../types/motion';
import { SoundSettings, SoundArchetype, SciFiTheme, soundEngine, determineSoundArchetype } from '../audio/soundEngine';
import { CubicBezierEditor } from './CubicBezierEditor';
import {
  generateAIPrompt,
  generateCSSSnippet,
  generateMotionSnippet,
  generateGSAPSnippet,
} from '../utils/motionUtils';
import {
  Sliders,
  Code2,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Palette,
  Clock,
  Layers,
  Volume2,
  VolumeX,
  Play,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';

interface StudioInspectorProps {
  item: MotionItem;
  customText: string;
  overrides: AnimationOverrides;
  onUpdateOverrides: (partial: Partial<AnimationOverrides>) => void;
  onResetOverrides: () => void;
  stageTheme: StageTheme;
  onChangeStageTheme: (theme: StageTheme) => void;
  soundSettings: SoundSettings;
  onUpdateSoundSettings: (partial: Partial<SoundSettings>) => void;
}

const NEON_PALETTE = [
  { name: '电光绿', color: '#cdff39' },
  { name: '赛博青', color: '#00f0ff' },
  { name: '霓虹粉', color: '#ff2d7a' },
  { name: '曜石金', color: '#ffc837' },
  { name: '暗影紫', color: '#9d72ff' },
  { name: '纯净白', color: '#ffffff' },
];

const ARCHETYPE_OPTIONS: { id: 'auto' | SoundArchetype; label: string; desc: string }[] = [
  { id: 'auto', label: '自动智能匹配 (Auto)', desc: '根据动画关键词与运动节奏自适应' },
  { id: 'typewriter', label: '机械打字 (Typewriter Clack)', desc: '按字元敲击与微动机械按键' },
  { id: 'coin_spin', label: '硬币旋转 (Coin Spin & Gyro)', desc: '2~3秒持续金属共振摇摆与停转' },
  { id: 'disintegrate', label: '持续粒子消散 (Particle Fizzle)', desc: '2~3秒细碎沙化与能量蒸发' },
  { id: 'domino', label: '骨牌连锁 (Domino Cascade)', desc: '依序连环击打与落地震荡' },
  { id: 'impact', label: '物理冲击 (Heavy Impact)', desc: '低通沉稳轰鸣 + 金属碰撞' },
  { id: 'laser', label: '激光电弧 (Sci-Fi Laser)', desc: '高能光束切割扫频' },
  { id: 'glitch', label: '赛博解码 (Cyber Glitch)', desc: '极速数据流碎片音' },
  { id: 'explode', label: '粒子爆炸 (Explode)', desc: '空间破裂爆散' },
  { id: 'spring', label: '能量回弹 (Cyber Bounce)', desc: '弹性果冻声波' },
  { id: 'whoosh', label: '疾风掠过 (Air Whoosh)', desc: '带通滤波气流声' },
  { id: 'chime', label: '全息晶体 (Holo Chime)', desc: '空灵科技泛音' },
  { id: 'mechanical', label: '机械锁定 (Mech Lock)', desc: '硬核微动开关' },
  { id: 'pulse', label: '脉冲心跳 (Electro Pulse)', desc: '深沉规律律动' },
];

export const StudioInspector: React.FC<StudioInspectorProps> = ({
  item,
  customText,
  overrides,
  onUpdateOverrides,
  onResetOverrides,
  stageTheme,
  onChangeStageTheme,
  soundSettings,
  onUpdateSoundSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'inspector' | 'sound' | 'code' | 'prompt'>('inspector');
  const [codeFormat, setCodeFormat] = useState<CodeFormat>('css');
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleTestSound = () => {
    soundEngine.play(item, overrides, soundSettings, customText);
  };

  const currentArchetype =
    soundSettings.archetypeOverride === 'auto'
      ? determineSoundArchetype(item)
      : soundSettings.archetypeOverride;

  const aiPromptText = generateAIPrompt(item, customText, overrides);

  const getCodeSnippet = () => {
    switch (codeFormat) {
      case 'css':
        return generateCSSSnippet(item, overrides);
      case 'motion':
        return generateMotionSnippet(item, customText, overrides);
      case 'gsap':
        return generateGSAPSnippet(item, customText, overrides);
      default:
        return generateCSSSnippet(item, overrides);
    }
  };

  return (
    <aside className="w-80 md:w-92 bg-[#0c0e14] border-l border-[#1a1e2a] flex flex-col h-full select-none shrink-0">
      {/* Tab Switcher Header */}
      <div className="flex items-center border-b border-[#1a1e2a] p-1.5 bg-[#090b10] gap-1">
        <button
          onClick={() => setActiveTab('inspector')}
          className={`flex-1 py-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'inspector'
              ? 'bg-[#181d2a] text-[#cdff39] border border-[#2b3346] shadow-sm'
              : 'text-[#82889c] hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          动效
        </button>

        <button
          onClick={() => setActiveTab('sound')}
          className={`flex-1 py-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'sound'
              ? 'bg-[#181d2a] text-[#cdff39] border border-[#2b3346] shadow-sm'
              : 'text-[#82889c] hover:text-white'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          音效 SFX
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'code'
              ? 'bg-[#181d2a] text-[#cdff39] border border-[#2b3346] shadow-sm'
              : 'text-[#82889c] hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          代码
        </button>

        <button
          onClick={() => setActiveTab('prompt')}
          className={`flex-1 py-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'prompt'
              ? 'bg-[#181d2a] text-[#cdff39] border border-[#2b3346] shadow-sm'
              : 'text-[#82889c] hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Prompt
        </button>
      </div>

      {/* Tab 1: Motion Inspector Parameters */}
      {activeTab === 'inspector' && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 text-xs text-[#d1d5db]">
          {/* Header info */}
          <div className="flex items-center justify-between pb-2 border-b border-[#181c28]">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-[#686f84]">
                当前调试对象
              </span>
              <span className="font-bold text-[#e6e9f2] text-sm">
                #{String(item.id).padStart(3, '0')} {item.zh}
              </span>
            </div>
            <button
              onClick={onResetOverrides}
              className="p-1.5 rounded-md bg-[#141722] hover:bg-[#1e2334] text-[#8e94a5] hover:text-[#cdff39] border border-[#232838] transition-colors"
              title="重置全部调试参数"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section: Timing & Duration */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#8e94a5]">
              <span className="flex items-center gap-1.5 text-white">
                <Clock className="w-3.5 h-3.5 text-[#cdff39]" />
                动画时长 Duration
              </span>
              <span className="font-mono text-[#cdff39] bg-[#141722] px-2 py-0.5 rounded border border-[#242a3b]">
                {overrides.duration}s
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="6.0"
              step="0.1"
              value={overrides.duration}
              onChange={e =>
                onUpdateOverrides({ duration: parseFloat(e.target.value) })
              }
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#555d73] font-mono">
              <span>0.2s (极速)</span>
              <span>2.4s (基准)</span>
              <span>6.0s (缓急)</span>
            </div>
          </div>

          {/* Section: Cubic Bezier Curve Visualizer */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#00f0ff]" />
                缓动曲线 Easing Curve
              </span>
              <span className="text-[11px] text-[#8e94a5] font-mono">
                {overrides.easingName}
              </span>
            </div>
            <CubicBezierEditor
              coords={overrides.cubicBezier}
              onChange={(coords: CubicBezierCoords, name?: string) =>
                onUpdateOverrides({
                  cubicBezier: coords,
                  easingName: name || '自定义曲线',
                })
              }
            />
          </div>

          {/* Section: Stagger Delay */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#8e94a5]">
              <span className="text-white">字符交错延时 (Stagger)</span>
              <span className="font-mono text-[#cdff39]">
                {Math.round(overrides.stagger * 1000)}ms
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="0.25"
              step="0.01"
              value={overrides.stagger}
              onChange={e =>
                onUpdateOverrides({ stagger: parseFloat(e.target.value) })
              }
              className="w-full cursor-pointer"
            />
          </div>

          {/* Section: Scatter and Rotation Multipliers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[11px] text-[#8e94a5]">
                <span>位移幅度</span>
                <span className="font-mono text-[#cdff39]">
                  {overrides.scatterMultiplier}x
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={overrides.scatterMultiplier}
                onChange={e =>
                  onUpdateOverrides({
                    scatterMultiplier: parseFloat(e.target.value),
                  })
                }
                className="w-full cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[11px] text-[#8e94a5]">
                <span>旋转幅度</span>
                <span className="font-mono text-[#cdff39]">
                  {overrides.rotationMultiplier}x
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={overrides.rotationMultiplier}
                onChange={e =>
                  onUpdateOverrides({
                    rotationMultiplier: parseFloat(e.target.value),
                  })
                }
                className="w-full cursor-pointer"
              />
            </div>
          </div>

          {/* Section: Accent Color Palette */}
          <div className="flex flex-col gap-2.5 pt-2 border-t border-[#181c28]">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#cdff39]" />
                主题强调色 (Accent)
              </span>
              <span className="font-mono text-[11px] text-[#8e94a5]">
                {overrides.accentColor}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {NEON_PALETTE.map(p => (
                <button
                  key={p.color}
                  onClick={() => onUpdateOverrides({ accentColor: p.color })}
                  className={`w-7 h-7 rounded-lg transition-transform border flex items-center justify-center ${
                    overrides.accentColor.toLowerCase() === p.color.toLowerCase()
                      ? 'scale-115 border-white shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                      : 'border-transparent hover:scale-105 opacity-80'
                  }`}
                  style={{ backgroundColor: p.color }}
                  title={p.name}
                >
                  {overrides.accentColor.toLowerCase() ===
                    p.color.toLowerCase() && (
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  )}
                </button>
              ))}
              <input
                type="color"
                value={overrides.accentColor}
                onChange={e =>
                  onUpdateOverrides({ accentColor: e.target.value })
                }
                className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                title="选择任意颜色"
              />
            </div>
          </div>

          {/* Section: Stage Canvas Background */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#181c28]">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#cdff39]" />
              舞台底色环境
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'dark', label: '曜石暗黑' },
                { id: 'grid', label: '矩阵网格' },
                { id: 'cream', label: '奶油米白' },
                { id: 'acc', label: '高亮强调' },
              ].map(th => (
                <button
                  key={th.id}
                  onClick={() => onChangeStageTheme(th.id as StageTheme)}
                  className={`py-1.5 px-1 text-[11px] rounded-lg border font-medium transition-all text-center ${
                    stageTheme === th.id
                      ? 'bg-[#cdff39]/15 border-[#cdff39] text-[#cdff39]'
                      : 'bg-[#141722] border-[#222736] text-[#8e94a5] hover:text-white'
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sound FX Inspector */}
      {activeTab === 'sound' && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 text-xs text-[#d1d5db]">
          {/* Sound Master Switch & Test Button */}
          <div className="flex items-center justify-between pb-3 border-b border-[#181c28]">
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onUpdateSoundSettings({ enabled: !soundSettings.enabled })
                }
                className={`p-2 rounded-xl transition-all border flex items-center gap-2 ${
                  soundSettings.enabled
                    ? 'bg-[#cdff39]/15 border-[#cdff39] text-[#cdff39] font-bold'
                    : 'bg-[#141722] border-[#242a3a] text-[#6b7285]'
                }`}
              >
                {soundSettings.enabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
                <span>{soundSettings.enabled ? '音效已启用' : '音效已静音'}</span>
              </button>
            </div>

            <button
              onClick={handleTestSound}
              disabled={!soundSettings.enabled}
              className="py-2 px-3 bg-[#1d2232] hover:bg-[#272f44] active:scale-95 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-[#2d364c] transition-all"
            >
              <Play className="w-3.5 h-3.5 text-[#cdff39] fill-current" />
              试听音效
            </button>
          </div>

          {/* Sound Archetype Override */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#cdff39]" />
                音效原型类别 (Archetype)
              </span>
              <span className="font-mono text-[10px] text-[#cdff39] bg-[#141722] px-2 py-0.5 rounded border border-[#232838]">
                {currentArchetype.toUpperCase()}
              </span>
            </div>
            <select
              value={soundSettings.archetypeOverride}
              onChange={e =>
                onUpdateSoundSettings({
                  archetypeOverride: e.target.value as 'auto' | SoundArchetype,
                })
              }
              className="w-full bg-[#131622] border border-[#232838] focus:border-[#cdff39] rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
            >
              {ARCHETYPE_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sci-Fi Sound Style (Cinematic / Cyberpunk / 8-Bit) */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#00f0ff]" />
              音色风格 (Sci-Fi Theme)
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'cinematic', label: '影视大片', desc: '厚重宽广' },
                { id: 'cyberpunk', label: '赛博朋克', desc: '合成滤波' },
                { id: 'retro8bit', label: '8-Bit像素', desc: '复古方波' },
              ].map(theme => (
                <button
                  key={theme.id}
                  onClick={() =>
                    onUpdateSoundSettings({ theme: theme.id as SciFiTheme })
                  }
                  className={`py-2 px-1 rounded-xl border text-center transition-all flex flex-col items-center gap-0.5 ${
                    soundSettings.theme === theme.id
                      ? 'bg-[#cdff39]/15 border-[#cdff39] text-[#cdff39] font-bold shadow-[0_0_10px_rgba(205,255,57,0.15)]'
                      : 'bg-[#131622] border-[#222838] text-[#8e94a5] hover:text-white'
                  }`}
                >
                  <span className="text-xs">{theme.label}</span>
                  <span className="text-[9px] opacity-65 font-mono">{theme.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pitch Slider */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-[#181c28]">
            <div className="flex items-center justify-between text-xs text-[#8e94a5]">
              <span className="text-white font-semibold">基础音调 (Pitch)</span>
              <span className="font-mono text-[#cdff39]">{soundSettings.pitch}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={soundSettings.pitch}
              onChange={e =>
                onUpdateSoundSettings({ pitch: parseFloat(e.target.value) })
              }
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#555d73] font-mono">
              <span>0.5x (深沉厚重)</span>
              <span>1.0x (原声)</span>
              <span>2.0x (高亢清脆)</span>
            </div>
          </div>

          {/* Resonance / Reverb Depth */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-[#8e94a5]">
              <span className="text-white font-semibold">共鸣与尾音 (Resonance)</span>
              <span className="font-mono text-[#cdff39]">
                {Math.round(soundSettings.resonance * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={soundSettings.resonance}
              onChange={e =>
                onUpdateSoundSettings({ resonance: parseFloat(e.target.value) })
              }
              className="w-full cursor-pointer"
            />
          </div>

          {/* Master Volume */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs text-[#8e94a5]">
              <span className="text-white font-semibold">主音量 (Volume)</span>
              <span className="font-mono text-[#cdff39]">
                {Math.round(soundSettings.volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1.0"
              step="0.05"
              value={soundSettings.volume}
              onChange={e =>
                onUpdateSoundSettings({ volume: parseFloat(e.target.value) })
              }
              className="w-full cursor-pointer"
            />
          </div>

          <div className="p-3 bg-[#11141e] border border-[#1e2332] rounded-xl text-[11px] text-[#788096] leading-relaxed">
            💡 <strong className="text-white">音画同步机制</strong>：声音采用原生 Web Audio API 程序化毫秒级驱动，严格遵循每次手动「重播 Replay」或「切换预设」时响一次的规则，避免循环扰耳。
          </div>
        </div>
      )}

      {/* Tab 3: Code Export */}
      {activeTab === 'code' && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          <div className="flex items-center gap-1 bg-[#141722] p-1 rounded-lg border border-[#222736]">
            {[
              { id: 'css', label: 'CSS / 类名' },
              { id: 'motion', label: 'Motion (React)' },
              { id: 'gsap', label: 'GSAP 3' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setCodeFormat(f.id as CodeFormat)}
                className={`flex-1 py-1 text-xs rounded-md font-medium transition-all ${
                  codeFormat === f.id
                    ? 'bg-[#cdff39] text-black font-bold shadow'
                    : 'text-[#8e94a5] hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 flex flex-col">
            <pre className="flex-1 bg-[#090b10] border border-[#1e2332] rounded-xl p-3.5 text-[11px] font-mono text-[#a5adc2] overflow-auto leading-relaxed shadow-inner">
              {getCodeSnippet()}
            </pre>

            <button
              onClick={() => handleCopy(getCodeSnippet())}
              className="mt-3 w-full py-2.5 px-4 bg-[#cdff39] hover:bg-[#d8ff5c] active:scale-[0.99] text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_16px_rgba(205,255,57,0.25)]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950 stroke-[3]" />
                  <span>代码已复制到剪贴板！</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 stroke-[2.5]" />
                  <span>一键复制代码</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: AI Prompt Export */}
      {activeTab === 'prompt' && (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          <div className="text-xs text-[#8e94a5] leading-relaxed">
            该提示词已结合您在当前工作台微调的示例文本、贝塞尔曲线和时长参数，可直接粘贴给
            Cursor / Claude / AI 辅助开发：
          </div>

          <textarea
            readOnly
            value={aiPromptText}
            className="flex-1 min-h-[280px] bg-[#090b10] border border-[#1e2332] rounded-xl p-3.5 text-xs text-[#d1d5db] font-mono leading-relaxed resize-none focus:outline-none select-all"
          />

          <button
            onClick={() => handleCopy(aiPromptText)}
            className="w-full py-2.5 px-4 bg-[#cdff39] hover:bg-[#d8ff5c] active:scale-[0.99] text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_16px_rgba(205,255,57,0.25)]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-950 stroke-[3]" />
                <span>AI 提示词已复制！</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 stroke-[2.5]" />
                <span>复制完整 AI 提示词</span>
              </>
            )}
          </button>
        </div>
      )}
    </aside>
  );
};
