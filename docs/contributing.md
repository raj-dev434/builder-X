# Contributing to BuilderX

Thank you for your interest in contributing to BuilderX! This guide will help you get started with contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Documentation](#documentation)
- [Testing](#testing)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@smackcoders.com](mailto:conduct@smackcoders.com).

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18+
- Git
- A code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Fork and Clone

1. **Fork the repository** on GitLab
2. **Clone your fork**:
   ```bash
   git clone https://gitlab.com/your-username/js-pagebuilder.git
   cd js-pagebuilder
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://gitlab.com/smackcoders/fenzik/js-pagebuilder.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

Use descriptive branch names:

```bash
# Features
feature/add-video-block
feature/improve-drag-drop

# Bug fixes
fix/text-editing-cursor
fix/export-html-formatting

# Documentation
docs/update-api-reference
docs/add-integration-examples

# Refactoring
refactor/optimize-rendering
refactor/improve-state-management
```

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(blocks): add video block support
fix(canvas): resolve drag and drop positioning
docs(api): update export function documentation
test(components): add TextBlock unit tests
```

### Development Process

1. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** with tests and documentation

3. **Run tests**:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

4. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat(blocks): add video block support"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create merge request** on GitLab

## Contributing Guidelines

### Code Style

- **TypeScript**: Use strict typing, avoid `any`
- **React**: Functional components with hooks
- **CSS**: Tailwind utility classes preferred
- **Naming**: Use descriptive, camelCase names
- **Comments**: Document complex logic

### File Organization

- Keep components small and focused
- Use index files for clean imports
- Group related functionality together
- Follow the established folder structure

### Performance

- Use `React.memo` for expensive components
- Implement `useCallback` for stable references
- Avoid unnecessary re-renders
- Optimize bundle size

### Accessibility

- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers

## Pull Request Process

### Before Submitting

1. **Update documentation** for any new features
2. **Add tests** for new functionality
3. **Ensure all tests pass**
4. **Update CHANGELOG.md** if applicable
5. **Rebase on latest main branch**

### Pull Request Template

Use the provided template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** by QA team (if applicable)
4. **Approval** from at least one maintainer
5. **Merge** by maintainer

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 1.0.0]

**Additional context**
Any other context about the problem.
```

### Security Issues

For security vulnerabilities, please email [security@smackcoders.com](mailto:security@smackcoders.com) instead of creating a public issue.

## Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots about the feature request.
```

### Feature Evaluation

Features are evaluated based on:

- **User demand** and community interest
- **Technical feasibility** and complexity
- **Alignment** with project goals
- **Maintenance burden** and long-term support
- **Breaking changes** and migration effort

## Documentation

### Documentation Standards

- **Clear and concise** writing
- **Code examples** for complex concepts
- **Screenshots** for UI changes
- **API documentation** for new functions
- **Migration guides** for breaking changes

### Documentation Types

- **README**: Project overview and quick start
- **API Reference**: Complete function documentation
- **Integration Guide**: Platform-specific instructions
- **Architecture**: Technical design decisions
- **Development**: Setup and contribution guide

### Updating Documentation

1. **Update relevant docs** with your changes
2. **Add examples** for new features
3. **Update API reference** for new functions
4. **Test documentation** for accuracy

## Testing

### Test Requirements

- **Unit tests** for new functions
- **Component tests** for UI changes
- **Integration tests** for complex workflows
- **E2E tests** for critical user paths

### Test Structure

```typescript
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should do something', () => {
      // Test implementation
    });
  });
});
```

### Test Coverage

- Aim for **80%+ coverage** on new code
- Test **happy paths** and **error cases**
- Include **edge cases** and **boundary conditions**
- Mock **external dependencies**

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Release notes prepared
- [ ] Git tag created
- [ ] Release published

### Release Notes

Include in release notes:

- **New features** with descriptions
- **Bug fixes** with issue references
- **Breaking changes** with migration guide
- **Performance improvements**
- **Security updates**

## Recognition

### Contributors

Contributors are recognized in:

- **README.md** contributors section
- **Release notes** for significant contributions
- **GitLab contributors** page
- **Community highlights** in blog posts

### Types of Contributions

We value all types of contributions:

- **Code contributions** (features, bug fixes)
- **Documentation** improvements
- **Testing** and quality assurance
- **Community support** and help
- **Design** and user experience feedback
- **Translation** and localization

## Getting Help

### Resources

- **Documentation**: [docs/](./README.md)
- **Issues**: [GitLab Issues](https://gitlab.com/smackcoders/fenzik/js-pagebuilder/-/issues)
- **Discussions**: [GitLab Discussions](https://gitlab.com/smackcoders/fenzik/js-pagebuilder/-/discussions)
- **Discord**: [Community Server](https://discord.gg/builderx)

### Contact

- **General questions**: [support@smackcoders.com](mailto:support@smackcoders.com)
- **Security issues**: [security@smackcoders.com](mailto:security@smackcoders.com)
- **Commercial support**: [enterprise@smackcoders.com](mailto:enterprise@smackcoders.com)

## License

By contributing to BuilderX, you agree that your contributions will be licensed under the BSD 3-Clause License. See [LICENSE](../LICENSE) for details.

## Thank You

Thank you for contributing to BuilderX! Your contributions help make this project better for everyone. We appreciate your time and effort in improving the project.

---

**Happy coding! 🚀**
