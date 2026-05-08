# Contributing to AI Memory Bridge

Thank you for your interest in contributing to AI Memory Bridge! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

- Check if the bug has already been reported in [Issues](https://github.com/songchaoyang/ai-memory-bridge/issues)
- If not, create a new issue with:
  - Clear description of the bug
  - Steps to reproduce
  - Expected vs actual behavior
  - Environment details (OS, Node version, etc.)

### Suggesting Features

- Open a new issue with the "feature request" label
- Describe the feature and its use case
- Explain why it would be valuable

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/songchaoyang/ai-memory-bridge.git
cd ai-memory-bridge

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

# Run CLI in development mode
npm run dev -- --help
```

## Code Style

- We use TypeScript
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features

## Adding a New Platform Adapter

See [Creating Adapters](./docs/creating-adapters.md) for detailed guide.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
