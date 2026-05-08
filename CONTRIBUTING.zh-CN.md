# 为 AI Memory Bridge 贡献代码

感谢您有兴趣为 AI Memory Bridge 做出贡献！我们欢迎社区的各种贡献。

## 如何贡献

### 报告 Bug

- 先在 [Issues](https://github.com/songchaoyang/ai-memory-bridge/issues) 中检查是否已存在该 bug
- 如果没有，创建一个新 issue，包含：
  - 清晰的 bug 描述
  - 复现步骤
  - 预期行为 vs 实际行为
  - 环境详情（操作系统、Node 版本等）

### 建议新功能

- 创建一个带有 "feature request" 标签的新 issue
- 描述功能及其使用场景
- 解释为什么它有价值

### 提交 Pull Request

1. Fork 仓库
2. 创建新分支 (`git checkout -b feature/amazing-feature`)
3. 进行更改
4. 运行测试 (`npm test`)
5. 提交更改 (`git commit -m 'Add amazing feature'`)
6. 推送到分支 (`git push origin feature/amazing-feature`)
7. 打开 Pull Request

## 开发环境设置

```bash
# 克隆你的 fork
git clone https://github.com/songchaoyang/ai-memory-bridge.git
cd ai-memory-bridge

# 安装依赖
npm install

# 运行测试
npm test

# 构建项目
npm run build

# 以开发模式运行 CLI
npm run dev -- --help
```

## 代码风格

- 我们使用 TypeScript
- 遵循 ESLint 和 Prettier 配置
- 编写有意义的提交信息
- 为新功能添加测试

## 添加新的平台适配器

详细指南请参见 [创建适配器](./docs/creating-adapters.zh-CN.md)。

## 许可证

通过贡献代码，您同意您的贡献将在 MIT 许可证下授权。
