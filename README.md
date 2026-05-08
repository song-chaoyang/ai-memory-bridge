<div align="center">

# 🌉 AI Memory Bridge

**Universal AI Memory Migration Tool - Take Your AI Conversations Everywhere**

[![npm version](https://badge.fury.io/js/ai-memory-bridge.svg)](https://www.npmjs.com/package/ai-memory-bridge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)](https://nodejs.org/)

English | [简体中文](README.zh-CN.md)

</div>

---

## ✨ Why AI Memory Bridge?

> 💡 **Scenario 1**: You've had 4M tokens of deep conversations on ChatGPT and want to switch to Claude without losing all context?
>
> 💡 **Scenario 2**: You use GPT-4 at work and want to continue the same project on your local model at home?
>
> 💡 **Scenario 3**: You want to backup all your AI conversation records to prevent data loss?

**AI Memory Bridge** solves these problems! It enables you to:

- 🚀 **One-click export** conversation records from any AI platform
- 🔄 **Seamlessly convert** to a standard format
- 📥 **Easily import** to other AI platforms
- 🔍 **Search and manage** your AI memory library

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🌐 **Multi-Platform Support** | ChatGPT, Claude, Gemini, DeepSeek, Grok, and more major AI platforms |
| 📦 **Standard Format** | Unified standard memory format, cross-platform compatible |
| 🔄 **Bidirectional Conversion** | Support both export and import, complete freedom |
| 🔍 **Smart Search** | Quickly find what you need in massive conversation histories |
| 📊 **Analytics** | View token usage, conversation statistics, and more |
| 🔧 **CLI Tool** | Powerful command-line interface to automate your workflow |
| 💻 **Programmatic API** | Support for programmatic integration into your applications |

## 🚀 Quick Start

### Installation

```bash
# Global installation
npm install -g ai-memory-bridge

# Or use npx (no installation needed)
npx ai-memory-bridge --help
```

### Basic Usage

#### 1️⃣ Export ChatGPT Conversations

```bash
# Convert ChatGPT export file to standard memory format
aimb export \
  --source chatgpt \
  --input ~/Downloads/chatgpt_export.json \
  --output my_memory.json
```

#### 2️⃣ Import to Claude

```bash
# Convert standard memory to Claude format
aimb import \
  --target claude \
  --input my_memory.json \
  --output claude_import.json
```

#### 3️⃣ One-Click Conversion (Recommended)

```bash
# Directly convert from ChatGPT to Claude
aimb convert \
  --source chatgpt \
  --target claude \
  --input chatgpt_export.json \
  --output claude_ready.json
```

## 📚 Complete Command Guide

### 🔌 View Supported Adapters

```bash
aimb adapters
```

### 📤 Export Command

```bash
aimb export \
  --source <platform> \
  --input <source-file> \
  --output <output-file> \
  --format <json|yaml|markdown> \
  [--no-metadata]
```

**Parameters:**
- `--source, -s`: Source platform (chatgpt, claude, ...)
- `--input, -i`: Input file path
- `--output, -o`: Output file path
- `--format, -f`: Output format (default: json)
- `--no-metadata`: Exclude metadata from export

### 📥 Import Command

```bash
aimb import \
  --target <platform> \
  --input <memory-file> \
  --output <output-file> \
  --strategy <overwrite|append|skip>
```

### 🔄 Convert Command

```bash
aimb convert \
  --source <platform> \
  --target <platform> \
  --input <input-file> \
  --output <output-file>
```

### 📊 Statistics

```bash
aimb stats --input my_memory.json
```

Example output:
```
📊 Memory Statistics
══════════════════════════════════════════════════

📁 General Information
  Source Platform: chatgpt
  Memory Version:  1.0.0
  Export Date:     2024-01-15T10:30:00.000Z

💬 Conversations
  Total Conversations: 42
  Total Messages:      1,234
  Avg Messages/Conv:   29.4

🔢 Tokens
  Total Tokens: 456,789
  Avg Tokens/Message: 370
```

### 🔍 Search Conversations

```bash
aimb search \
  --input my_memory.json \
  --query "machine learning"
```

### 🔗 Merge Multiple Memories

```bash
aimb merge \
  --inputs memory1.json memory2.json memory3.json \
  --output combined_memory.json \
  --source "My AI History"
```

## 🏗️ Standard Memory Format

AI Memory Bridge uses a unified JSON format to store conversation data:

```json
{
  "version": "1.0.0",
  "exportDate": "2024-01-15T10:30:00.000Z",
  "source": {
    "platform": "chatgpt",
    "version": "4.0",
    "userId": "user_123"
  },
  "conversations": [
    {
      "id": "conv_001",
      "title": "Python Learning Notes",
      "messages": [
        {
          "id": "msg_001",
          "role": "user",
          "content": "Teach me Python basics",
          "timestamp": "2024-01-15T10:00:00.000Z",
          "tokens": 15
        },
        {
          "id": "msg_002",
          "role": "assistant",
          "content": "Sure! Python is a...",
          "timestamp": "2024-01-15T10:00:05.000Z",
          "tokens": 150
        }
      ],
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "tags": ["python", "tutorial"]
    }
  ],
  "summary": {
    "totalConversations": 1,
    "totalMessages": 2,
    "totalTokens": 165,
    "dateRange": {
      "start": "2024-01-15T10:00:00.000Z",
      "end": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

## 💻 Programmatic API

You can also use AI Memory Bridge in your own projects:

```typescript
import { MemoryCore, ChatGPTAdapter, ClaudeAdapter } from 'ai-memory-bridge';

// Export ChatGPT data
const chatgptAdapter = new ChatGPTAdapter();
const chatgptData = JSON.parse(await fs.readFile('chatgpt.json', 'utf-8'));
const memory = await chatgptAdapter.export(chatgptData);

// Save standard memory
await MemoryCore.exportToFile(memory, 'backup.json', { format: 'json' });

// Import to Claude
const claudeAdapter = new ClaudeAdapter();
const claudeData = await claudeAdapter.import(memory);

// Merge multiple memories
const memory1 = await MemoryCore.importFromFile('memory1.json');
const memory2 = await MemoryCore.importFromFile('memory2.json');
const merged = MemoryCore.merge([memory1, memory2], 'combined');

// Search conversations
const results = MemoryCore.search(merged, 'keyword');

// Get statistics
const stats = MemoryCore.getStats(merged);
console.log(`Total tokens: ${stats.totalTokens}`);
```

## 🔧 Supported AI Platforms

| Platform | Export | Import | Status |
|----------|--------|--------|--------|
| OpenAI ChatGPT | ✅ | ✅ | Stable |
| Anthropic Claude | ✅ | ✅ | Stable |
| Google Gemini | 🚧 | 🚧 | In Development |
| DeepSeek | 🚧 | 🚧 | In Development |
| xAI Grok | 🚧 | 🚧 | In Development |
| Alibaba Tongyi Qianwen | 🚧 | 🚧 | In Development |
| Local Models (Ollama) | ✅ | ✅ | Stable |

## 🤝 Contributing

We welcome all forms of contributions!

### Development Setup

```bash
# Clone repository
git clone https://github.com/960208781/ai-memory-bridge.git
cd ai-memory-bridge

# Install dependencies
npm install

# Run tests
npm test

# Build project
npm run build

# Run CLI locally
npm run dev -- --help
```

### Adding a New Platform Adapter

1. Create a new adapter file in `src/adapters/`
2. Extend the `BaseAdapter` class
3. Implement `export`, `import`, `validate` methods
4. Register the adapter in `src/adapters/index.ts`

Example:

```typescript
import { BaseAdapter } from './base';
import { AIMemory, ExportOptions, ImportOptions } from '../core/types';

export class MyPlatformAdapter extends BaseAdapter {
  readonly name = 'myplatform';
  readonly version = '1.0.0';

  async export(sourceData: unknown, options?: ExportOptions): Promise<AIMemory> {
    // Implement export logic
  }

  async import(memory: AIMemory, options?: ImportOptions): Promise<unknown> {
    // Implement import logic
  }

  validate(data: unknown): boolean {
    // Validate data format
  }
}
```

## 📋 Roadmap

- [x] Core architecture design
- [x] ChatGPT adapter
- [x] Claude adapter
- [x] CLI tool
- [ ] Gemini adapter
- [ ] DeepSeek adapter
- [ ] Grok adapter
- [ ] Tongyi Qianwen adapter
- [ ] Web data scraping
- [ ] Encrypted storage support
- [ ] Cloud sync functionality
- [ ] VS Code extension

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

Thanks to all developers who have contributed to this project!

## 💬 Community

- 📧 Issue Reports: [GitHub Issues](https://github.com/960208781/ai-memory-bridge/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/960208781/ai-memory-bridge/discussions)

---

<div align="center">

**⭐ If this project helps you, please give us a Star!** ⭐

Made with ❤️ by AI Memory Bridge Team

</div>
