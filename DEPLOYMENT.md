# Deployment Guide - Vercel

This guide will help you deploy your React + Vite application to Vercel.

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at https://vercel.com)
3. Your code pushed to a GitHub repository

## Deployment Options

### Option 1: Deploy via Vercel Dashboard (Recommended for First Time)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your GitHub repository
   - Vercel will auto-detect the Vite framework

3. **Configure Environment Variables:**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `your-backend-api-url`
   - Example: `https://api.yourbackend.com`

4. **Deploy:**
   - Click "Deploy"
   - Wait 1-2 minutes for the build
   - Your app will be live at: `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

   For production:
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables:**
   ```bash
   vercel env add VITE_API_URL production
   ```
   Then paste your API URL when prompted.

## Environment Variables

Make sure to set these in Vercel dashboard or CLI:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API endpoint | `https://api.example.com` |

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Automatic Deployments

Once connected to GitHub:
- ✅ Every push to `main` branch triggers a production deployment
- ✅ Every pull request gets a preview deployment
- ✅ GitHub Actions run tests before deployment

## Vercel Configuration

The `vercel.json` file configures:
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing: All routes redirect to `index.html`
- Asset caching: Static assets cached for 1 year

## Troubleshooting

### Build fails with "Module not found"
- Run `npm install` locally and ensure no errors
- Check that all dependencies are in `package.json`

### Environment variables not working
- Ensure variables start with `VITE_` prefix
- Redeploy after adding environment variables

### 404 on routes
- Already handled by `vercel.json` rewrites
- If issues persist, check `dist/` folder has `index.html`

### API requests failing
- Check `VITE_API_URL` is set correctly
- Enable CORS on your backend for Vercel domain

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Repository connected to Vercel
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Test the deployed application
- [ ] Configure custom domain (optional)
- [ ] Set up CI/CD with GitHub Actions

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Remove deployment
vercel rm [deployment-url]
```

## Support

- Vercel Documentation: https://vercel.com/docs
- Vite Documentation: https://vitejs.dev/guide/
- GitHub Actions: https://docs.github.com/actions
