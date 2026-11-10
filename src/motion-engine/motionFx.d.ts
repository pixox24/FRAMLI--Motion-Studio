export type FXHandler = (stage: HTMLElement, text: string, card: any) => void;

export const FX: Record<string | number, FXHandler>;
export const ticks: Map<any, (time: number) => void>;
export function split(text: string, size?: number): HTMLElement;
export function T(text: string, size?: number): HTMLElement;
export function el(tag: string, cls?: string, html?: string): HTMLElement;
export function ringOf(text: string, r: number | string, size: number | string, dir: string): HTMLElement;
export function chars(s: string): string[];
export function rnd(a: number, b: number): number;
