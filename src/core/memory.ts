/**
 * AI Memory Bridge - Core Memory Operations
 * 核心记忆体操作模块
 */

import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import { v4 as uuidv4 } from 'uuid';
import {
  AIMemory,
  Conversation,
  Message,
  ExportOptions,
  ImportOptions,
  MemoryStats,
} from './types';

export const CURRENT_VERSION = '1.0.0';

export class MemoryCore {
  /**
   * 创建新的记忆体容器
   */
  static create(source: string, userId?: string): AIMemory {
    return {
      version: CURRENT_VERSION,
      exportDate: new Date().toISOString(),
      source: {
        platform: source,
        userId,
      },
      conversations: [],
      metadata: {
        generator: 'ai-memory-bridge',
        generatorVersion: CURRENT_VERSION,
      },
    };
  }

  /**
   * 添加对话到记忆体
   */
  static addConversation(
    memory: AIMemory,
    conversation: Omit<Conversation, 'id'> & { id?: string }
  ): AIMemory {
    const newConversation: Conversation = {
      ...conversation,
      id: conversation.id || uuidv4(),
      updatedAt: new Date().toISOString(),
    };

    return {
      ...memory,
      conversations: [...memory.conversations, newConversation],
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * 添加消息到指定对话
   */
  static addMessage(
    memory: AIMemory,
    conversationId: string,
    message: Omit<Message, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
  ): AIMemory {
    const updatedConversations = memory.conversations.map((conv) => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              ...message,
              id: message.id || uuidv4(),
              timestamp: message.timestamp || new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      }
      return conv;
    });

    return {
      ...memory,
      conversations: updatedConversations,
    };
  }

  /**
   * 生成记忆体摘要
   */
  static generateSummary(memory: AIMemory): AIMemory {
    const totalMessages = memory.conversations.reduce(
      (sum, conv) => sum + conv.messages.length,
      0
    );

    const totalTokens = memory.conversations.reduce(
      (sum, conv) =>
        sum + conv.messages.reduce((mSum, msg) => mSum + (msg.tokens || 0), 0),
      0
    );

    const allTimestamps = memory.conversations.flatMap((conv) =>
      conv.messages.map((msg) => new Date(msg.timestamp).getTime())
    );

    const startDate = allTimestamps.length > 0
      ? new Date(Math.min(...allTimestamps)).toISOString()
      : memory.exportDate;
    
    const endDate = allTimestamps.length > 0
      ? new Date(Math.max(...allTimestamps)).toISOString()
      : memory.exportDate;

    return {
      ...memory,
      summary: {
        totalConversations: memory.conversations.length,
        totalMessages,
        totalTokens: totalTokens > 0 ? totalTokens : undefined,
        dateRange: {
          start: startDate,
          end: endDate,
        },
      },
    };
  }

  /**
   * 导出记忆体到文件
   */
  static async exportToFile(
    memory: AIMemory,
    filePath: string,
    options: ExportOptions
  ): Promise<void> {
    let content: string;

    const processedMemory = this.generateSummary(memory);

    switch (options.format) {
      case 'yaml':
        content = yaml.dump(processedMemory);
        break;
      case 'markdown':
        content = this.toMarkdown(processedMemory);
        break;
      case 'json':
      default:
        content = JSON.stringify(processedMemory, null, 2);
        break;
    }

    await fs.ensureDir(require('path').dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * 从文件导入记忆体
   */
  static async importFromFile(filePath: string): Promise<AIMemory> {
    const content = await fs.readFile(filePath, 'utf-8');
    const ext = require('path').extname(filePath).toLowerCase();

    let memory: AIMemory;

    if (ext === '.yaml' || ext === '.yml') {
      memory = yaml.load(content) as AIMemory;
    } else {
      memory = JSON.parse(content) as AIMemory;
    }

    return this.validate(memory);
  }

  /**
   * 验证记忆体格式
   */
  static validate(memory: unknown): AIMemory {
    if (!memory || typeof memory !== 'object') {
      throw new Error('Invalid memory format: must be an object');
    }

    const m = memory as AIMemory;

    if (!m.version) {
      throw new Error('Invalid memory format: missing version');
    }

    if (!m.source || !m.source.platform) {
      throw new Error('Invalid memory format: missing source platform');
    }

    if (!Array.isArray(m.conversations)) {
      throw new Error('Invalid memory format: conversations must be an array');
    }

    return m;
  }

  /**
   * 转换为Markdown格式
   */
  static toMarkdown(memory: AIMemory): string {
    const lines: string[] = [
      '# AI Memory Export',
      '',
      `**Source:** ${memory.source.platform}`,
      `**Export Date:** ${memory.exportDate}`,
      `**Version:** ${memory.version}`,
      '',
      '---',
      '',
    ];

    if (memory.summary) {
      lines.push(
        '## Summary',
        '',
        `- **Total Conversations:** ${memory.summary.totalConversations}`,
        `- **Total Messages:** ${memory.summary.totalMessages}`,
        memory.summary.totalTokens
          ? `- **Total Tokens:** ${memory.summary.totalTokens}`
          : '',
        `- **Date Range:** ${memory.summary.dateRange.start} to ${memory.summary.dateRange.end}`,
        '',
        '---',
        ''
      );
    }

    memory.conversations.forEach((conv, index) => {
      lines.push(
        `## Conversation ${index + 1}: ${conv.title}`,
        '',
        `**ID:** ${conv.id}  `,
        `**Created:** ${conv.createdAt}  `,
        `**Updated:** ${conv.updatedAt}`,
        ''
      );

      if (conv.tags && conv.tags.length > 0) {
        lines.push(`**Tags:** ${conv.tags.join(', ')}`, '');
      }

      lines.push('### Messages', '');

      conv.messages.forEach((msg) => {
        const roleEmoji = msg.role === 'user' ? '👤' : msg.role === 'assistant' ? '🤖' : '⚙️';
        lines.push(
          `#### ${roleEmoji} ${msg.role.toUpperCase()} (${msg.timestamp})`,
          '',
          msg.content,
          ''
        );
      });

      lines.push('---', '');
    });

    return lines.join('\n');
  }

  /**
   * 获取统计信息
   */
  static getStats(memory: AIMemory): MemoryStats {
    const totalMessages = memory.conversations.reduce(
      (sum, conv) => sum + conv.messages.length,
      0
    );

    const totalTokens = memory.conversations.reduce(
      (sum, conv) =>
        sum + conv.messages.reduce((mSum, msg) => mSum + (msg.tokens || 0), 0),
      0
    );

    const allTimestamps = memory.conversations.flatMap((conv) =>
      conv.messages.map((msg) => new Date(msg.timestamp).getTime())
    );

    return {
      platform: memory.source.platform,
      totalConversations: memory.conversations.length,
      totalMessages,
      totalTokens,
      averageMessagesPerConversation:
        memory.conversations.length > 0
          ? totalMessages / memory.conversations.length
          : 0,
      dateRange: {
        start: allTimestamps.length > 0
          ? new Date(Math.min(...allTimestamps)).toISOString()
          : memory.exportDate,
        end: allTimestamps.length > 0
          ? new Date(Math.max(...allTimestamps)).toISOString()
          : memory.exportDate,
      },
    };
  }

  /**
   * 搜索记忆体
   */
  static search(memory: AIMemory, query: string): Conversation[] {
    const lowerQuery = query.toLowerCase();
    
    return memory.conversations.filter((conv) => {
      // 搜索标题
      if (conv.title.toLowerCase().includes(lowerQuery)) return true;
      
      // 搜索消息内容
      return conv.messages.some(
        (msg) =>
          msg.content.toLowerCase().includes(lowerQuery) ||
          (msg.metadata &&
            Object.values(msg.metadata).some(
              (v) => typeof v === 'string' && v.toLowerCase().includes(lowerQuery)
            ))
      );
    });
  }

  /**
   * 合并多个记忆体
   */
  static merge(memories: AIMemory[], targetSource?: string): AIMemory {
    if (memories.length === 0) {
      return this.create('merged');
    }

    const merged = this.create(targetSource || 'merged');

    memories.forEach((memory) => {
      memory.conversations.forEach((conv) => {
        merged.conversations.push({
          ...conv,
          id: uuidv4(), // 重新生成ID避免冲突
          metadata: {
            ...conv.metadata,
            originalSource: memory.source.platform,
            originalId: conv.id,
          },
        });
      });
    });

    return this.generateSummary(merged);
  }
}
