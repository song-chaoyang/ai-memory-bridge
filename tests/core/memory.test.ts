/**
 * AI Memory Bridge - Memory Core Tests
 */

import { MemoryCore } from '../../src/core/memory';
import { AIMemory, Conversation, Message } from '../../src/core/types';

describe('MemoryCore', () => {
  describe('create', () => {
    it('should create a new memory container', () => {
      const memory = MemoryCore.create('test-platform', 'user123');

      expect(memory.version).toBeDefined();
      expect(memory.source.platform).toBe('test-platform');
      expect(memory.source.userId).toBe('user123');
      expect(memory.conversations).toEqual([]);
      expect(memory.exportDate).toBeDefined();
    });
  });

  describe('addConversation', () => {
    it('should add a conversation to memory', () => {
      let memory = MemoryCore.create('test');
      
      memory = MemoryCore.addConversation(memory, {
        title: 'Test Conversation',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      expect(memory.conversations).toHaveLength(1);
      expect(memory.conversations[0].title).toBe('Test Conversation');
      expect(memory.conversations[0].id).toBeDefined();
    });
  });

  describe('addMessage', () => {
    it('should add a message to a conversation', () => {
      let memory = MemoryCore.create('test');
      
      memory = MemoryCore.addConversation(memory, {
        title: 'Test',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const conversationId = memory.conversations[0].id;

      memory = MemoryCore.addMessage(memory, conversationId, {
        role: 'user',
        content: 'Hello',
      });

      expect(memory.conversations[0].messages).toHaveLength(1);
      expect(memory.conversations[0].messages[0].content).toBe('Hello');
    });
  });

  describe('generateSummary', () => {
    it('should generate summary statistics', () => {
      let memory = MemoryCore.create('test');
      
      memory = MemoryCore.addConversation(memory, {
        title: 'Test',
        messages: [
          {
            id: '1',
            role: 'user',
            content: 'Hello',
            timestamp: '2024-01-01T00:00:00.000Z',
            tokens: 10,
          },
          {
            id: '2',
            role: 'assistant',
            content: 'Hi there',
            timestamp: '2024-01-01T00:01:00.000Z',
            tokens: 20,
          },
        ],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:01:00.000Z',
      });

      memory = MemoryCore.generateSummary(memory);

      expect(memory.summary).toBeDefined();
      expect(memory.summary?.totalConversations).toBe(1);
      expect(memory.summary?.totalMessages).toBe(2);
      expect(memory.summary?.totalTokens).toBe(30);
    });
  });

  describe('search', () => {
    it('should find conversations matching query', () => {
      let memory = MemoryCore.create('test');
      
      memory = MemoryCore.addConversation(memory, {
        title: 'Python Tutorial',
        messages: [
          {
            id: '1',
            role: 'user',
            content: 'Teach me Python',
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      memory = MemoryCore.addConversation(memory, {
        title: 'JavaScript Guide',
        messages: [
          {
            id: '2',
            role: 'user',
            content: 'Teach me JavaScript',
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const results = MemoryCore.search(memory, 'python');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Python Tutorial');
    });
  });

  describe('merge', () => {
    it('should merge multiple memories', () => {
      const memory1 = MemoryCore.create('platform1');
      const memory2 = MemoryCore.create('platform2');

      const merged = MemoryCore.merge([memory1, memory2], 'merged');

      expect(merged.source.platform).toBe('merged');
      expect(merged.conversations).toHaveLength(0);
    });
  });
});
