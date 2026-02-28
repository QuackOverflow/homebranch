# Contributing Guidelines

Thank you for your interest in contributing to Homebranch!

## How to Contribute

1. **Fork the repository** and clone your fork locally.
2. **Create a new branch** from `dev` for your feature or fix.
3. **Follow Clean Architecture** conventions (see README for details).
4. **Write tests** for new features and bug fixes. Place unit tests in `test/` mirroring the source structure.
5. **Run lint and tests** before submitting:
   - `npm run lint`
   - `npm test`
6. **Open a pull request** against the `dev` branch. Include a clear description of your changes.
7. **Respond to review feedback** promptly.

## Code Style
- Use Prettier and ESLint (`npm run format` and `npm run lint`).
- Use string tokens for DI (see README).
- Do not throw for business logic errors—use the `Result` type.

## Commit Messages
- Use concise, descriptive commit messages.
- Reference related issues when applicable.

## Reporting Issues
- Use GitHub Issues for bugs and feature requests.
- Provide steps to reproduce, expected behavior, and relevant logs/code.

## Contact
For questions, open an issue or discussion on GitHub.
