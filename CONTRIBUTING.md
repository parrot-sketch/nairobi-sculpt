# Contribution Guidelines

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs
1. Use the GitHub issue tracker
2. Describe the bug clearly with steps to reproduce
3. Include environment details (OS, Node version, etc.)
4. Provide expected vs actual behavior

### Suggesting Features
1. Create a GitHub discussion or issue
2. Explain the use case and benefits
3. Provide examples or mockups if applicable
4. Discuss with the team before implementation

### Pull Request Process

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/nairobi-sculpt.git
   cd nairobi-sculpt
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/descriptive-name
   ```

3. **Make Changes**
   - Follow code style guidelines
   - Write tests for new features
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   pnpm test
   pnpm lint
   pnpm type-check
   ```

5. **Commit Changes**
   ```bash
   git commit -m "feat: description of feature"
   # Types: feat, fix, docs, style, refactor, test, chore
   ```

6. **Push to Remote**
   ```bash
   git push origin feature/descriptive-name
   ```

7. **Create Pull Request**
   - Use a clear title and description
   - Reference related issues
   - Ensure CI/CD checks pass
   - Request review from maintainers

8. **Review Process**
   - Address feedback from reviewers
   - Update code as needed
   - Rebase if necessary

9. **Merge**
   - Squash commits before merging
   - Use "Squash and merge" option
   - Delete feature branch after merge

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style (formatting, missing semicolons, etc)
- `refactor` - Code refactoring without feature/fix
- `test` - Adding or updating tests
- `chore` - Dependencies, configuration, etc

**Scope:** Optional, can be `auth`, `dashboard`, `api`, `db`, etc

**Subject:** 
- Use imperative mood ("add" not "adds")
- Don't capitalize first letter
- No period at the end
- Max 50 characters

**Example:**
```
feat(auth): add JWT token refresh endpoint

Implement automatic token refresh mechanism to improve user experience
when tokens expire. Users will not be logged out if their token
expires while they have the app open.

Fixes #123
```

## Code Style

### TypeScript
- Use semicolons
- Use single quotes for strings
- Use 2-space indentation
- Use `const` by default, `let` when needed
- Use meaningful variable names
- Add type annotations for function parameters and returns

### React Components
```tsx
// Good
export const MyComponent = ({ prop1, prop2 }: Props) => {
  return <div>{prop1}</div>;
};

// Avoid
const MyComponent = (props) => {
  return <div>{props.prop1}</div>;
};
```

### NestJS Services
```typescript
// Good
@Injectable()
export class UserService {
  async getUser(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}

// Avoid
export class UserService {
  getUser(id) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
```

## Testing Requirements

- New features must include tests
- Bug fixes should include tests
- Aim for 70%+ code coverage
- Write unit tests for logic
- Write integration tests for APIs

```typescript
// Example test
describe('AuthService', () => {
  it('should login user with valid credentials', async () => {
    const result = await authService.login('email@test.com', 'password');
    expect(result).toHaveProperty('token');
  });
});
```

## Documentation

- Update README for new features affecting users
- Update API docs for new endpoints
- Add JSDoc comments for public functions
- Update DEVELOPMENT.md for setup changes

## Code Review Checklist

Before submitting PR, ensure:
- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] No console.log or debug code
- [ ] Documentation is updated
- [ ] No breaking changes (or documented)
- [ ] Commit messages are clear
- [ ] PR description explains the change

## Questions or Need Help?

- Check existing issues and discussions
- Read the DEVELOPMENT.md guide
- Ask in project discussions
- Reach out to maintainers

## Thank You!

Your contributions make Nairobi Sculpt better. Thank you for helping! 🙏
