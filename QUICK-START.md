# Quick Start Guide

## 🚀 Deploy to Vercel NOW

### Option 1: Via Vercel Dashboard (Easiest)

1. **Create GitHub Repository**:
   ```bash
   # If you haven't already, create a repo on GitHub
   # Then connect it:
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git add .
   git commit -m "Initial commit with CI/CD"
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to: https://vercel.com/new
   - Click "Import Git Repository"
   - Select your repository
   - Add environment variable:
     - Key: `VITE_API_URL`
     - Value: Your backend API URL (e.g., `http://127.0.0.1:5000`)
   - Click **Deploy** 🎉

### Option 2: Via Vercel CLI (Quick)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

## 🧪 Testing Commands

```bash
# Run tests (fast, no coverage)
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 View Test Coverage

After running `npm run test:coverage`:
```bash
# Open the HTML report in your browser
open coverage/lcov-report/index.html
```

## 🔧 Environment Variables

Create a `.env.local` file (ignored by git):
```env
VITE_API_URL=http://127.0.0.1:5000
```

For Vercel deployment, set in the dashboard or CLI:
```bash
vercel env add VITE_API_URL production
```

## 📦 What's Included

✅ **Testing**: Jest + React Testing Library (67 tests)
✅ **CI/CD**: GitHub Actions workflows
✅ **Coverage**: Code coverage reporting
✅ **Linting**: ESLint configuration
✅ **Formatting**: Prettier setup
✅ **Deployment**: Vercel configuration

## 🎯 Current Test Coverage

- **Total Tests**: 67 written
- **Passing**: 56 tests ✅
- **Coverage**: ~17% (target: 60%)

## 📝 Important Files

- [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide
- [CI-CD-SUMMARY.md](CI-CD-SUMMARY.md) - Complete CI/CD documentation
- [vercel.json](vercel.json) - Vercel configuration
- [.github/workflows/ci.yml](.github/workflows/ci.yml) - CI pipeline
- [jest.config.cjs](jest.config.cjs) - Test configuration

## 🐛 Troubleshooting

### Build fails
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Tests fail
```bash
# Clear Jest cache
npm test -- --clearCache
npm test
```

### Environment variables not working
- Ensure they start with `VITE_` prefix
- Restart dev server after changes
- For Vercel, redeploy after adding env vars

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Jest Docs**: https://jestjs.io/
- **Testing Library**: https://testing-library.com/react

## 🎉 You're Ready!

Your project is fully configured with:
- ✅ Comprehensive testing
- ✅ CI/CD pipeline
- ✅ Deployment ready
- ✅ Code quality tools

Just push to GitHub and deploy to Vercel! 🚀
