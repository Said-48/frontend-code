# GitHub Secrets Configuration

## 🔐 Required Secrets for Vercel Deployment

Add these secrets to your GitHub repository for automated Vercel deployments.

### Where to Add Secrets:
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

---

## Required Secrets

### 1. VERCEL_TOKEN
- **Name**: `VERCEL_TOKEN`
- **Description**: Your Vercel API authentication token
- **How to get it**:
  1. Go to https://vercel.com/account/tokens
  2. Click **"Create Token"**
  3. Name: `GitHub Actions`
  4. Scope: `Full Account`
  5. Copy the token
- **Example**: `ABC123xyz...` (long random string)

### 2. VERCEL_ORG_ID
- **Name**: `VERCEL_ORG_ID`
- **Description**: Your Vercel organization/team ID
- **How to get it**:
  - **Method 1** (CLI - Easiest):
    ```bash
    vercel link
    cat .vercel/project.json
    ```
    Look for `"orgId"`

  - **Method 2** (Dashboard):
    1. Go to https://vercel.com/account
    2. Your Team ID is displayed
- **Example**: `team_abc123xyz` or `prj_abc123xyz`

### 3. VERCEL_PROJECT_ID
- **Name**: `VERCEL_PROJECT_ID`
- **Description**: Your specific project ID on Vercel
- **How to get it**:
  - **Method 1** (CLI - Easiest):
    ```bash
    vercel link
    cat .vercel/project.json
    ```
    Look for `"projectId"`

  - **Method 2** (Dashboard):
    1. Go to your project on Vercel
    2. Click **Settings**
    3. Scroll to **Project ID**
- **Example**: `prj_abc123xyz456`

---

## Optional Secrets (Recommended)

### 4. VITE_API_URL (Optional but recommended)
- **Name**: `VITE_API_URL`
- **Description**: Your backend API URL
- **Value**: Your API endpoint
- **Example**: `https://api.yourbackend.com` or `http://127.0.0.1:5000`
- **Note**: Can also be set in Vercel dashboard instead

---

## Quick Setup Commands

```bash
# 1. Install Vercel CLI (if not already)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Link your project (creates .vercel folder)
vercel link

# 4. View your credentials
cat .vercel/project.json
```

You'll see output like:
```json
{
  "orgId": "team_abc123xyz",
  "projectId": "prj_abc123xyz456"
}
```

---

## Adding Secrets to GitHub

### Via GitHub Web Interface:

1. **Navigate to**: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`

2. **Click**: "New repository secret"

3. **Add each secret**:
   ```
   Name: VERCEL_TOKEN
   Value: [paste your token]
   ```

   ```
   Name: VERCEL_ORG_ID
   Value: [paste org ID]
   ```

   ```
   Name: VERCEL_PROJECT_ID
   Value: [paste project ID]
   ```

---

## Verification Checklist

After adding secrets, verify:

- [ ] `VERCEL_TOKEN` added (from https://vercel.com/account/tokens)
- [ ] `VERCEL_ORG_ID` added (from `.vercel/project.json` or dashboard)
- [ ] `VERCEL_PROJECT_ID` added (from `.vercel/project.json` or dashboard)
- [ ] Secrets are visible in GitHub Settings → Secrets and variables → Actions
- [ ] Ready to push to trigger deployment!

---

## Test Your Setup

```bash
# Push to main branch to trigger deployment
git add .
git commit -m "Setup Vercel deployment"
git push origin main

# Check GitHub Actions tab to see workflow running
# Check Vercel dashboard to see deployment
```

---

## Troubleshooting

### "Invalid token" error
- Token expired or incorrect
- Create a new token at https://vercel.com/account/tokens
- Update `VERCEL_TOKEN` secret in GitHub

### "Project not found" error
- `VERCEL_PROJECT_ID` is incorrect
- Run `vercel link` and check `.vercel/project.json`
- Update `VERCEL_PROJECT_ID` in GitHub secrets

### "Organization not found" error
- `VERCEL_ORG_ID` is incorrect
- Check `.vercel/project.json` or Vercel dashboard
- Update `VERCEL_ORG_ID` in GitHub secrets

---

## Security Notes

- ⚠️ **Never commit** `.vercel/` folder to Git (already in .gitignore)
- ⚠️ **Never share** your `VERCEL_TOKEN`
- ✅ Tokens can be regenerated if compromised
- ✅ Use separate tokens for different purposes
- ✅ GitHub secrets are encrypted and secure

---

## Next Steps

After adding secrets:
1. Push to `main` branch → Triggers production deployment
2. Create a PR → Triggers preview deployment
3. Monitor in **GitHub Actions** tab
4. View deployment in **Vercel Dashboard**

For detailed setup instructions, see [VERCEL-SETUP.md](VERCEL-SETUP.md)
