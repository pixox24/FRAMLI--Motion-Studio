import React, { useEffect, useRef, useState } from 'react';
import { MotionItem, AnimationOverrides } from '../types/motion';
import { FX, ticks } from '../motion-engine/motionFx';
import { formatCubicBezier } from '../utils/motionUtils';

interface MotionStageProps {
  item: MotionItem;
  customText: string;
  overrides: AnimationOverrides;
  theme?: string;
  replayKey: number;
  className?: string;
  interactive?: boolean;
}

export const MotionStage: React.FC<MotionStageProps> = ({
  item,
  customText,
  overrides,
  theme,
  replayKey,
  className = '',
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<{
    _timers: any[];
    _kill: (() => void)[];
    _ctx: any;
    _it: MotionItem;
    _st: HTMLElement | null;
  }>({
    _timers: [],
    _kill: [],
    _ctx: null,
    _it: item,
    _st: null,
  });

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const stage = containerRef.current;
    if (!stage) return;

    const card = cardRef.current;
    card._it = item;
    card._st = stage;

    // 1. Teardown previous animation
    card._timers.forEach(clearInterval);
    card._timers = [];
    ticks.delete(card);
    card._kill.forEach(f => {
      try {
        f();
      } catch (err) {
        // ignore
      }
    });
    card._kill = [];
    if (card._ctx) {
      try {
        card._ctx.revert();
      } catch (err) {
        // ignore
      }
      card._ctx = null;
    }
    stage.innerHTML = '';
    setHasError(false);

    // 2. Prepare text
    const targetText =
      customText.trim() && !item.fixed
        ? customText.trim()
        : item.txt || item.zh;

    // 3. Inject CSS overrides & custom properties
    const bezier = formatCubicBezier(overrides.cubicBezier);
    stage.style.setProperty('--a', overrides.accentColor);
    stage.style.setProperty('--dur', `${overrides.duration}s`);
    stage.style.setProperty('--timing', bezier);
    stage.style.setProperty('--scatter-scale', `${overrides.scatterMultiplier}`);
    stage.style.setProperty('--rot-scale', `${overrides.rotationMultiplier}`);
    stage.style.setProperty('--stagger', `${overrides.stagger}s`);

    // Dynamic animation timing override for all child elements
    const styleTagId = `motion-dynamic-style-${item.id}`;
    let dynStyle = document.getElementById(styleTagId) as HTMLStyleElement | null;
    if (!dynStyle) {
      dynStyle = document.createElement('style');
      dynStyle.id = styleTagId;
      document.head.appendChild(dynStyle);
    }
    dynStyle.textContent = `
      .fx${item.id} {
        --a: ${overrides.accentColor} !important;
        --dur: ${overrides.duration}s !important;
      }
      .fx${item.id} .t,
      .fx${item.id} .c,
      .fx${item.id} .w,
      .fx${item.id} span,
      .fx${item.id} div {
        animation-duration: ${overrides.duration}s;
        animation-timing-function: ${bezier};
      }
    `;

    // 4. Execute generator
    try {
      const handler = FX[item.id];
      if (!handler) {
        stage.innerHTML = `<div class="text-[#8e94a5] text-xs">动效 #${item.id} 构建中</div>`;
        return;
      }

      const hasGsap = typeof window !== 'undefined' && (window as any).gsap;

      if (item.tech === 'GSAP') {
        if (hasGsap) {
          card._ctx = (window as any).gsap.context(() => {
            handler(stage, targetText, card);
          }, stage);

          // Apply playback speed to GSAP if any active timelines
          if (overrides.playbackSpeed !== 1 && (window as any).gsap.globalTimeline) {
            (window as any).gsap.globalTimeline.timeScale(overrides.playbackSpeed);
          }
        } else {
          handler(stage, targetText, card);
        }
      } else {
        handler(stage, targetText, card);
      }

      // Handle playback speed for CSS animations via Web Animations API or parent style
      if (overrides.playbackSpeed !== 1 && stage.getAnimations) {
        requestAnimationFrame(() => {
          try {
            const anims = stage.getAnimations({ subtree: true });
            anims.forEach(anim => {
              anim.playbackRate = overrides.playbackSpeed;
            });
          } catch {
            // ignore
          }
        });
      }

    } catch (err) {
      console.error(`Error rendering FX[${item.id}]:`, err);
      setHasError(true);
    }

    // Cleanup on unmount or re-render
    return () => {
      card._timers.forEach(clearInterval);
      card._timers = [];
      ticks.delete(card);
      card._kill.forEach(f => {
        try {
          f();
        } catch {
          // ignore
        }
      });
      card._kill = [];
      if (card._ctx) {
        try {
          card._ctx.revert();
        } catch {
          // ignore
        }
        card._ctx = null;
      }
      if (stage) stage.innerHTML = '';
      if (dynStyle) dynStyle.textContent = '';
    };
  }, [
    item.id,
    customText,
    replayKey,
    overrides.duration,
    overrides.cubicBezier,
    overrides.accentColor,
    overrides.scatterMultiplier,
    overrides.rotationMultiplier,
    overrides.stagger,
    overrides.playbackSpeed,
  ]);

  // Determine stage visual background class
  const bgClass =
    theme === 'grid'
      ? 'grid-bg'
      : theme === 'dark'
      ? 'dark'
      : theme === 'cream'
      ? 'cream'
      : theme === 'acc'
      ? 'acc'
      : item.bg || 'dark';

  return (
    <div
      ref={containerRef}
      className={`stage fx${item.id} ${bgClass} w-full h-full min-h-[160px] rounded-xl relative overflow-hidden select-none transition-colors duration-200 ${
        interactive ? 'cursor-pointer active:scale-[0.99]' : ''
      } ${className}`}
      style={{
        transform: `scale(${overrides.scale})`,
        transformOrigin: 'center center',
      }}
    >
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-amber-300 text-xs font-mono">
          动效加载异常，请尝试重播
        </div>
      )}
    </div>
  );
};
