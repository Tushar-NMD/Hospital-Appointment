# Pre-Push Checklist ✅

Run through this checklist before pushing to Git!

## Step 1: Initialize Git Repository
```bash
git init
```

## Step 2: Verify .gitignore
```bash
cat .gitignore | grep ".env"
```
Should show: `.env`, `.env*.local`, etc.

## Step 3: Check Current Files
```bash
git add .
git status
```

### ✅ Should See (SAFE to commit):
- `src/` folder and all files
- `README.md`
- `SECURITY.md`
- `.gitignore`
- `.env.example` (template only)
- `package.json`
- `package-lock.json`
- Config files (next.config.ts, tailwind.config.ts, etc.)

### ❌ Should NOT See (if they appear, DON'T push!):
- `.env.local`
- `.env`
- `node_modules/`
- `.next/`

## Step 4: Remove Sensitive Files (if needed)
If you see `.env.local` or `.env` in git status:
```bash
git rm --cached .env.local
git rm --cached .env
git status
```

## Step 5: First Commit
```bash
git commit -m "Initial commit: Hospital Appointment Management System"
```

## Step 6: Add Remote Repository
```bash
git remote add origin https://github.com/yourusername/your-repo-name.git
```

## Step 7: Push to GitHub
```bash
git branch -M main
git push -u origin main
```

## Step 8: Verify on GitHub
1. Go to your GitHub repository
2. Check that `.env.local` is NOT visible
3. Check that `.env.example` IS visible
4. Verify README.md displays correctly

## Step 9: Add Environment Variables to Deployment

### For Vercel:
1. Go to project settings
2. Navigate to "Environment Variables"
3. Add each variable from your `.env.local`:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`

### For Railway/Render:
Similar process in their respective dashboards

## Quick Commands Summary

```bash
# Initialize git
git init

# Check status
git status

# Add all files (respects .gitignore)
git add .

# Commit
git commit -m "Initial commit"

# Add remote
git remote add origin <your-repo-url>

# Push
git push -u origin main

# View what's ignored
git check-ignore -v .env.local
# Should show: .gitignore:XX:.env*.local    .env.local
```

## Emergency Commands

### If you accidentally committed secrets:
```bash
# Remove from staging
git rm --cached .env.local

# Commit the removal
git commit -m "Remove sensitive files"

# Force push (USE WITH CAUTION!)
git push --force
```

### Then IMMEDIATELY:
1. Change all passwords in MongoDB
2. Regenerate all API keys (Cloudinary, Resend)
3. Create new JWT_SECRET

## Final Verification

After pushing, clone your repo in a different location to test:
```bash
cd ..
git clone <your-repo-url> test-clone
cd test-clone
```

Check:
- [ ] `.env.local` does NOT exist
- [ ] `.env.example` exists
- [ ] Can run `npm install` successfully
- [ ] After creating `.env.local` with real values, app runs with `npm run dev`

## You're Ready! 🚀

If all checks pass, your code is safe to share and deploy!

---

**Remember:** 
- Never commit `.env.local` or `.env`
- Always use `.env.example` as template
- Keep secrets in environment variables
- Rotate keys if accidentally exposed
