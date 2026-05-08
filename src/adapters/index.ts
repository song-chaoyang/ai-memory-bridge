/**
 * AI Memory Bridge - Adapter Registry
 * 平台适配器注册中心
 */

import { PlatformAdapter } from '../core/types';
import { ChatGPTAdapter } from './chatgpt';
import { ClaudeAdapter } from './claude';

// 适配器注册表
const adapters: Map<string, PlatformAdapter> = new Map();

// 注册内置适配器
export function registerBuiltInAdapters(): void {
  registerAdapter(new ChatGPTAdapter());
  registerAdapter(new ClaudeAdapter());
}

/**
 * 注册适配器
 */
export function registerAdapter(adapter: PlatformAdapter): void {
  adapters.set(adapter.name.toLowerCase(), adapter);
}

/**
 * 获取适配器
 */
export function getAdapter(name: string): PlatformAdapter | undefined {
  return adapters.get(name.toLowerCase());
}

/**
 * 获取所有适配器
 */
export function getAllAdapters(): PlatformAdapter[] {
  return Array.from(adapters.values());
}

/**
 * 获取所有适配器名称
 */
export function getAdapterNames(): string[] {
  return Array.from(adapters.keys());
}

/**
 * 检查适配器是否存在
 */
export function hasAdapter(name: string): boolean {
  return adapters.has(name.toLowerCase());
}

/**
 * 自动检测适配器
 */
export function detectAdapter(data: unknown): PlatformAdapter | undefined {
  for (const adapter of adapters.values()) {
    if (adapter.validate(data)) {
      return adapter;
    }
  }
  return undefined;
}

// 导出适配器类
export { ChatGPTAdapter } from './chatgpt';
export { ClaudeAdapter } from './claude';
export { BaseAdapter } from './base';

// 自动注册
registerBuiltInAdapters();
