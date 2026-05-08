# Creating Platform Adapters

This guide explains how to create a new platform adapter for AI Memory Bridge.

## Overview

A platform adapter converts between a specific AI platform's data format and the standard AI Memory Bridge format.

## Steps

### 1. Create the Adapter File

Create a new file in `src/adapters/`:

```typescript
// src/adapters/myplatform.ts

import { BaseAdapter } from './base';
import { AIMemory, Conversation, Message, ExportOptions, ImportOptions } from '../core/types';
import { MemoryCore } from '../core/memory';

export class MyPlatformAdapter extends BaseAdapter {
  readonly name = 'myplatform';
  readonly version = '1.0.0';

  async export(sourceData: unknown, options?: ExportOptions): Promise<AIMemory> {
    // Convert platform format to standard memory
  }

  async import(memory: AIMemory, options?: ImportOptions): Promise<unknown> {
    // Convert standard memory to platform format
  }

  validate(data: unknown): boolean {
    // Check if data is in valid platform format
  }
}
```

### 2. Implement Export Method

The export method converts the platform's native format to the standard AI Memory Bridge format:

```typescript
async export(sourceData: unknown, options?: ExportOptions): Promise<AIMemory> {
  // Validate input
  if (!this.validate(sourceData)) {
    throw new Error('Invalid data format');
  }

  // Create memory container
  const memory = this.createMemory();

  // Parse and convert data
  const platformData = sourceData as PlatformDataType;
  
  platformData.conversations.forEach((conv) => {
    const conversation: Conversation = {
      id: conv.id || this.generateId(),
      title: conv.title || 'Untitled',
      messages: conv.messages.map((msg) => ({
        id: msg.id || this.generateId(),
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: this.formatTimestamp(msg.timestamp),
        tokens: msg.tokens,
      })),
      createdAt: this.formatTimestamp(conv.createdAt),
      updatedAt: this.formatTimestamp(conv.updatedAt),
    };

    memory.conversations.push(conversation);
  });

  return MemoryCore.generateSummary(memory);
}
```

### 3. Implement Import Method

The import method converts standard memory to the platform's native format:

```typescript
async import(memory: AIMemory, options?: ImportOptions): Promise<unknown> {
  return memory.conversations.map((conv) => ({
    id: conv.id,
    title: conv.title,
    messages: conv.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    })),
    created_at: new Date(conv.createdAt).getTime() / 1000,
    updated_at: new Date(conv.updatedAt).getTime() / 1000,
  }));
}
```

### 4. Implement Validate Method

```typescript
validate(data: unknown): boolean {
  if (!Array.isArray(data)) return false;
  if (data.length === 0) return false;

  const first = data[0];
  return (
    typeof first === 'object' &&
    first !== null &&
    'id' in first &&
    'messages' in first
  );
}
```

### 5. Register the Adapter

Add your adapter to `src/adapters/index.ts`:

```typescript
import { MyPlatformAdapter } from './myplatform';

export function registerBuiltInAdapters(): void {
  registerAdapter(new ChatGPTAdapter());
  registerAdapter(new ClaudeAdapter());
  registerAdapter(new MyPlatformAdapter()); // Add this line
}
```

### 6. Add Tests

Create test file `tests/adapters/myplatform.test.ts`:

```typescript
import { MyPlatformAdapter } from '../../src/adapters/myplatform';

describe('MyPlatformAdapter', () => {
  let adapter: MyPlatformAdapter;

  beforeEach(() => {
    adapter = new MyPlatformAdapter();
  });

  describe('validate', () => {
    it('should validate correct format', () => {
      // Test validation
    });
  });

  describe('export', () => {
    it('should convert to standard format', async () => {
      // Test export
    });
  });

  describe('import', () => {
    it('should convert from standard format', async () => {
      // Test import
    });
  });
});
```

## Best Practices

1. **Handle Edge Cases**: Consider empty conversations, missing fields, etc.
2. **Preserve Metadata**: Store platform-specific data in metadata fields
3. **Token Counts**: Include token counts when available
4. **Error Messages**: Provide clear error messages for invalid data
5. **Type Safety**: Use TypeScript types for platform-specific data

## Example

See the existing adapters for complete examples:
- `src/adapters/chatgpt.ts` - ChatGPT/OpenAI adapter
- `src/adapters/claude.ts` - Anthropic Claude adapter
