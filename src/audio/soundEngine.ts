import { MotionItem, AnimationOverrides } from '../types/motion';

export type SoundArchetype =
  | 'typewriter'
  | 'coin_spin'
  | 'disintegrate'
  | 'domino'
  | 'impact'
  | 'laser'
  | 'glitch'
  | 'explode'
  | 'spring'
  | 'whoosh'
  | 'chime'
  | 'mechanical'
  | 'pulse';

export type SciFiTheme = 'cinematic' | 'cyberpunk' | 'retro8bit';

export interface SoundSettings {
  enabled: boolean;
  volume: number; // 0.0 ~ 1.0
  pitch: number; // 0.5 ~ 2.0
  archetypeOverride: 'auto' | SoundArchetype;
  theme: SciFiTheme;
  resonance: number; // 0.0 ~ 1.0
}

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  enabled: true,
  volume: 0.35,
  pitch: 1.0,
  archetypeOverride: 'auto',
  theme: 'cinematic',
  resonance: 0.5,
};

/**
 * Determine best matching sound archetype based on motion item characteristics
 */
export function determineSoundArchetype(item: MotionItem): SoundArchetype {
  const combinedText = `${item.zh} ${item.en} ${item.desc} ${item.style} ${item.tag}`.toLowerCase();

  // 1. Laser slice & LiDAR scanning & Catenary curves
  if (/雷射|激光|切斷|切断|laser|slice|beam|lidar|雷达|悬链|catenary/.test(combinedText)) {
    return 'laser';
  }

  // 2. Domino cascade & Kirigami unfolding & Modulor realignment
  if (/骨牌|domino|連鎖|连锁|纸艺|折纸|kirigami|origami|模度|modulor/.test(combinedText)) {
    return 'domino';
  }

  // 3. Coin spin & Gyro wobble
  if (/硬幣|硬币|翻轉|翻转|coin|spin|gyro/.test(combinedText)) {
    return 'coin_spin';
  }

  // 4. Granular particle disintegration & Quantum collapse
  if (/粒子|化為粒子|化为粒子|disintegrate|crumb|蒸發|沙化|碎成粒子|量子|quantum|坍缩/.test(combinedText)) {
    return 'disintegrate';
  }

  // 5. Sequential typewriter & keystrokes
  if (/打字|敲擊|敲击|字幕|type|typewriter|keystroke|terminal|代碼|输入/.test(combinedText)) {
    return 'typewriter';
  }
  if (/亂碼|乱码|解碼|像素|pixel|scramble|decode|matrix|駭客/.test(combinedText)) {
    return 'glitch';
  }
  if (/爆炸|炸飛|explode|shatter|confetti|噴出|灼烧|胶片|burn|ember/.test(combinedText)) {
    return 'explode';
  }
  if (/彈跳|弹跳|bounce|spring|elastic/.test(combinedText)) {
    return 'spring';
  }
  if (/閃電|砸落|雷鳴|重力|impact|strike|slam|fall|gravity|磁流体|针尖|ferrofluid|黑曜石|monolith|玄石/.test(combinedText)) {
    return 'impact';
  }
  if (/波浪|旗幟|飄揚|穿梭|疾走|wave|flag|swoosh|wind|flow|scroll|水墨|宣纸|拓印|墨染|sumi|ink|黑胶|vinyl|声槽/.test(combinedText)) {
    return 'whoosh';
  }
  if (/漸層|萬花筒|圓環|水面|晶體|kaleido|ring|reflect|shimmer|chime|star|棱镜|色散|克拉尼|cymatics|prism/.test(combinedText)) {
    return 'chime';
  }
  if (/心跳|脈動|心電圖|呼吸|beat|pulse|heart|ecg|生物发光|流体|渗透|viscous|地质|断层|琥珀|strata|rift/.test(combinedText)) {
    return 'pulse';
  }
  if (/卡拉ok|鐘擺|齒輪|gear|clock|click|swing|快门|光圈|shutter|iris|aperture|分叶|翻牌|split-flap|solari|钛金|按键|游标|刻度盘|度盘|vernier|caliper|旁轴|准星|reticle|rangefinder/.test(combinedText)) {
    return 'mechanical';
  }

  // Fallback by component category
  switch (item.comp) {
    case 'text':
      return 'typewriter';
    case 'button':
    case 'control':
      return 'mechanical';
    case 'shape':
      return 'laser';
    case 'bg':
      return 'whoosh';
    default:
      return 'impact';
  }
}

/**
 * Procedural Web Audio API Sound Generator
 */
class SoundEngine {
  private ctx: AudioContext | null = null;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Play procedural sound effect matching the motion and settings
   */
  public play(
    item: MotionItem,
    overrides: AnimationOverrides,
    settings: SoundSettings,
    customText: string = ''
  ) {
    if (!settings.enabled || settings.volume <= 0.01) return;

    const ctx = this.initContext();
    if (!ctx) return;

    const archetype =
      settings.archetypeOverride === 'auto'
        ? determineSoundArchetype(item)
        : settings.archetypeOverride;

    const now = ctx.currentTime;
    const basePitch = settings.pitch;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(settings.volume * 0.8, now);
    masterGain.connect(ctx.destination);

    // Number of characters for staggered cadence
    const textToPlay = (customText || item.txt || item.zh).trim();
    const charCount = Math.min(16, Math.max(1, textToPlay.length));
    const staggerTime = Math.max(0.04, Math.min(0.2, overrides.stagger || 0.06));
    const duration = Math.max(0.4, overrides.duration || 2.4);

    switch (archetype) {
      case 'typewriter':
        this.playMechanicalTypewriter(ctx, masterGain, now, basePitch, charCount, staggerTime, settings);
        break;

      case 'coin_spin':
        this.playCoinSpin(ctx, masterGain, now, basePitch, duration, settings);
        break;

      case 'disintegrate':
        this.playParticleDisintegration(ctx, masterGain, now, basePitch, duration, settings);
        break;

      case 'domino':
        this.playDominoCascade(ctx, masterGain, now, basePitch, charCount, staggerTime, settings);
        break;

      case 'impact':
        this.playCinematicImpact(ctx, masterGain, now, basePitch, settings);
        break;

      case 'laser':
        this.playSciFiLaser(ctx, masterGain, now, basePitch, settings);
        break;

      case 'glitch':
        this.playCyberGlitch(ctx, masterGain, now, basePitch, charCount, staggerTime, settings);
        break;

      case 'explode':
        this.playSciFiExplosion(ctx, masterGain, now, basePitch, settings);
        break;

      case 'spring':
        this.playCyberBounce(ctx, masterGain, now, basePitch, charCount, staggerTime, settings);
        break;

      case 'whoosh':
        this.playCinematicWhoosh(ctx, masterGain, now, basePitch, duration, settings);
        break;

      case 'chime':
        this.playHologramChime(ctx, masterGain, now, basePitch, charCount, staggerTime, settings);
        break;

      case 'mechanical':
        this.playMechanicalLock(ctx, masterGain, now, basePitch, charCount, staggerTime, settings);
        break;

      case 'pulse':
        this.playHeartbeatPulse(ctx, masterGain, now, basePitch, settings);
        break;

      default:
        this.playCinematicImpact(ctx, masterGain, now, basePitch, settings);
    }
  }

  /**
   * 1. NEW: Mechanical Keyboard Typewriter (逐字敲击键盘音)
   * Plays tactile switch clicks per character with realistic acoustics & subtle micro-randomization
   */
  private playMechanicalTypewriter(
    ctx: AudioContext,
    dest: GainNode,
    now: number,
    pitch: number,
    charCount: number,
    stagger: number,
    settings: SoundSettings
  ) {
    const is8Bit = settings.theme === 'retro8bit';

    for (let i = 0; i < charCount; i++) {
      // Natural cadence: slight organic humanization of timing
      const jitter = (Math.random() - 0.5) * 0.015;
      const t = now + Math.max(0, i * stagger + jitter);

      // Micro-random pitch variance for organic keyboard tactile feedback
      const microPitch = pitch * (0.95 + Math.random() * 0.12);

      // Component A: Crisp high-frequency switch click
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = is8Bit ? 'square' : 'triangle';
      clickOsc.frequency.setValueAtTime((is8Bit ? 1400 : 2800) * microPitch, t);
      clickOsc.frequency.exponentialRampToValueAtTime(800 * microPitch, t + 0.025);

      clickGain.gain.setValueAtTime(0.7, t);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

      clickOsc.connect(clickGain);
      clickGain.connect(dest);
      clickOsc.start(t);
      clickOsc.stop(t + 0.04);

      // Component B: Keycap bottom-out thud / body resonance
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(320 * microPitch, t);
      thudOsc.frequency.exponentialRampToValueAtTime(90 * microPitch, t + 0.04);

      thudGain.gain.setValueAtTime(0.5, t);
      thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      thudOsc.connect(thudGain);
      thudGain.connect(dest);
      thudOsc.start(t);
      thudOsc.stop(t + 0.07);

      // Optional mechanical spacebar accent on last character
      if (i === charCount - 1) {
        const returnOsc = ctx.createOscillator();
        const returnGain = ctx.createGain();
        returnOsc.type = 'sine';
        returnOsc.frequency.setValueAtTime(450 * microPitch, t + 0.04);
        returnOsc.frequency.exponentialRampToValueAtTime(120 * microPitch, t + 0.12);

        returnGain.gain.setValueAtTime(0.4, t + 0.04);
        returnGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

        returnOsc.connect(returnGain);
        returnGain.connect(dest);
        returnOsc.start(t + 0.04);
        returnOsc.stop(t + 0.15);
      }
    }
  }

  /**
   * 2. NEW: Coin Spin & Metallic Gyro (持续硬币旋转与金属陀螺摆动)
   * Sustained oscillating metallic resonance lasting 2.0s ~ 2.8s, accelerating then settling
   */
  private playCoinSpin(
    ctx: AudioContext,
    dest: GainNode,
    now: number,
    pitch: number,
    duration: number,
    settings: SoundSettings
  ) {
    const spinDuration = Math.min(2.8, Math.max(1.8, duration * 0.9));
    const is8Bit = settings.theme === 'retro8bit';

    // Base metallic bell tone 1
    const bell1 = ctx.createOscillator();
    const bellGain = ctx.createGain();
    bell1.type = is8Bit ? 'sawtooth' : 'sine';
    bell1.frequency.setValueAtTime(1760 * pitch, now);

    // Harmonic bell tone 2
    const bell2 = ctx.createOscillator();
    bell2.type = 'sine';
    bell2.frequency.setValueAtTime(2640 * pitch, now);

    // LFO Amplitude Modulator: Simulates wobbling spin speed that starts fast and slows down
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    // Frequency ramps down as spin slows down from 14Hz down to 2Hz
    lfo.frequency.setValueAtTime(14 * pitch, now);
    lfo.frequency.exponentialRampToValueAtTime(2.5, now + spinDuration * 0.85);

    lfoGain.gain.setValueAtTime(0.5, now);
    lfo.connect(lfoGain.gain);

    // Overall envelope: initial strike, sustained spin wobble, final metallic settle clink
    bellGain.gain.setValueAtTime(0.8, now);
    bellGain.gain.linearRampToValueAtTime(0.4, now + 0.3);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + spinDuration);

    bell1.connect(bellGain);
    bell2.connect(bellGain);
    bellGain.connect(dest);

    bell1.start(now);
    bell2.start(now);
    lfo.start(now);

    bell1.stop(now + spinDuration);
    bell2.stop(now + spinDuration);
    lfo.stop(now + spinDuration);

    // Final settle 'clink' at the end of the spin
    const endClinkTime = now + spinDuration * 0.92;
    const clink = ctx.createOscillator();
    const clinkGain = ctx.createGain();
    clink.type = 'triangle';
    clink.frequency.setValueAtTime(3200 * pitch, endClinkTime);
    clink.frequency.exponentialRampToValueAtTime(1200 * pitch, endClinkTime + 0.08);

    clinkGain.gain.setValueAtTime(0.6, endClinkTime);
    clinkGain.gain.exponentialRampToValueAtTime(0.001, endClinkTime + 0.12);

    clink.connect(clinkGain);
    clinkGain.connect(dest);
    clink.start(endClinkTime);
    clink.stop(endClinkTime + 0.14);
  }

  /**
   * 3. NEW: Sustained Particle Disintegration (持续粒子消散 / 细碎沙化)
   * Granular crumble texture and high-pass dissolving fizzle spanning 2.0s ~ 2.6s
   */
  private playParticleDisintegration(
    ctx: AudioContext,
    dest: GainNode,
    now: number,
    pitch: number,
    duration: number,
    settings: SoundSettings
  ) {
    const disDuration = Math.min(2.8, Math.max(1.8, duration * 0.85));

    // Sustained granular white/pink noise buffer
    const noise = this.createNoiseBuffer(ctx, disDuration);
    if (noise) {
      const source = ctx.createBufferSource();
      source.buffer = noise;

      // Resonant bandpass sweep: shifts upwards as particles disperse and fade
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800 * pitch, now);
      filter.frequency.exponentialRampToValueAtTime(4500 * pitch, now + disDuration * 0.7);
      filter.Q.setValueAtTime(4 + settings.resonance * 6, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.65, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + disDuration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      source.start(now);
    }

    // Granular micro-pops scattered across the 2 seconds
    const popCount = 14;
    for (let i = 0; i < popCount; i++) {
      const popTime = now + (i / popCount) * disDuration * 0.8 + Math.random() * 0.08;
      const pop = ctx.createOscillator();
      const popGain = ctx.createGain();
      pop.type = 'sine';
      pop.frequency.setValueAtTime((1200 + Math.random() * 2200) * pitch, popTime);

      popGain.gain.setValueAtTime(0.2, popTime);
      popGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.04);

      pop.connect(popGain);
      popGain.connect(dest);
      pop.start(popTime);
      pop.stop(popTime + 0.05);
    }
  }

  /**
   * 4. NEW: Domino Cascade (骨牌连续倒下连击)
   * Rhythmic sequential impacts click-click-click-thud
   */
  private playDominoCascade(
    ctx: AudioContext,
    dest: GainNode,
    now: number,
    pitch: number,
    charCount: number,
    stagger: number,
    settings: SoundSettings
  ) {
    const dominoCount = Math.max(4, charCount);
    for (let i = 0; i < dominoCount; i++) {
      const t = now + i * Math.max(0.05, stagger * 0.9);
      const isLast = i === dominoCount - 1;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';

      // Pitch slightly rises as dominoes tumble
      const freq = (500 + i * 40) * pitch;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(120 * pitch, t + 0.04);

      gain.gain.setValueAtTime(isLast ? 0.8 : 0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (isLast ? 0.25 : 0.06));

      osc.connect(gain);
      gain.connect(dest);
      osc.start(t);
      osc.stop(t + (isLast ? 0.26 : 0.07));
    }
  }

  /**
   * 5. Cinematic Heavy Impact
   */
  private playCinematicImpact(
    ctx: AudioContext,
    dest: GainNode,
    now: number,
    pitch: number,
    settings: SoundSettings
  ) {
    // Sub-bass Drop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = settings.theme === 'retro8bit' ? 'square' : 'sine';
    osc.frequency.setValueAtTime(140 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(32 * pitch, now + 0.45);

    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.5);

    // Metallic impact crack
    const noise = this.createNoiseBuffer(ctx, 0.1);
    if (noise) {
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noise;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200 * pitch, now);
      filter.Q.setValueAtTime(4.0, now);

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.7, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noiseSource.connect(filter);
      filter.connect(nGain);
      nGain.connect(dest);
      noiseSource.start(now);
    }
  }

  /**
   * 6. Sci-Fi Laser Slice
   */
  private playSciFiLaser(
    ctx: AudioContext,
    dest: GainNode,
    now: number,
    pitch: number,
    settings: SoundSettings
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = settings.theme === 'retro8bit' ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(1800 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(120 * pitch, now + 0.28);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200 * pitch, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.28);
    filter.Q.setValueAtTime(8 * settings.resonance + 2, now);

    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  /**
   * 7. Cyber Data Glitch / Decrypt
   */
  private playCyberGlitch(
    ctx: AudioContext,
    dest: GainNode,
    now: number,
    pitch: number,
    count: number,
    stagger: number,
    settings: SoundSettings
  ) {
    const tones = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
    for (let i = 0; i < Math.min(12, count * 2); i++) {
      const t = now + i * Math.max(0.035, stagger * 0.7);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = settings.theme === 'retro8bit' ? 'square' : 'sawtooth';
      const randomTone = tones[Math.floor(Math.random() * tones.length)];
      osc.frequency.setValueAtTime(randomTone * pitch, t);
      osc.frequency.setValueAtTime((randomTone + 150) * pitch, t + 0.02);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(t);
      osc.stop(t + 0.06);
    }
  }

  /**
   * 8. Sci-Fi Particle Explosion
   */
  private playSciFiExplosion(
    ctx: AudioContext,
    dest: GainNode,
    now: number,
    pitch: number,
    settings: SoundSettings
  ) {
    // Noise blast
    const noise = this.createNoiseBuffer(ctx, 0.45);
    if (noise) {
      const source = ctx.createBufferSource();
      source.buffer = noise;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400 * pitch, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.4);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      source.start(now);
    }

    // Heavy rumble body
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(25 * pitch, now + 0.45);

    oscGain.gain.setValueAtTime(0.8, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(oscGain);
    oscGain.connect(dest);
    osc.start(now);
    osc.stop(now + 0.46);
  }

  /**
   * 9. Cyber Bounce / Elastic Spring
   */
  private playCyberBounce(
    ctx: AudioContext,
    dest: GainNode,
    now: number,
    pitch: number,
    count: number,
    stagger: number,
    settings: SoundSettings
  ) {
    const pentatonic = [329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];

    for (let i = 0; i < Math.min(8, count); i++) {
      const t = now + i * stagger;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = settings.theme === 'retro8bit' ? 'triangle' : 'sine';
      const baseFreq = pentatonic[i % pentatonic.length] * pitch;

      osc.frequency.setValueAtTime(baseFreq * 0.7, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.05);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, t + 0.12);

      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(t);
      osc.stop(t + 0.16);
    }
  }

  /**
   * 10. Cinematic Air Whoosh
   */
  private playCinematicWhoosh(
    ctx: AudioContext,
    dest: GainNode,
    now: number,
    pitch: number,
    duration: number,
    settings: SoundSettings
  ) {
    const sweepDuration = Math.min(0.65, Math.max(0.3, duration * 0.25));
    const noise = this.createNoiseBuffer(ctx, sweepDuration);
    if (!noise) return;

    const source = ctx.createBufferSource();
    source.buffer = noise;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200 * pitch, now);
    filter.frequency.exponentialRampToValueAtTime(1800 * pitch, now + sweepDuration * 0.5);
    filter.frequency.exponentialRampToValueAtTime(250 * pitch, now + sweepDuration);
    filter.Q.setValueAtTime(3.5 * settings.resonance + 1, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.75, now + sweepDuration * 0.45);
    gain.gain.exponentialRampToValueAtTime(0.001, now + sweepDuration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(dest);
    source.start(now);
  }

  /**
   * 11. Hologram Crystal Chime
   */
  private playHologramChime(
    ctx: AudioContext,
    dest: GainNode,
    now: number,
    pitch: number,
    count: number,
    stagger: number,
    settings: SoundSettings
  ) {
    const scale = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];
    for (let i = 0; i < Math.min(6, count); i++) {
      const t = now + i * stagger;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(scale[i % scale.length] * pitch, t);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(t);
      osc.stop(t + 0.4);
    }
  }

  /**
   * 12. Mechanical Cyber Clack
   */
  private playMechanicalLock(
    ctx: AudioContext,
    dest: GainNode,
    now: number,
    pitch: number,
    count: number,
    stagger: number,
    settings: SoundSettings
  ) {
    for (let i = 0; i < Math.min(6, count); i++) {
      const t = now + i * stagger;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = settings.theme === 'retro8bit' ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(650 * pitch, t);
      osc.frequency.exponentialRampToValueAtTime(80 * pitch, t + 0.04);

      gain.gain.setValueAtTime(0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(t);
      osc.stop(t + 0.06);
    }
  }

  /**
   * 13. Heartbeat Electro Pulse
   */
  private playHeartbeatPulse(
    ctx: AudioContext,
    dest: GainNode,
    now: number,
    pitch: number,
    settings: SoundSettings
  ) {
    [0, 0.16].forEach(offset => {
      const t = now + offset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(95 * pitch, t);
      osc.frequency.exponentialRampToValueAtTime(35 * pitch, t + 0.12);

      gain.gain.setValueAtTime(0.8, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(t);
      osc.stop(t + 0.15);
    });
  }

  /**
   * Helper: White noise audio buffer generator
   */
  private createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer | null {
    try {
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      return buffer;
    } catch {
      return null;
    }
  }
}

export const soundEngine = new SoundEngine();
