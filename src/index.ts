/**
 * AI Memory Bridge - Main Entry Point
 * 主入口文件
 */

// 导出核心类型
export * from './core/types';

// 导出核心功能
export { MemoryCore, CURRENT_VERSION } from './core/memory';

// 导出适配器
export {
  BaseAdapter,
  ChatGPTAdapter,
  ClaudeAdapter,
  registerAdapter,
  getAdapter,
  getAllAdapters,
  getAdapterNames,
  hasAdapter,
  detectAdapter,
} from './adapters';
