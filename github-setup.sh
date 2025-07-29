#!/bin/bash

echo "🚀 GitHub Repository Setup Script"
echo "=================================="
echo ""
echo "Before running this script:"
echo "1. Go to https://github.com/new"
echo "2. Create a new repository named 'rates-inventory-management'"
echo "3. Don't initialize with README, .gitignore, or license"
echo "4. Copy the repository URL (e.g., https://github.com/yourusername/rates-inventory-management.git)"
echo ""

read -p "Enter your GitHub repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Repository URL is required!"
    exit 1
fi

echo ""
echo "🔗 Adding GitHub remote..."
git remote add origin "$REPO_URL"

echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Successfully uploaded to GitHub!"
echo "🌐 Your repository is now available at: $REPO_URL"
echo ""
echo "Next steps:"
echo "1. Visit your repository on GitHub"
echo "2. Set up branch protection rules (optional)"
echo "3. Add collaborators (optional)"
echo "4. Configure GitHub Actions for CI/CD (optional)"
echo ""
echo "🎉 Your Revenue Management Platform is now on GitHub!" 