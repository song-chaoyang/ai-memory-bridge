/**
 * AI Memory Bridge - Core Types
 * 定义标准记忆体格式的核心类型系统
 */

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  tokens?: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
}

export interface AIMemory {
  version: string;
  exportDate: string;
  updatedAt?: string;
  source: {
    platform: string;
    version?: string;
    userId?: string;
  };
  conversations: Conversation[];
  summary?: {
    totalConversations: number;
    totalMessages: number;
    totalTokens?: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
  metadata?: Record<string, unknown>;
}

export interface ExportOptions {
  format: 'json' | 'yaml' | 'markdown';
  includeMetadata?: boolean;
  compress?: boolean;
  filter?: {
    startDate?: string;
    endDate?: string;
    tags?: string[];
    searchQuery?: string;
  };
}

export interface ImportOptions {
  mergeStrategy: 'overwrite' | 'append' | 'skip';
  validateSchema?: boolean;
}

export interface PlatformAdapter {
  name: string;
  version: string;
  export(sourceData: unknown, options?: ExportOptions): Promise<AIMemory>;
  import(memory: AIMemory, options?: ImportOptions): Promise<unknown>;
  validate(data: unknown): boolean;
}

export interface MemoryStats {
  platform: string;
  totalConversations: number;
  totalMessages: number;
  totalTokens: number;
  averageMessagesPerConversation: number;
  dateRange: {
    start: string;
    end: string;
  };
}
