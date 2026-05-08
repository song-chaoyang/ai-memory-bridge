/**
 * AI Memory Bridge - ChatGPT Adapter Tests
 */

import { ChatGPTAdapter } from '../../src/adapters/chatgpt';

describe('ChatGPTAdapter', () => {
  let adapter: ChatGPTAdapter;

  beforeEach(() => {
    adapter = new ChatGPTAdapter();
  });

  describe('validate', () => {
    it('should validate ChatGPT export format', () => {
      const validData = [
        {
          title: 'Test Chat',
          create_time: 1234567890,
          update_time: 1234567890,
          mapping: {},
        },
      ];

      expect(adapter.validate(validData)).toBe(true);
    });

    it('should reject invalid data', () => {
      expect(adapter.validate(null)).toBe(false);
      expect(adapter.validate({})).toBe(false);
      expect(adapter.validate([])).toBe(false);
    });
  });

  describe('export', () => {
    it('should convert ChatGPT data to standard memory format', async () => {
      const chatgptData = [
        {
          title: 'Test Conversation',
          create_time: 1704067200,
          update_time: 1704067300,
          mapping: {
            root: {
              id: 'root',
              message: null,
              children: ['msg1'],
            },
            msg1: {
              id: 'msg1',
              message: {
                id: 'msg1',
                author: { role: 'user' },
                create_time: 1704067200,
                content: {
                  content_type: 'text',
                  parts: ['Hello'],
                },
              },
              parent: 'root',
              children: ['msg2'],
            },
            msg2: {
              id: 'msg2',
              message: {
                id: 'msg2',
                author: { role: 'assistant' },
                create_time: 1704067250,
                content: {
                  content_type: 'text',
                  parts: ['Hi there!'],
                },
              },
              parent: 'msg1',
              children: [],
            },
          },
        },
      ];

      const memory = await adapter.export(chatgptData);

      expect(memory.source.platform).toBe('chatgpt');
      expect(memory.conversations).toHaveLength(1);
      expect(memory.conversations[0].title).toBe('Test Conversation');
      expect(memory.conversations[0].messages).toHaveLength(2);
    });
  });

  describe('import', () => {
    it('should convert standard memory to ChatGPT format', async () => {
      const memory = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        source: { platform: 'test' },
        conversations: [
          {
            id: 'conv1',
            title: 'Test',
            messages: [
              {
                id: 'msg1',
                role: 'user' as const,
                content: 'Hello',
                timestamp: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      };

      const result = await adapter.import(memory);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      const firstItem = (result as unknown[])[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('messages');
    });
  });
});
