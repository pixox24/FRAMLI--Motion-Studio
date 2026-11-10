export interface MotionItem {
  id: number;
  zh: string;
  en: string;
  desc: string;
  comp: 'text' | 'button' | 'control' | 'card' | 'media' | 'shape' | 'bg' | 'layout' | 'cursor';
  when: string[];
  tech: 'CSS' | 'GSAP' | 'Canvas' | string;
  style: string;
  uses: string[];
  tag: string;
  txt: string;
  bg: 'dark' | 'cream' | 'acc' | string;
  fixed?: boolean;
  isNew?: boolean;
  added: string;
  prompt: string;
}

export type CubicBezierCoords = [number, number, number, number];

export interface AnimationOverrides {
  duration: number; // in seconds
  cubicBezier: CubicBezierCoords;
  easingName: string;
  accentColor: string;
  stagger: number; // in seconds
  scale: number; // multiplier, e.g. 1.0
  scatterMultiplier: number; // 0.2 ~ 3.0
  rotationMultiplier: number; // 0.2 ~ 3.0
  playbackSpeed: number; // 0.25, 0.5, 1, 1.5, 2
  loop: boolean;
}

export type ViewportMode = '16:9' | 'tablet' | '9:16' | 'responsive' | 'mobile';
export type StageTheme = 'dark' | 'cream' | 'acc' | 'grid';
export type ActiveTab = 'inspector' | 'sound' | 'code' | 'prompt';
export type CodeFormat = 'tailwind' | 'css' | 'motion' | 'gsap';
