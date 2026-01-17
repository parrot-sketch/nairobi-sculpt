# GitHub Setup Guide for Nairobi Sculpt Monorepo

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new) and sign in
2. Click **"New"** to create a new repository
3. Fill in the details:
   - **Repository name**: `nairobi-sculpt`
   - **Description**: `Healthcare Management System - Full Stack Monorepo`
   - **Visibility**: Choose **Private** (for confidential project) or **Public**
   - **Initialize repository**: Leave unchecked (we already have commits)
4. Click **"Create repository"**

## Step 2: Add Remote and Push

Once the repository is created, GitHub will show you commands. Replace `<your-username>` with your GitHub username:

```bash
cd /home/parrot/nairobi-sculpt

# Add remote
git remote add origin https://github.com/<your-username>/nairobi-sculpt.git

# Rename branch to main (optional but recommended)
git branch -M main

# Push to GitHub
git push -u origin main
```

Or using SSH (if configured):
```bash
git remote add origin git@github.com:<your-username>/nairobi-sculpt.git
git branch -M main
git push -u origin main
```

## Step 3: Configure Repository Settings

### Branch Protection Rules

1. Go to **Settings** → **Branches**
2. Click **"Add rule"** under Branch protection rules
3. Set up for `main` branch:
   - Pattern name: `main`
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators

### Require Status Checks

1. Go to **Settings** → **Branches** → **Branch protection rules** → Edit `main`
2. Under "Require status checks to pass before merging", select:
   - `build-and-test / build-and-test (18.x)`
   - `build-and-test / build-and-test (20.x)`

### Enable Actions

1. Go to **Settings** → **Actions** → **General**
2. Under "Actions permissions", select **"Allow all actions and reusable workflows"**
3. Click **Save**

## Step 4: Set Up Secrets (for CI/CD)

Go to **Settings** → **Secrets and variables** → **Actions** and add:

### For Deploy Workflow (optional)
```
VERCEL_TOKEN: <your-vercel-token>
SLACK_WEBHOOK: <your-slack-webhook-url>
```

### For Private Registry (if using)
```
NPM_TOKEN: <your-npm-token>
```

## Step 5: Configure Code Scanning (optional)

1. Go to **Settings** → **Code security and analysis**
2. Enable:
   - ✅ **Dependabot alerts**
   - ✅ **Dependabot security updates**
   - ✅ **Code scanning** (using GitHub Actions)

## Step 6: Clone Locally (for team members)

```bash
# Clone the repository
git clone https://github.com/<your-username>/nairobi-sculpt.git
cd nairobi-sculpt

# Install dependencies
pnpm install

# Start development
pnpm dev
```

## Workflow: Creating Features

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
```bash
# Work on your feature
pnpm dev
pnpm test

# Commit changes
git add .
git commit -m "feat: add your feature description"
```

### 3. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Go to GitHub and click **"Compare & pull request"**

### 4. PR Checklist
Before submitting, ensure:
- [ ] Branch name follows convention (`feature/`, `fix/`, `docs/`, etc.)
- [ ] Commit messages are clear and descriptive
- [ ] Code follows project style guide
- [ ] Tests are added/updated
- [ ] Documentation is updated
- [ ] No sensitive data in commits

### 5. Review and Merge
- Maintainers review the PR
- CI/CD checks must pass
- Once approved, merge to `main`
- Branch is auto-deleted after merge

## Development Branch Strategy

```
main (production-ready)
 ↓
develop (staging/integration)
 ↓
feature/* (feature branches from develop)
 ↓
fix/* (bug fix branches from develop)
```

**Alternative - Simple Strategy:**
- Push directly to `main` after PR approval
- Use tags for releases: `v1.0.0`, `v1.1.0`, etc.

## GitHub Actions Workflows

The project includes automated workflows:

### CI Workflow (`.github/workflows/ci.yml`)
- Runs on: `push` to `main`/`develop`, `pull_request`
- Steps: Install → Lint → Type check → Build → Test

### Deploy Workflow (`.github/workflows/deploy.yml`)
- Runs on: `push` to `main`
- Steps: Build → Deploy Web (Vercel) → Notify Slack

### Manual Workflow Triggers
View workflow results:
1. Go to **Actions** tab
2. Select workflow
3. Click **"Run workflow"** to manually trigger

## Viewing CI/CD Status

- **On PR**: See status checks in the PR description
- **In Commits**: Green checkmark = passed, Red X = failed
- **In Actions tab**: Full details of workflow runs

## Setting Up Team

1. Go to **Settings** → **Collaborators and teams**
2. Click **"Invite teams or people"**
3. Search for team member's GitHub username
4. Select role:
   - `pull` - read-only access
   - `push` - read/write access (developers)
   - `admin` - full access (maintainers)

## Protecting from Common Mistakes

### Prevent Accidental Pushes to Main
```bash
# Add to .git/hooks/pre-push (create if doesn't exist)
#!/bin/bash
branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$branch" = "main" ]; then
    echo "❌ Direct push to main not allowed!"
    exit 1
fi
```

### Pre-commit Linting
Already configured in project - runs automatically before commits.

## Monitoring Repository Health

### Code Quality
- **Dependabot**: Monitor and update dependencies
- **GitHub Security**: View security alerts
- **Actions**: Monitor test pass rates

### Insights
Go to **Insights** tab to view:
- Network graph (branch history)
- Pulse (activity overview)
- Contributors
- Traffic
- Dependency health

## Syncing Fork (if forked)

If working with a fork:
```bash
# Add upstream remote
git remote add upstream https://github.com/original-owner/nairobi-sculpt.git

# Fetch latest from upstream
git fetch upstream

# Merge upstream main into your main
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

## Troubleshooting

### Q: CI/CD failing?
A: Check **Actions** tab → Failed workflow → View logs

### Q: Merge conflicts?
A: 
```bash
git fetch origin
git merge origin/main
# Resolve conflicts in code
git add .
git commit -m "Resolve merge conflicts"
```

### Q: Need to undo commits?
A: For unpushed commits only:
```bash
git reset --soft HEAD~1  # Undo last commit, keep changes
git reset --hard HEAD~1  # Undo last commit, discard changes
```

### Q: Accidental push to main?
A: Contact repository admin to force push or revert

## Resources

- [GitHub Docs](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Monorepo Best Practices](https://monorepo.tools)

## Next Steps

1. ✅ Push to GitHub
2. ✅ Configure branch protection
3. ✅ Set up team members
4. ✅ Monitor CI/CD status
5. ✅ Start contributing features!

---

**Questions?** Check GitHub Docs or contact your team lead.
