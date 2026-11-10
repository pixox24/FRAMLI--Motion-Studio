import test from 'node:test';
import assert from 'node:assert';
import {
  formatCubicBezier,
  generateBezierPath,
  filterMotionItems,
  generateAIPrompt,
} from './motionUtils.ts';
import { MotionItem } from '../types/motion.ts';

test('formatCubicBezier formats coordinates correctly', () => {
  const result = formatCubicBezier([0.25, 0.46, 0.45, 0.94]);
  assert.strictEqual(result, 'cubic-bezier(0.25, 0.46, 0.45, 0.94)');
});

test('generateBezierPath creates valid SVG cubic path', () => {
  const path = generateBezierPath([0.25, 0.1, 0.25, 1], 200, 200, 20);
  assert.match(path, /^M 20 180 C \d+(\.\d+)? \d+(\.\d+)?, \d+(\.\d+)? \d+(\.\d+)?, 180 20$/);
});

test('filterMotionItems filters correctly by query, comp, and tech', () => {
  const mockItems: MotionItem[] = [
    {
      id: 1,
      zh: '闪电砸落',
      en: 'Lightning Strike',
      desc: '伴随闪电强光重重砸下',
      comp: 'text',
      when: ['enter'],
      tech: 'CSS',
      style: '冲击登场',
      uses: ['hero'],
      tag: '冲击',
      txt: '雷鸣',
      bg: 'dark',
      added: '2026-10-15',
      prompt: '闪电砸落测试',
    },
    {
      id: 2,
      zh: '心电图脉冲波形',
      en: 'ECG Heartbeat',
      desc: '心电图波形',
      comp: 'shape',
      when: ['loop'],
      tech: 'GSAP',
      style: '心跳',
      uses: ['data'],
      tag: 'DrawSVG',
      txt: '',
      bg: 'dark',
      added: '2026-10-21',
      prompt: '心电图测试',
    },
  ];

  // Search by query
  const resQuery = filterMotionItems(mockItems, '闪电', 'all', 'all', 'all');
  assert.strictEqual(resQuery.length, 1);
  assert.strictEqual(resQuery[0].id, 1);

  // Filter by comp
  const resComp = filterMotionItems(mockItems, '', 'shape', 'all', 'all');
  assert.strictEqual(resComp.length, 1);
  assert.strictEqual(resComp[0].id, 2);

  // Filter by tech
  const resTech = filterMotionItems(mockItems, '', 'all', 'all', 'GSAP');
  assert.strictEqual(resTech.length, 1);
  assert.strictEqual(resTech[0].id, 2);
});

test('generateAIPrompt includes custom text and parameters', () => {
  const mockItem: MotionItem = {
    id: 99,
    zh: '测试动效',
    en: 'Test Motion',
    desc: '测试描述',
    comp: 'text',
    when: ['loop'],
    tech: 'CSS',
    style: '测试',
    uses: ['ui'],
    tag: '测试',
    txt: '默认',
    bg: 'dark',
    added: '2026-10-20',
    prompt: '基础提示词',
  };

  const prompt = generateAIPrompt(mockItem, '自定义文本', {
    duration: 2.5,
    cubicBezier: [0.34, 1.56, 0.64, 1],
    easingName: '果冻回弹',
    accentColor: '#cdff39',
    stagger: 0.08,
    scale: 1,
    scatterMultiplier: 1.2,
    rotationMultiplier: 1,
    playbackSpeed: 1,
    loop: true,
  });

  assert.ok(prompt.includes('示例文本：「自定义文本」'));
  assert.ok(prompt.includes('2.5s'));
  assert.ok(prompt.includes('#cdff39'));
  assert.ok(prompt.includes('果冻回弹'));
});
