/**
 * AI Memory Bridge - Claude Adapter
 * Anthropic Claude 平台适配器
 */

import { BaseAdapter } from './base';
import { AIMemory, Conversation, Message, ExportOptions, ImportOptions } from '../core/types';
import { MemoryCore } from '../core/memory';

// Claude 导出格式
interface ClaudeExport {
  uuid: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  chat_messages: ClaudeMessage[];
}

interface ClaudeMessage {
  uuid: string;
  text: string;
  sender: 'human' | 'assistant';
  index: number;
  created_at: string;
  updated_at: string;
  truncated: boolean;
  attachments: unknown[];
  files: unknown[];
}

// Anthropic API 格式
interface AnthropicConversation {
  id: string;
  model: string;
  messages: AnthropicMessage[];
}

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string | AnthropicContentBlock[];
}

interface AnthropicContentBlock {
  type: 'text' | 'image';
  text?: string;
  source?: {
    type: 'base64';
    media_type: string;
    data: string;
  };
}

export class ClaudeAdapter extends BaseAdapter {
  readonly name = 'claude';
  readonly version = '1.0.0';

  /**
   * 从Claude导出格式转换为标准记忆体
   */
  async export(sourceData: unknown, options?: ExportOptions): Promise<AIMemory> {
    if (this.isClaudeExportFormat(sourceData)) {
      return this.convertFromClaudeExport(sourceData as ClaudeExport[]);
    }

    if (this.isAnthropicAPIFormat(sourceData)) {
      return this.convertFromAnthropicAPI(sourceData as AnthropicConversation[]);
    }

    throw new Error('Unsupported Claude data format');
  }

  /**
   * 从标准记忆体转换为Claude可用格式
   */
  async import(memory: AIMemory, options?: ImportOptions): Promise<unknown> {
    // 转换为Anthropic API格式
    return memory.conversations.map((conv) => ({
      id: conv.id,
      title: conv.title,
      model: 'claude-3-opus-20240229', // 默认模型
      messages: conv.messages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
      metadata: conv.metadata,
    }));
  }

  /**
   * 验证数据源
   */
  validate(data: unknown): boolean {
    return this.isClaudeExportFormat(data) || this.isAnthropicAPIFormat(data);
  }

  /**
   * 检查是否为Claude导出格式
   */
  private isClaudeExportFormat(data: unknown): boolean {
    if (!Array.isArray(data)) return false;
    if (data.length === 0) return false;

    const first = data[0];
    return (
      typeof first === 'object' &&
      first !== null &&
      'uuid' in first &&
      'chat_messages' in first &&
      Array.isArray((first as ClaudeExport).chat_messages)
    );
  }

  /**
   * 检查是否为Anthropic API格式
   */
  private isAnthropicAPIFormat(data: unknown): boolean {
    if (!Array.isArray(data)) return false;
    if (data.length === 0) return false;

    const first = data[0];
    return (
      typeof first === 'object' &&
      first !== null &&
      'id' in first &&
      'messages' in first &&
      Array.isArray((first as AnthropicConversation).messages)
    );
  }

  /**
   * 从Claude导出格式转换
   */
  private convertFromClaudeExport(data: ClaudeExport[]): AIMemory {
    const memory = this.createMemory();

    data.forEach((chat) => {
      const conversation: Conversation = {
        id: chat.uuid,
        title: chat.name || 'Untitled Conversation',
        messages: chat.chat_messages
          .sort((a, b) => a.index - b.index)
          .map((msg) => ({
            id: msg.uuid,
            role: msg.sender === 'human' ? 'user' : 'assistant',
            content: msg.text,
            timestamp: msg.created_at,
            metadata: {
              truncated: msg.truncated,
              attachments: msg.attachments,
              files: msg.files,
            },
          })),
        createdAt: chat.created_at,
        updatedAt: chat.updated_at,
        metadata: {
          description: chat.description,
        },
      };

      if (conversation.messages.length > 0) {
        memory.conversations.push(conversation);
      }
    });

    return MemoryCore.generateSummary(memory);
  }

  /**
   * 从Anthropic API格式转换
   */
  private convertFromAnthropicAPI(data: AnthropicConversation[]): AIMemory {
    const memory = this.createMemory();

    data.forEach((conv) => {
      const conversation: Conversation = {
        id: conv.id,
        title: `Conversation ${conv.id.slice(0, 8)}`,
        messages: conv.messages.map((msg, index) => ({
          id: this.generateId(),
          role: msg.role,
          content: this.extractContent(msg.content),
          timestamp: new Date().toISOString(), // API格式可能没有独立时间戳
          metadata: {
            index,
          },
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          model: conv.model,
        },
      };

      memory.conversations.push(conversation);
    });

    return MemoryCore.generateSummary(memory);
  }

  /**
   * 提取消息内容
   */
  private extractContent(content: string | AnthropicContentBlock[]): string {
    if (typeof content === 'string') {
      return content;
    }

    if (Array.isArray(content)) {
      return content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n');
    }

    return '';
  }
}
