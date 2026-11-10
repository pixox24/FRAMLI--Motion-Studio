import test from 'node:test';
import assert from 'node:assert';
import {
  determineSoundArchetype,
  DEFAULT_SOUND_SETTINGS,
} from './soundEngine.ts';
import { MotionItem } from '../types/motion.ts';

test('determineSoundArchetype accurately identifies coin spin (硬币翻转)', () => {
  const item: MotionItem = {
    id: 3,
    zh: '硬币翻转',
    en: 'Coin Flip',
    desc: '文字像硬币一样翻转弹跳',
    comp: 'text',
    when: ['loop'],
    tech: 'CSS',
    style: '碰撞 游戏',
    uses: ['emph'],
    tag: '碰撞',
    txt: '翻转',
    bg: 'dark',
    added: '2026-10-15',
    prompt: '每个字依次做 3D 翻转',
  };
  assert.strictEqual(determineSoundArchetype(item), 'coin_spin');
});

test('determineSoundArchetype accurately identifies particle disintegration (粒子消散)', () => {
  const item: MotionItem = {
    id: 5,
    zh: '粒子消散',
    en: 'Disintegrate',
    desc: '文字化为粒子消散',
    comp: 'text',
    when: ['exit'],
    tech: 'CSS',
    style: '消灭 戏剧',
    uses: ['hero'],
    tag: '消灭',
    txt: '消散',
    bg: 'dark',
    added: '2026-10-15',
    prompt: '文字边缘碎成粒子飘散',
  };
  assert.strictEqual(determineSoundArchetype(item), 'disintegrate');
});

test('determineSoundArchetype accurately identifies typewriter keystrokes (打字敲击)', () => {
  const item: MotionItem = {
    id: 47,
    zh: '终端打字',
    en: 'Typewriter',
    desc: '逐字敲击输入文字',
    comp: 'text',
    when: ['enter'],
    tech: 'CSS',
    style: '打字机 输入',
    uses: ['hero'],
    tag: '输入',
    txt: 'TYPE',
    bg: 'dark',
    added: '2026-10-15',
    prompt: '文字像机械打字机一样逐字出现',
  };
  assert.strictEqual(determineSoundArchetype(item), 'typewriter');
});

test('determineSoundArchetype accurately identifies domino cascade (骨牌连倒)', () => {
  const item: MotionItem = {
    id: 14,
    zh: '多米诺骨牌连倒',
    en: 'Domino Letters',
    desc: '文字像骨牌一样倒下',
    comp: 'text',
    when: ['exit'],
    tech: 'CSS',
    style: '消散退场',
    uses: ['emph'],
    tag: '连锁',
    txt: '多米诺',
    bg: 'acc',
    added: '2026-10-15',
    prompt: '每个字依序往右倒下形成骨牌连击',
  };
  assert.strictEqual(determineSoundArchetype(item), 'domino');
});

test('determineSoundArchetype accurately identifies laser slice (激光横切)', () => {
  const item: MotionItem = {
    id: 2,
    zh: '激光横切',
    en: 'Laser Cut',
    desc: '激光把文字一刀两断',
    comp: 'text',
    when: ['exit'],
    tech: 'CSS',
    style: '消散退场',
    uses: ['trans'],
    tag: 'SF・切断',
    txt: '切断',
    bg: 'acc',
    added: '2026-10-15',
    prompt: '激光横切文字',
  };
  assert.strictEqual(determineSoundArchetype(item), 'laser');
});

test('DEFAULT_SOUND_SETTINGS has cinematic theme and sensible volume', () => {
  assert.strictEqual(DEFAULT_SOUND_SETTINGS.enabled, true);
  assert.strictEqual(DEFAULT_SOUND_SETTINGS.theme, 'cinematic');
  assert.ok(DEFAULT_SOUND_SETTINGS.volume > 0 && DEFAULT_SOUND_SETTINGS.volume <= 0.5);
});

test('determineSoundArchetype accurately identifies new motion presets', () => {
  const quantumItem: MotionItem = {
    id: 332,
    zh: '量子坍缩重构',
    en: 'Quantum Superposition & Collapse',
    desc: '处于多重态概率云中的文字波函数坍缩',
    comp: 'text',
    when: ['enter'],
    tech: 'CSS',
    style: '量子力学 坍缩 叠加态',
    uses: ['hero'],
    tag: '量子・科幻',
    txt: 'QUANTUM',
    bg: 'dark',
    isNew: true,
    added: '2026-10-29',
    prompt: '量子叠加态波函数坍缩',
  };
  assert.strictEqual(determineSoundArchetype(quantumItem), 'disintegrate');

  const lidarItem: MotionItem = {
    id: 339,
    zh: '激光雷达点云',
    en: 'Holographic LiDAR Point Cloud',
    desc: '激光雷达扫描激发电离点云',
    comp: 'text',
    when: ['enter'],
    tech: 'Canvas',
    style: '激光 雷达 点云',
    uses: ['hero'],
    tag: '雷达・空间',
    txt: 'SPATIAL',
    bg: 'dark',
    isNew: true,
    added: '2026-10-29',
    prompt: '激光雷达点云扫描',
  };
  assert.strictEqual(determineSoundArchetype(lidarItem), 'laser');

  const prismItem: MotionItem = {
    id: 333,
    zh: '色散棱镜折射',
    en: 'Prism Chromatic Dispersion',
    desc: '三棱镜光束色散',
    comp: 'text',
    when: ['enter'],
    tech: 'CSS',
    style: '棱镜 色散 彩虹 折射',
    uses: ['hero'],
    tag: '光学・美学',
    txt: 'SPECTRUM',
    bg: 'dark',
    isNew: true,
    added: '2026-10-29',
    prompt: '棱镜色散光束',
  };
  assert.strictEqual(determineSoundArchetype(prismItem), 'chime');

  const splitFlapItem: MotionItem = {
    id: 335,
    zh: '机械分叶翻牌',
    en: 'Mechanical Split-Flap Solari Board',
    desc: '经典机械分叶翻牌矩阵，上下分叶沿三维水平轴翻落',
    comp: 'text',
    when: ['enter', 'loop'],
    tech: 'CSS',
    style: '机械 翻牌 时刻表 拟真 3D 折叠 Split-Flap Solari',
    uses: ['hero'],
    tag: '精密・机械',
    txt: 'FLIGHT 77',
    bg: 'dark',
    isNew: true,
    added: '2026-10-29',
    prompt: '经典机械分叶翻牌系统',
  };
  assert.strictEqual(determineSoundArchetype(splitFlapItem), 'mechanical');

  const filmBurnItem: MotionItem = {
    id: 338,
    zh: '胶片灼烧消融',
    en: 'Celluloid Film Burn & Ember',
    desc: '复古35毫米电影胶片放映机颤动中，炽热火圈从中心融化碳化',
    comp: 'text',
    when: ['enter', 'exit'],
    tech: 'CSS',
    style: '复古 胶片 灼烧 融化 电影 颗粒 灰烬 Celluloid Film Burn',
    uses: ['hero'],
    tag: '复古・电影',
    txt: 'CINEMA 35',
    bg: 'dark',
    isNew: true,
    added: '2026-10-29',
    prompt: '经典电影胶片物理质感',
  };
  assert.strictEqual(determineSoundArchetype(filmBurnItem), 'explode');
});

test('determineSoundArchetype accurately identifies all 9 category presets (#342-#350)', () => {
  // 342 text
  assert.strictEqual(
    determineSoundArchetype({
      id: 342,
      zh: '墨染拓印·宣纸渗染',
      en: 'Sumi Ink Wash & Xuan Paper Deboss',
      desc: '宋代美学宣纸微凹拓印，松烟墨滴沿纤维毛细渗染展开',
      comp: 'text',
      when: ['enter', 'loop'],
      tech: 'CSS',
      style: '水墨 拓印 宣纸 渗染 书法 Sumi Ink Deboss',
      uses: ['hero'],
      tag: '东方・水墨',
      txt: '墨痕微澜',
      bg: 'dark',
      isNew: true,
      added: '2026-10-29',
      prompt: '水墨拓印'
    }),
    'whoosh'
  );

  // 343 button
  assert.strictEqual(
    determineSoundArchetype({
      id: 343,
      zh: '钛金磁浮触感',
      en: 'Titanium Mag-Lev Haptic Push',
      desc: '精密航空级钛金按键悬浮于微米级沉孔内',
      comp: 'button',
      when: ['hover', 'switch'],
      tech: 'CSS',
      style: '钛金属 磁悬浮 触觉 反馈 实体按键 Titanium Haptic MagLev',
      uses: ['ui'],
      tag: '精密・硬件',
      txt: 'DEPLOY',
      bg: 'dark',
      isNew: true,
      added: '2026-10-29',
      prompt: '钛金磁浮按键'
    }),
    'mechanical'
  );

  // 344 control
  assert.strictEqual(
    determineSoundArchetype({
      id: 344,
      zh: '游标微动精密度盘',
      en: 'Vernier Micrometer Caliper Dial',
      desc: '瑞士精密仪器游标副尺刻度盘',
      comp: 'control',
      when: ['hover', 'switch', 'loop'],
      tech: 'CSS',
      style: '游标卡尺 刻度盘 精密仪器 Vernier Caliper Micrometer Precision',
      uses: ['ui'],
      tag: '精密・度量',
      txt: '0.025 mm',
      bg: 'dark',
      isNew: true,
      added: '2026-10-29',
      prompt: '游标卡尺刻度盘'
    }),
    'mechanical'
  );

  // 345 card
  assert.strictEqual(
    determineSoundArchetype({
      id: 345,
      zh: '黑曜石雕塑立面',
      en: 'Obsidian Architectural Monolith Slab',
      desc: '厚重哑光黑曜玄石体块，带有倾斜光束扫射产生的建筑阴影',
      comp: 'card',
      when: ['enter', 'hover'],
      tech: 'CSS',
      style: '黑曜石 建筑 雕塑 体量 阴影 Obsidian Monolith Architectural',
      uses: ['ui'],
      tag: '建筑・体量',
      txt: 'SPECIMEN 01',
      bg: 'dark',
      isNew: true,
      added: '2026-10-29',
      prompt: '黑曜石建筑体块'
    }),
    'impact'
  );

  // 346 media
  assert.strictEqual(
    determineSoundArchetype({
      id: 346,
      zh: '黑胶声槽反光扫掠',
      en: 'Vinyl Microgroove Specular Sheen',
      desc: '高保真模拟黑胶唱片同心微细声槽',
      comp: 'media',
      when: ['enter', 'loop'],
      tech: 'CSS',
      style: '黑胶 唱片 声槽 衍射 光斑 模拟 音响 Vinyl Hi-Fi Specular Grooves',
      uses: ['hero'],
      tag: '模拟・黑胶',
      txt: 'SIDE A · 33⅓ RPM',
      bg: 'dark',
      isNew: true,
      added: '2026-10-29',
      prompt: '黑胶声槽反光'
    }),
    'whoosh'
  );

  // 347 shape
  assert.strictEqual(
    determineSoundArchetype({
      id: 347,
      zh: '悬链悬索张拉曲面',
      en: 'Catenary Tensile Arch Geometry',
      desc: '高迪式反向悬链线双曲力学曲面',
      comp: 'shape',
      when: ['enter', 'loop'],
      tech: 'Canvas',
      style: '悬链线 张拉膜 索网 结构力学 Catenary Tensile Architecture Geometry',
      uses: ['hero'],
      tag: '结构・力学',
      txt: 'CATENARY',
      bg: 'dark',
      isNew: true,
      added: '2026-10-29',
      prompt: '悬链线曲面'
    }),
    'laser'
  );

  // 348 bg
  assert.strictEqual(
    determineSoundArchetype({
      id: 348,
      zh: '地质层叠断层微光',
      en: 'Stratified Geological Rift & Amber Seam',
      desc: '大地构造深层玄武岩与页岩沉积断层微速平移，岩层缝隙间呼吸溢出温润深邃的琥珀矿脉',
      comp: 'bg',
      when: ['loop', 'hover'],
      tech: 'CSS',
      style: '地质 断层 岩层 琥珀 矿石 大地 构造 Geological Strata Rift Amber Tectonic',
      uses: ['bg'],
      tag: '地质・沉积',
      txt: 'STRATA',
      bg: 'dark',
      isNew: true,
      added: '2026-10-29',
      prompt: '地质断层微光'
    }),
    'pulse'
  );

  // 349 layout
  assert.strictEqual(
    determineSoundArchetype({
      id: 349,
      zh: '柯布西耶模度网格重组',
      en: 'Modulor Architectural Grid Alignment',
      desc: '现代建筑大师柯布西耶黄金分割模度网格',
      comp: 'layout',
      when: ['enter', 'switch'],
      tech: 'CSS',
      style: '柯布西耶 模度 建筑网格 黄金分割 Modulor Le Corbusier Grid Layout',
      uses: ['ui'],
      tag: '建筑・网格',
      txt: 'MODULOR 1.618',
      bg: 'dark',
      isNew: true,
      added: '2026-10-29',
      prompt: '模度网格重组'
    }),
    'domino'
  );

  // 350 cursor
  assert.strictEqual(
    determineSoundArchetype({
      id: 350,
      zh: '光学测距标定准星',
      en: 'Optical Rangefinder Reticle & Vernier Crosshair',
      desc: '经典莱卡旁轴重合双影测距与航空抬头显示准星',
      comp: 'cursor',
      when: ['hover', 'switch'],
      tech: 'CSS',
      style: '光标 旁轴测距 莱卡 准星 测距 Rangefinder Reticle Leica Crosshair',
      uses: ['ui'],
      tag: '光学・标定',
      txt: 'RANGE 2.4m',
      bg: 'dark',
      isNew: true,
      added: '2026-10-29',
      prompt: '旁轴测距准星'
    }),
    'mechanical'
  );
});

