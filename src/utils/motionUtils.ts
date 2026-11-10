import { MotionItem, CubicBezierCoords, AnimationOverrides } from '../types/motion';

export interface CurvePreset {
  name: string;
  label: string;
  coords: CubicBezierCoords;
  description: string;
}

export const CURVE_PRESETS: CurvePreset[] = [
  {
    name: 'ease-out-quad',
    label: '柔和缓出 (Ease Out)',
    coords: [0.25, 0.46, 0.45, 0.94],
    description: '标准平滑减速，自然优雅',
  },
  {
    name: 'back-out',
    label: '果冻回弹 (Back Out)',
    coords: [0.34, 1.56, 0.64, 1],
    description: '到达终点时轻微冲过并弹回',
  },
  {
    name: 'elastic-snap',
    label: '弹性吸附 (Elastic Snap)',
    coords: [0.68, -0.55, 0.265, 1.55],
    description: '极具张力的橡皮筋弹力效果',
  },
  {
    name: 'power-punch',
    label: '迅猛爆发 (Power Punch)',
    coords: [0.16, 1, 0.3, 1],
    description: '开端极速冲击，迅速收敛',
  },
  {
    name: 'anticipate',
    label: '蓄力回冲 (Anticipate)',
    coords: [0.6, -0.28, 0.735, 0.045],
    description: '先微微后缩蓄势再向前冲',
  },
  {
    name: 'linear',
    label: '线性匀速 (Linear)',
    coords: [0, 0, 1, 1],
    description: '机械连续运动，无加减速',
  },
];

/**
 * Format cubic-bezier string for CSS
 */
export function formatCubicBezier(coords: CubicBezierCoords): string {
  const [x1, y1, x2, y2] = coords.map(n => Math.round(n * 100) / 100);
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
}

/**
 * Approximate cubic bezier curve point at t (0 <= t <= 1)
 */
export function getBezierPoint(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number]
): [number, number] {
  const cx = 3 * (p1[0] - p0[0]);
  const bx = 3 * (p2[0] - p1[0]) - cx;
  const ax = p3[0] - p0[0] - cx - bx;

  const cy = 3 * (p1[1] - p0[1]);
  const by = 3 * (p2[1] - p1[1]) - cy;
  const ay = p3[1] - p0[1] - cy - by;

  const xt = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + p0[0];
  const yt = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + p0[1];

  return [xt, yt];
}

/**
 * Generate SVG Path for cubic bezier visualizer
 */
export function generateBezierPath(
  coords: CubicBezierCoords,
  width: number = 200,
  height: number = 200,
  padding: number = 24
): string {
  const w = width - padding * 2;
  const h = height - padding * 2;

  // Coordinate system: (0, 1) in normalized coords maps to top (padding), (0, 0) maps to bottom (padding + h)
  const startX = padding;
  const startY = padding + h;
  const endX = padding + w;
  const endY = padding;

  const cp1X = padding + coords[0] * w;
  const cp1Y = padding + h - coords[1] * h;

  const cp2X = padding + coords[2] * w;
  const cp2Y = padding + h - coords[3] * h;

  return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
}

/**
 * Filter items by multiple criteria
 */
export function filterMotionItems(
  items: MotionItem[],
  query: string,
  comp: string,
  when: string,
  tech: string,
  favorites: number[] = []
): MotionItem[] {
  const q = query.trim().toLowerCase();

  return items.filter(item => {
    // Text search
    if (q) {
      const matchText = [
        item.id.toString(),
        item.zh,
        item.en,
        item.desc,
        item.style,
        item.tag,
        item.tech,
        item.prompt,
      ]
        .join(' ')
        .toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // Component filter
    if (comp !== 'all' && item.comp !== comp) {
      if (comp === 'fav') {
        if (!favorites.includes(item.id)) return false;
      } else if (comp === 'new') {
        if (!item.isNew) return false;
      } else {
        return false;
      }
    }

    // When filter
    if (when !== 'all' && !item.when.includes(when)) {
      return false;
    }

    // Tech filter
    if (tech !== 'all' && item.tech !== tech) {
      return false;
    }

    return true;
  });
}

/**
 * Generate customized AI Prompt for user
 */
export function generateAIPrompt(
  item: MotionItem,
  customText: string,
  overrides: AnimationOverrides
): string {
  const textPrompt = customText ? `示例文本：「${customText}」` : '';
  const curve = formatCubicBezier(overrides.cubicBezier);
  const timing = `单次周期时长约 ${overrides.duration}s，缓动曲线为 ${curve} (${overrides.easingName})`;
  const colorSpec = `主强调色采用 ${overrides.accentColor}，结合暗色系背景呈现`;
  const staggerSpec = overrides.stagger > 0 ? `，各字元/元素错开延迟 (Stagger) 约 ${Math.round(overrides.stagger * 1000)}ms` : '';

  return `请为我实现「${item.zh} (${item.en})」动效：
${item.prompt}

【工作台调试自定义参数】：
- ${timing}${staggerSpec}
- ${textPrompt}
- ${colorSpec}
- 动效形态倍率：位移幅度 x${overrides.scatterMultiplier}，旋转幅度 x${overrides.rotationMultiplier}
- 代码要求：结构干净、支持响应式，优先采用 CSS Variables 或现代动画库（Motion / GSAP）封装。`;
}

/**
 * Generate CSS Code snippet
 */
export function generateCSSSnippet(
  item: MotionItem,
  overrides: AnimationOverrides
): string {
  const bezier = formatCubicBezier(overrides.cubicBezier);
  return `/* Framli-Motion - ${item.zh} (#${item.id}) */
.motion-container {
  --dur: ${overrides.duration}s;
  --timing: ${bezier};
  --a: ${overrides.accentColor};
  --scatter-scale: ${overrides.scatterMultiplier};
  --rot-scale: ${overrides.rotationMultiplier};
  
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation-duration: var(--dur);
  animation-timing-function: var(--timing);
}

/* 动效核心规则（参考 .fx${item.id}） */
.motion-target {
  color: var(--a);
  animation: fx-${item.id} var(--dur) var(--timing) infinite;
}

@keyframes fx-${item.id} {
  0% {
    opacity: 0;
    transform: scale(${0.8 * overrides.scale});
  }
  50% {
    opacity: 1;
    transform: scale(${1.05 * overrides.scale});
  }
  100% {
    opacity: 1;
    transform: scale(${1.0 * overrides.scale});
  }
}`;
}

/**
 * Generate Motion (Framer Motion) snippet
 */
export function generateMotionSnippet(
  item: MotionItem,
  customText: string,
  overrides: AnimationOverrides
): string {
  const text = customText || item.txt || 'MOTION';
  const [x1, y1, x2, y2] = overrides.cubicBezier;
  return `import { motion } from 'motion/react';

export function ${item.en.replace(/[^a-zA-Z0-9]/g, '')}Motion() {
  const text = "${text}";
  const letters = Array.from(text);

  return (
    <div className="flex items-center justify-center p-6 bg-[#0b0c10] text-[#e0e2ec]">
      <motion.div
        className="flex gap-1 font-bold text-2xl"
        initial="hidden"
        animate="visible"
        transition={{
          staggerChildren: ${overrides.stagger || 0.05},
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        {letters.map((char, index) => (
          <motion.span
            key={index}
            variants={{
              hidden: { opacity: 0, y: ${20 * overrides.scatterMultiplier} },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: ${overrides.duration},
                  ease: [${x1}, ${y1}, ${x2}, ${y2}],
                },
              },
            }}
            style={{ color: index % 2 === 0 ? '${overrides.accentColor}' : '#ffffff' }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}`;
}

/**
 * Generate GSAP Snippet
 */
export function generateGSAPSnippet(
  item: MotionItem,
  customText: string,
  overrides: AnimationOverrides
): string {
  const text = customText || item.txt || 'MOTION';
  return `import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export function use${item.en.replace(/[^a-zA-Z0-9]/g, '')}() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.char-item',
        {
          opacity: 0,
          y: ${30 * overrides.scatterMultiplier},
          scale: ${0.7 * overrides.scale},
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: ${overrides.duration},
          stagger: ${overrides.stagger || 0.06},
          ease: 'power3.out',
          repeat: -1,
          repeatDelay: 1.2,
          yoyo: true,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
}`;
}
