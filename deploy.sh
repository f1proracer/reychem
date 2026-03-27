#!/usr/bin/env bash
# =============================================================
#  ReyChem — GitHub Deployment Script
#  Run this ONCE from inside the reychem-redesign folder.
#  It will push all files to your existing GitHub repo and
#  enable GitHub Pages automatically.
# =============================================================

set -e  # Stop on any error

# ── CONFIGURATION — edit these if needed ─────────────────────
GITHUB_USER="f1proracer"
REPO_NAME="reychem"
BRANCH="main"
REMOTE_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
# ─────────────────────────────────────────────────────────────

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   ReyChem — GitHub Pages Deployment Script  ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# 1. Check git is installed
if ! command -v git &> /dev/null; then
  echo "❌ Git is not installed. Please install Git first:"
  echo "   https://git-scm.com/downloads"
  exit 1
fi

echo "✅ Git found: $(git --version)"

# 2. Initialise git repo (if not already)
if [ ! -d ".git" ]; then
  echo ""
  echo "🔧 Initialising git repository..."
  git init
  git branch -M ${BRANCH}
fi

# 3. Set remote (add or update)
if git remote get-url origin &> /dev/null 2>&1; then
  echo "🔧 Updating remote origin to ${REMOTE_URL}"
  git remote set-url origin "${REMOTE_URL}"
else
  echo "🔧 Adding remote origin: ${REMOTE_URL}"
  git remote add origin "${REMOTE_URL}"
fi

# 4. Stage all files
echo ""
echo "📁 Staging all files..."
git add .

# 5. Check if there's anything to commit
if git diff --cached --quiet; then
  echo "ℹ️  No changes to commit — all files already up to date."
else
  echo ""
  echo "💾 Creating commit..."
  git commit -m "feat: complete modern redesign — new UI, all service pages, GitHub Actions CI/CD

- Full redesign with modern Inter typography and teal/navy design system
- 11 pages: Home, About, Services (×8 detail pages), Testimonials, Resources, Contact
- Mobile-first responsive layout with sticky nav, scroll animations, FAQ accordion
- 2 new adjacent services: Private Label & REACH Training Workshops
- GitHub Actions workflow for automatic deployment on push
- SEO: canonical URLs, Open Graph, JSON-LD structured data
- Accessibility: semantic HTML, ARIA labels, keyboard navigation
- Performance: system fonts, CDN, no build step required"
fi

# 6. Push to GitHub
echo ""
echo "🚀 Pushing to GitHub (${REMOTE_URL})..."
echo "   You may be prompted for your GitHub username and password/token."
echo ""
git push -u origin ${BRANCH}

# 7. Enable GitHub Pages via GitHub CLI (optional — requires 'gh' CLI)
echo ""
if command -v gh &> /dev/null; then
  echo "🌐 Enabling GitHub Pages via GitHub CLI..."
  gh api repos/${GITHUB_USER}/${REPO_NAME}/pages \
    --method POST \
    --field source='{"branch":"'${BRANCH}'","path":"/"}' \
    --silent 2>/dev/null && \
    echo "✅ GitHub Pages enabled!" || \
    echo "ℹ️  GitHub Pages may already be enabled (that's fine)."
else
  echo "ℹ️  GitHub CLI not found — skipping automatic Pages activation."
  echo ""
  echo "   To enable GitHub Pages manually:"
  echo "   1. Go to https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/pages"
  echo "   2. Under 'Source', select 'GitHub Actions'"
  echo "   3. Save — your site will deploy automatically on every push."
fi

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║           🎉 Deployment Complete!            ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "  Your site will be live in ~60 seconds at:"
echo "  🌐 https://reychem.co.uk"
echo ""
echo "  GitHub Actions will now auto-deploy every time"
echo "  you push changes to the '${BRANCH}' branch."
echo ""
echo "  To make future updates:"
echo "    git add ."
echo "    git commit -m 'your update message'"
echo "    git push"
echo ""
