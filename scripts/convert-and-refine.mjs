import fs from 'fs';
import OpenCC from 'opencc-js';

const converter = OpenCC.Converter({ from: 'hk', to: 'cn' });

// Load existing data
const { COMPS, WHENS, USES, MOTION_ITEMS } = await import('../src/motion-engine/motionData.ts');

function simplify(str) {
  if (!str) return str;
  let res = converter(str);
  // Normalize key design terms
  res = res
    .replace(/游标/g, '光标')
    .replace(/捲動/g, '滚动')
    .replace(/卷动/g, '滚动')
    .replace(/雷射/g, '激光')
    .replace(/漸層/g, '渐变')
    .replace(/渐层/g, '渐变')
    .replace(/介面/g, '界面')
    .replace(/控制項/g, '控件')
    .replace(/控制项/g, '控件')
    .replace(/拖曳/g, '拖拽');
  return res;
}

const TITLE_REFINEMENTS = {
  2: { title: '激光横切', reason: '原名“雷射切斷”为港台音译，标准术语为“激光横切”（Laser Cut）' },
  8: { title: '倒数重击', reason: '原名“倒數砸落”略显口语化，改用“倒数重击”更具 Number Slam 冲击力' },
  10: { title: '定格抽帧晃动', reason: '原名“定格晃動”，补充“抽帧”准确传达 Stop Motion 定格动画的低帧率特征' },
  11: { title: '假名字符雨', reason: '原名“文字雨”，实际为垂直下落的矩阵字符流（Letter Rain / Matrix Rain）' },
  12: { title: '放大镜局部透视', reason: '原名“放大鏡”，补充“局部透视”强化 Magnifier Lens 随光标放大的物理属性' },
  13: { title: '乱码解码', reason: '原名“亂碼解讀”，Scramble Decode 在科技动效中规范称为“乱码解码”' },
  14: { title: '多米诺骨牌连倒', reason: '原名“骨牌倒下”，加入“多米诺”与“连倒”强化 Domino Letters 的连环推倒质感' },
  15: { title: '多色渐变流动', reason: '原名“漸層流動”，大陆标准色彩设计术语为“渐变”（Gradient Flow）' },
  16: { title: '双环反向自旋', reason: '原名“圓環文字”，准确指出其双圈同心圆、一顺一逆反向旋转的核心机制' },
  19: { title: '旗帜迎风飘扬', reason: '原名“文字旗幟”，生动呈现 Text Flag 迎风掀起波浪翻滚的视觉意境' },
  22: { title: '脉冲网格波纹', reason: '原名“脈動格子”，Grid Pulse 标准术语为“脉冲网格”' },
  23: { title: '可变字重呼吸', reason: '原名“字重變粗”，该动画采用 Variable Font（可变字体）在极细到极粗之间呼吸循环' },
  24: { title: '折扇层叠展开', reason: '原名“文字扇”，准确描摹同一文字如和风折扇开合的轴心展开效果' },
  25: { title: '卡拉OK跳动小球', reason: '原名“卡拉OK小球”，准确指出小球在字幕上方逐字跃动点亮（Karaoke Ball）' },
  26: { title: '摆钟悬挂摇晃', reason: '原名“鐘擺搖晃”，明确从顶部固定点做摆锤钟摆晃荡的动力学特征' },
  28: { title: '季节文字环轮播', reason: '原名“圓環換字”，描述包含四季文字在中央翻牌轮播的完整动作' },
  29: { title: '高速残影掠过', reason: '原名“殘影疾走”，Blur Trail 带有极速运动模糊与拖尾' },
  30: { title: '棋盘格逐字翻转', reason: '原名“棋盤翻轉”，Checkerboard 逐格翻转' },
  31: { title: '无穷符号轨迹环绕', reason: '原名“無窮文字”，该效果文字沿着 ∞ 符号（Infinity Path）SVG 轨迹无限运动' },
  32: { title: '随机字符洗牌重排', reason: '原名“隨機洗牌”，明确体现字母乱序打乱后重新复位的过程' },
  38: { title: '多字体逐字混排', reason: '原名“不同字體”，8 种截然不同的艺术字型逐字穿插' },
  45: { title: '多向对撞入场', reason: '原名“多向撞擊”，词组分别由上下左右四个方向汇聚对撞' },
  46: { title: '逐词聚焦放大', reason: '原名“縮放換字”，Zoom Title 词条依次向前推近放大' },
  48: { title: '巨幅双速走马灯', reason: '原名“雙層走馬燈”，上下两层大字与小字以不同速率反向滚动' },
  50: { title: '交错斜向警戒带', reason: '原名“斜角走馬燈”，工业警示带风格斜向对角穿梭' },
  51: { title: 'S弯道跑道文字', reason: '原名“S型走馬燈”，沿着 S 型波浪曲线平滑流动' },
  100: { title: '滚动速度联动跑马灯', reason: '原名“滾輪加速跑馬燈”，走马灯速度与用户页面滚动速度动态绑定' },
  101: { title: '滚动定位指示点', reason: '原名“捲動導覽點”，Scroll Spy Dot Nav 随视口位置高亮指示点' },
  103: { title: '光标方向感知填充按钮', reason: '原名“游標擴散填滿按鈕”，Direction-aware Fill Button 感知光标进入方位' },
  104: { title: '卡片阶梯交错渐入', reason: '原名“卡片依序浮現”，Staggered Card Reveal 阶梯延时' },
  106: { title: '极光流动渐变背景', reason: '原名“流動光暈漸層”，Aurora Gradient 极光光晕色彩漂移' },
  107: { title: '聚光灯跟随网格', reason: '原名“聚光網格”，Spotlight Grid 光标探照网格高亮' },
  109: { title: '光泽横扫扫光按钮', reason: '原名“光澤掃過按鈕”，Shine Sweep Button 镜面高光斜扫' },
  122: { title: '点击涟漪扩散', reason: '原名“點擊漣漪”，Click Ripple 水波扩散' },
  123: { title: '旋转文字环光标', reason: '原名“旋轉文字環游標”，Rotating Text Cursor 环状文字环绕光标' },
  124: { title: '手电筒局部探照', reason: '原名“手電筒探照”，Flashlight Reveal 仅在光标周围照出隐藏内容' },
  252: { title: '反色差值光标', reason: '原名“反色混合游標”，Blend Difference Cursor 经过文字时差值反色' },
  253: { title: '磁吸黏性光标', reason: '原名“黏性游標”，Sticky Cursor 靠近按钮产生磁吸形变' },
  254: { title: '速度形变拉伸光标', reason: '原名“速度拉伸游標”，Velocity Stretch Cursor 根据光标移动速度动态拉长' },
  255: { title: '上下文情境标签光标', reason: '原名“情境標籤游標”，Contextual Cursor 移到目标上变成对应动作圆圈' },
  256: { title: '十字准星坐标光标', reason: '原名“十字準星座標”，Crosshair Cursor 随动横竖细线与动态坐标数字' },
  257: { title: '视线跟踪眨眼大眼', reason: '原名“眼睛跟隨”，Following Eyes 眼珠跟踪光标并规律眨眼' },
  258: { title: '放大镜透镜光标', reason: '原名“放大鏡游標”，Magnifier Lens 移动透镜放大' },
  260: { title: '黏液水滴融合拖尾', reason: '原名“黏液拖尾”，Gooey Trail 液滴融合拉丝' },
  261: { title: '点击喷洒粒子彩带', reason: '原名“點擊噴出小物”，Click Confetti Pop 点击喷出彩带粒子' },
  325: { title: '蚂蚁线选区框', reason: '原名“選取框螞蟻線”，Marching Ants Selection 虚线连续跑动' },
  328: { title: '心电图脉冲波形', reason: '原名“心電圖線條”，ECG Heartbeat Pulse 动态绘制心率尖峰与数值' },
  329: { title: '枝芽分形生长', reason: '原名“樹枝生長”，Growing Plant 树干地面分枝抽叶生长' },
  330: { title: '齿轮齿数咬合联动', reason: '原名“齒輪連動”，Gear Train 根据齿数比例真实齿轮啮合传动' },
  331: { title: '指纹光条扫描解锁', reason: '原名“指紋掃描解鎖”，Fingerprint Scan 纹路扩散与光学扫描线' },
};

const SIMPLIFIED_COMPS = [
  ['text', '文字动效', '#c8f03c'],
  ['button', '按钮交互', '#ff6b4a'],
  ['control', '表单控件', '#a3b8ff'],
  ['card', '卡片群组', '#ffc93c'],
  ['media', '图片媒体', '#6cc4ff'],
  ['shape', '图形矢量', '#8b7cf6'],
  ['bg', '背景氛围', '#3dd9b8'],
  ['layout', '页面布局', '#f47fae'],
  ['cursor', '光标交互', '#ff7a2f'],
];

const SIMPLIFIED_WHENS = [
  ['enter', '进场出现'],
  ['exit', '退场消散'],
  ['switch', '状态切换'],
  ['loop', '循环待机'],
  ['hover', '悬停点击'],
  ['scroll', '滚动触发'],
  ['drag', '拖拽手势'],
];

const SIMPLIFIED_USES = {
  hero: '首屏大标题',
  emph: '重点强调',
  data: '数据与计数',
  bg: '背景装饰',
  trans: '转场切换',
  logo: '品牌标识',
  ui: '界面交互',
  scroll: '滚动特效',
  app: '移动与App',
};

const changedList = [];

const updatedItems = MOTION_ITEMS.map(item => {
  const originalZh = item.zh;
  let simplifiedZh = simplify(item.zh);

  // Check specific refinements
  let finalZh = simplifiedZh;
  let refinementReason = null;

  if (TITLE_REFINEMENTS[item.id]) {
    finalZh = TITLE_REFINEMENTS[item.id].title;
    refinementReason = TITLE_REFINEMENTS[item.id].reason;
  }

  if (originalZh !== finalZh) {
    changedList.push({
      id: item.id,
      en: item.en,
      before: originalZh,
      after: finalZh,
      reason: refinementReason || '简体中文标准化转换（术语统一为光标/滚动/激光/渐变等规范用法）',
    });
  }

  return {
    ...item,
    zh: finalZh,
    desc: simplify(item.desc),
    tag: simplify(item.tag),
    style: simplify(item.style),
    txt: simplify(item.txt),
    prompt: simplify(item.prompt),
  };
});

fs.writeFileSync(
  'src/motion-engine/title-changes.json',
  JSON.stringify(changedList, null, 2),
  'utf8'
);

const tsContent = `/**
 * Framli-Motion Library Data - 327 Presets
 * Simplified Chinese (zh-CN) & Standardized Terminology
 */

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
  added: string;
  prompt: string;
}

export interface CompDefinition {
  key: string;
  label: string;
  color: string;
}

export const COMPS: [string, string, string][] = ${JSON.stringify(SIMPLIFIED_COMPS, null, 2)};

export const WHENS: [string, string][] = ${JSON.stringify(SIMPLIFIED_WHENS, null, 2)};

export const USES: Record<string, string> = ${JSON.stringify(SIMPLIFIED_USES, null, 2)};

export const COMP_MAP: Record<string, CompDefinition> = Object.fromEntries(
  COMPS.map(([k, l, c]) => [k, { key: k, label: l, color: c }])
);

export const WHEN_MAP: Record<string, string> = Object.fromEntries(WHENS);

export const MOTION_ITEMS: MotionItem[] = ${JSON.stringify(updatedItems, null, 2)};
`;

fs.writeFileSync('src/motion-engine/motionData.ts', tsContent, 'utf8');
console.log(`Processed all ${updatedItems.length} items.`);
console.log(`Title changes / optimizations recorded: ${changedList.length}`);
