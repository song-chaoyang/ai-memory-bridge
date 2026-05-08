/**
 * AI Memory Bridge - ChatGPT Adapter
 * ChatGPT/OpenAI 平台适配器
 */

import { BaseAdapter } from './base';
import { AIMemory, Conversation, Message, ExportOptions, ImportOptions } from '../core/types';
import { MemoryCore } from '../core/memory';

// ChatGPT 导出格式类型定义
interface ChatGPTExport {
  title: string;
  create_time: number;
  update_time: number;
  mapping: Record<string, ChatGPTNode>;
}

interface ChatGPTNode {
  id: string;
  message?: {
    id: string;
    author: {
      role: 'user' | 'assistant' | 'system' | 'tool';
    };
    create_time: number;
    content: {
      content_type: string;
      parts?: string[];
      text?: string;
    };
    metadata?: Record<string, unknown>;
  };
  parent?: string;
  children: string[];
}

// OpenAI API 格式
interface OpenAIConversation {
  id: string;
  model: string;
  messages: OpenAIMessage[];
  created_at: number;
}

interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  name?: string;
}

export class ChatGPTAdapter extends BaseAdapter {
  readonly name = 'chatgpt';
  readonly version = '1.0.0';

  /**
   * 从ChatGPT导出格式转换为标准记忆体
   */
  async export(sourceData: unknown, options?: ExportOptions): Promise<AIMemory> {
    // 支持多种ChatGPT导出格式
    if (this.isChatGPTExportFormat(sourceData)) {
      return this.convertFromChatGPTExport(sourceData as ChatGPTExport[]);
    }

    if (this.isOpenAIAPIFormat(sourceData)) {
      return this.convertFromOpenAIAPI(sourceData as OpenAIConversation[]);
    }

    throw new Error('Unsupported ChatGPT data format');
  }

  /**
   * 从标准记忆体转换为ChatGPT可用格式
   */
  async import(memory: AIMemory, options?: ImportOptions): Promise<unknown> {
    // 转换为OpenAI API格式
    return memory.conversations.map((conv) => {
      const messages = conv.messages.map((msg) => {
        const messageObj: Record<string, unknown> = {
          role: msg.role,
          content: msg.content,
        };
        if (msg.metadata?.name) {
          messageObj.name = msg.metadata.name as string;
        }
        return messageObj;
      });

      return {
        id: conv.id,
        title: conv.title,
        model: 'gpt-4', // 默认模型
        messages,
        created_at: new Date(conv.createdAt).getTime() / 1000,
        updated_at: new Date(conv.updatedAt).getTime() / 1000,
      };
    });
  }

  /**
   * 验证数据源
   */
  validate(data: unknown): boolean {
    return this.isChatGPTExportFormat(data) || this.isOpenAIAPIFormat(data);
  }

  /**
   * 检查是否为ChatGPT导出格式
   */
  private isChatGPTExportFormat(data: unknown): boolean {
    if (!Array.isArray(data)) return false;
    if (data.length === 0) return false;
    
    const first = data[0];
    return (
      typeof first === 'object' &&
      first !== null &&
      'title' in first &&
      'create_time' in first &&
      'mapping' in first
    );
  }

  /**
   * 检查是否为OpenAI API格式
   */
  private isOpenAIAPIFormat(data: unknown): boolean {
    if (!Array.isArray(data)) return false;
    if (data.length === 0) return false;

    const first = data[0];
    return (
      typeof first === 'object' &&
      first !== null &&
      'id' in first &&
      'messages' in first &&
      Array.isArray((first as OpenAIConversation).messages)
    );
  }

  /**
   * 从ChatGPT导出格式转换
   */
  private convertFromChatGPTExport(data: ChatGPTExport[]): AIMemory {
    const memory = this.createMemory();

    data.forEach((chat) => {
      const conversation: Conversation = {
        id: this.generateId(),
        title: chat.title || 'Untitled Conversation',
        messages: [],
        createdAt: this.formatTimestamp(chat.create_time * 1000),
        updatedAt: this.formatTimestamp(chat.update_time * 1000),
      };

      // 从mapping中提取消息
      const nodeMap = chat.mapping;
      const processedNodes = new Set<string>();

      const processNode = (nodeId: string, parentId?: string) => {
        if (processedNodes.has(nodeId)) return;
        processedNodes.add(nodeId);

        const node = nodeMap[nodeId];
        if (!node || !node.message) return;

        const msg = node.message;
        
        // 跳过系统消息和工具消息（可选）
        if (msg.author.role === 'system' || msg.author.role === 'tool') {
          // 仍然处理子节点
          node.children.forEach((childId) => processNode(childId, nodeId));
          return;
        }

        const content = this.extractContent(msg.content);
        if (!content) {
          node.children.forEach((childId) => processNode(childId, nodeId));
          return;
        }

        const message: Message = {
          id: msg.id || this.generateId(),
          role: msg.author.role === 'user' ? 'user' : 'assistant',
          content,
          timestamp: msg.create_time
            ? this.formatTimestamp(msg.create_time * 1000)
            : new Date().toISOString(),
          metadata: {
            parentId,
            contentType: msg.content.content_type,
            ...msg.metadata,
          },
        };

        conversation.messages.push(message);

        // 递归处理子节点
        node.children.forEach((childId) => processNode(childId, nodeId));
      };

      // 找到所有没有父节点或父节点不存在的节点作为起点
      const rootNodes = Object.values(nodeMap).filter(
        (node) => !node.parent || !nodeMap[node.parent]
      );

      // 处理根节点及其子节点
      rootNodes.forEach((root) => {
        // 如果根节点有消息，处理它
        if (root.message) {
          processNode(root.id);
        }
        // 处理所有子节点
        root.children.forEach((childId) => processNode(childId, root.id));
      });

      // 如果没有找到任何消息，尝试处理所有节点
      if (conversation.messages.length === 0) {
        Object.keys(nodeMap).forEach((nodeId) => {
          const node = nodeMap[nodeId];
          if (node.message && node.parent) {
            processNode(nodeId, node.parent);
          }
        });
      }

      // 按时间排序消息
      conversation.messages.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      if (conversation.messages.length > 0) {
        memory.conversations.push(conversation);
      }
    });

    return MemoryCore.generateSummary(memory);
  }

  /**
   * 从OpenAI API格式转换
   */
  private convertFromOpenAIAPI(data: OpenAIConversation[]): AIMemory {
    const memory = this.createMemory();

    data.forEach((conv) => {
      const conversation: Conversation = {
        id: conv.id,
        title: `Conversation ${conv.id.slice(0, 8)}`,
        messages: conv.messages.map((msg) => ({
          id: this.generateId(),
          role: msg.role,
          content: msg.content,
          timestamp: new Date(conv.created_at * 1000).toISOString(),
          ...(msg.name && { metadata: { name: msg.name } }),
        })),
        createdAt: new Date(conv.created_at * 1000).toISOString(),
        updatedAt: new Date(conv.created_at * 1000).toISOString(),
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
  private extractContent(content: { content_type: string; parts?: string[]; text?: string }): string {
    if (content.parts && content.parts.length > 0) {
      return content.parts.join('');
    }
    if (content.text) {
      return content.text;
    }
    return '';
  }
}
