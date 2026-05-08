<div align="center">

# 🌉 AI Memory Bridge

**跨AI平台记忆迁移工具 - 让你的AI对话无处不在**

[![npm version](https://badge.fury.io/js/ai-memory-bridge.svg)](https://www.npmjs.com/package/ai-memory-bridge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)](https://nodejs.org/)

[English](README.md) | 简体中文

</div>

---

## ✨ 为什么需要 AI Memory Bridge？

> 💡 **场景1**: 你在 ChatGPT 上进行了 400 万 Token 的深度对话，现在想切换到 Claude，但不想丢失所有上下文？
>
> 💡 **场景2**: 你在工作中使用 GPT-4，想在家里的本地模型上继续同一个项目？
>
> 💡 **场景3**: 你想备份所有 AI 对话记录，防止平台数据丢失？

**AI Memory Bridge** 解决了这些问题！它让你能够：

- 🚀 **一键导出** 任何AI平台的对话记录
- 🔄 **无缝转换** 到标准格式
- 📥 **轻松导入** 到其他AI平台
- 🔍 **搜索和管理** 你的AI记忆库

## 🎯 核心特性

| 特性 | 描述 |
|------|------|
| 🌐 **多平台支持** | ChatGPT、Claude、Gemini、DeepSeek、Grok 等主流AI平台 |
| 📦 **标准格式** | 统一的标准记忆体格式，跨平台通用 |
| 🔄 **双向转换** | 支持导出和导入，来去自由 |
| 🔍 **智能搜索** | 在海量对话中快速找到你需要的内容 |
| 📊 **统计分析** | 查看Token使用量、对话统计等 |
| 🔧 **CLI工具** | 强大的命令行界面，自动化你的工作流 |
| 💻 **编程API** | 支持程序化调用，集成到你的应用中 |

## 🚀 快速开始

### 安装

```bash
# 全局安装
npm install -g ai-memory-bridge

# 或使用 npx（无需安装）
npx ai-memory-bridge --help
```

### 基本使用

#### 1️⃣ 导出 ChatGPT 对话

```bash
# 从 ChatGPT 导出文件转换为标准记忆体
aimb export \
  --source chatgpt \
  --input ~/Downloads/chatgpt_export.json \
  --output my_memory.json
```

#### 2️⃣ 导入到 Claude

```bash
# 将标准记忆体转换为 Claude 格式
aimb import \
  --target claude \
  --input my_memory.json \
  --output claude_import.json
```

#### 3️⃣ 一键转换（推荐）

```bash
# 直接从 ChatGPT 转换到 Claude
aimb convert \
  --source chatgpt \
  --target claude \
  --input chatgpt_export.json \
  --output claude_ready.json
```

## 📚 完整命令指南

### 🔌 查看支持的适配器

```bash
aimb adapters
```

### 📤 导出命令

```bash
aimb export \
  --source <platform> \
  --input <source-file> \
  --output <output-file> \
  --format <json|yaml|markdown> \
  [--no-metadata]
```

**参数说明：**
- `--source, -s`: 源平台 (chatgpt, claude, ...)
- `--input, -i`: 输入文件路径
- `--output, -o`: 输出文件路径
- `--format, -f`: 输出格式 (默认: json)
- `--no-metadata`: 不包含元数据

### 📥 导入命令

```bash
aimb import \
  --target <platform> \
  --input <memory-file> \
  --output <output-file> \
  --strategy <overwrite|append|skip>
```

### 🔄 转换命令

```bash
aimb convert \
  --source <platform> \
  --target <platform> \
  --input <input-file> \
  --output <output-file>
```

### 📊 统计信息

```bash
aimb stats --input my_memory.json
```

输出示例：
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

### 🔍 搜索对话

```bash
aimb search \
  --input my_memory.json \
  --query "机器学习"
```

### 🔗 合并多个记忆体

```bash
aimb merge \
  --inputs memory1.json memory2.json memory3.json \
  --output combined_memory.json \
  --source "My AI History"
```

## 🏗️ 标准记忆体格式

AI Memory Bridge 使用统一的 JSON 格式存储对话数据：

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
      "title": "Python学习笔记",
      "messages": [
        {
          "id": "msg_001",
          "role": "user",
          "content": "教我Python基础",
          "timestamp": "2024-01-15T10:00:00.000Z",
          "tokens": 15
        },
        {
          "id": "msg_002",
          "role": "assistant",
          "content": "好的！Python是一种...",
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

## 💻 编程API

你也可以在自己的项目中使用 AI Memory Bridge：

```typescript
import { MemoryCore, ChatGPTAdapter, ClaudeAdapter } from 'ai-memory-bridge';

// 导出 ChatGPT 数据
const chatgptAdapter = new ChatGPTAdapter();
const chatgptData = JSON.parse(await fs.readFile('chatgpt.json', 'utf-8'));
const memory = await chatgptAdapter.export(chatgptData);

// 保存标准记忆体
await MemoryCore.exportToFile(memory, 'backup.json', { format: 'json' });

// 导入到 Claude
const claudeAdapter = new ClaudeAdapter();
const claudeData = await claudeAdapter.import(memory);

// 合并多个记忆体
const memory1 = await MemoryCore.importFromFile('memory1.json');
const memory2 = await MemoryCore.importFromFile('memory2.json');
const merged = MemoryCore.merge([memory1, memory2], 'combined');

// 搜索对话
const results = MemoryCore.search(merged, '关键词');

// 获取统计信息
const stats = MemoryCore.getStats(merged);
console.log(`Total tokens: ${stats.totalTokens}`);
```

## 🔧 支持的AI平台

| 平台 | 导出 | 导入 | 状态 |
|------|------|------|------|
| OpenAI ChatGPT | ✅ | ✅ | 稳定 |
| Anthropic Claude | ✅ | ✅ | 稳定 |
| Google Gemini | 🚧 | 🚧 | 开发中 |
| DeepSeek | 🚧 | 🚧 | 开发中 |
| xAI Grok | 🚧 | 🚧 | 开发中 |
| 阿里通义千问 | 🚧 | 🚧 | 开发中 |
| 本地模型 (Ollama) | ✅ | ✅ | 稳定 |

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 开发环境搭建

```bash
# 克隆仓库
git clone https://github.com/960208781/ai-memory-bridge.git
cd ai-memory-bridge

# 安装依赖
npm install

# 运行测试
npm test

# 构建项目
npm run build

# 本地运行 CLI
npm run dev -- --help
```

### 添加新的平台适配器

1. 在 `src/adapters/` 创建新的适配器文件
2. 继承 `BaseAdapter` 类
3. 实现 `export`, `import`, `validate` 方法
4. 在 `src/adapters/index.ts` 注册适配器

示例：

```typescript
import { BaseAdapter } from './base';
import { AIMemory, ExportOptions, ImportOptions } from '../core/types';

export class MyPlatformAdapter extends BaseAdapter {
  readonly name = 'myplatform';
  readonly version = '1.0.0';

  async export(sourceData: unknown, options?: ExportOptions): Promise<AIMemory> {
    // 实现导出逻辑
  }

  async import(memory: AIMemory, options?: ImportOptions): Promise<unknown> {
    // 实现导入逻辑
  }

  validate(data: unknown): boolean {
    // 验证数据格式
  }
}
```

## 📋 路线图

- [x] 核心架构设计
- [x] ChatGPT 适配器
- [x] Claude 适配器
- [x] CLI 工具
- [ ] Gemini 适配器
- [ ] DeepSeek 适配器
- [ ] Grok 适配器
- [ ] 通义千问适配器
- [ ] 网页版数据抓取
- [ ] 加密存储支持
- [ ] 云端同步功能
- [ ] VS Code 插件

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

## 💬 社区

- 📧 问题反馈: [GitHub Issues](https://github.com/960208781/ai-memory-bridge/issues)
- 💬 讨论交流: [GitHub Discussions](https://github.com/960208781/ai-memory-bridge/discussions)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给我们一个 Star！** ⭐

Made with ❤️ by AI Memory Bridge Team

</div>
