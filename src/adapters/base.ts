/**
 * AI Memory Bridge - Base Adapter
 * 平台适配器基类
 */

import { PlatformAdapter, AIMemory, ExportOptions, ImportOptions } from '../core/types';
import { MemoryCore } from '../core/memory';

export abstract class BaseAdapter implements PlatformAdapter {
  abstract readonly name: string;
  abstract readonly version: string;

  /**
   * 导出数据为标准记忆体格式
   */
  abstract export(sourceData: unknown, options?: ExportOptions): Promise<AIMemory>;

  /**
   * 导入标准记忆体格式到平台特定格式
   */
  abstract import(memory: AIMemory, options?: ImportOptions): Promise<unknown>;

  /**
   * 验证数据源格式
   */
  abstract validate(data: unknown): boolean;

  /**
   * 创建基础记忆体结构
   */
  protected createMemory(): AIMemory {
    return MemoryCore.create(this.name);
  }

  /**
   * 安全解析JSON
   */
  protected safeParseJSON(json: string): unknown | null {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  /**
   * 生成唯一ID
   */
  protected generateId(): string {
    return `${this.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 格式化时间戳
   */
  protected formatTimestamp(timestamp: string | number | Date): string {
    if (typeof timestamp === 'string') {
      return new Date(timestamp).toISOString();
    }
    if (typeof timestamp === 'number') {
      return new Date(timestamp).toISOString();
    }
    return timestamp.toISOString();
  }
}
