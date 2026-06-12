# Security Checklist

## Before Pushing to Git

### ✅ Files to NEVER Commit
- [ ] `.env.local` - Contains all your secrets (IGNORED by .gitignore)
- [ ] `.env` - Any local environment files (IGNORED by .gitignore)
- [ ] `node_modules/` - Dependencies (IGNORED by .gitignore)
- [ ] `.next/` - Build files (IGNORED by .gitignore)

### ✅ Files You SHOULD Commit
- [x] `.env.example` - Template without real values
- [x] `.gitignore` - Properly configured
- [x] `README.md` - Documentation
- [x] All source code in `src/`
- [x] `package.json` and `package-lock.json`
- [x] Configuration files (next.config.ts, tailwind.config.ts, etc.)

## Environment Variables Security

Your `.env.local` contains sensitive data:
```
❌ MONGODB_URI - Database connection string with credentials
❌ JWT_SECRET - Authentication secret key
❌ CLOUDINARY_API_SECRET - Image upload credentials
❌ RESEND_API_KEY - Email service key
```

**These are already protected by .gitignore!**

## Security Best Practices Implemented

### 🔒 Authentication & Authorization
- ✅ JWT tokens with secure secret
- ✅ HTTP-only cookies (prevents XSS attacks)
- ✅ Password hashing with bcryptjs
- ✅ Token expiration (7 days default)

### 🔒 Input Validation
- ✅ Frontend validation (blocks invalid input)
- ✅ Backend validation (double check)
- ✅ Email format validation
- ✅ Phone number format (+91 prefix)
- ✅ Name length limits (5-20 chars)
- ✅ Password length (exactly 5 chars)

### 🔒 Database Security
- ✅ Mongoose schema validation
- ✅ MongoDB connection with authentication
- ✅ No SQL injection vulnerabilities
- ✅ Indexed queries for performance

### 🔒 API Security
- ✅ Protected routes with auth guards
- ✅ Role-based access (patient/doctor)
- ✅ Error messages don't leak sensitive info
- ✅ CORS configured properly

### 🔒 File Upload Security
- ✅ Cloudinary integration (secure CDN)
- ✅ File type validation (images only)
- ✅ Size limits enforced
- ✅ No local file storage

## What Gets Pushed to Git

### ✅ SAFE - These will be pushed:
```
src/                    # All source code (no secrets)
public/                 # Static assets
.gitignore             # Ignore rules
.env.example           # Template (no real values)
README.md              # Documentation
SECURITY.md            # This file
package.json           # Dependencies list
next.config.ts         # Next.js config
tailwind.config.ts     # Tailwind config
tsconfig.json          # TypeScript config
eslint.config.mjs      # Linter config
postcss.config.mjs     # PostCSS config
```

### ❌ PROTECTED - These will NOT be pushed:
```
.env.local             # Your actual secrets
.env                   # Any environment files
node_modules/          # Dependencies (reinstall with npm install)
.next/                 # Build output
.DS_Store              # Mac system files
*.log                  # Log files
.vscode/               # Editor settings
.idea/                 # IDE settings
```

## Before First Push

Run these checks:

1. **Verify .gitignore**
```bash
cat .gitignore
```
Should include `.env*` pattern

2. **Check for secrets in code**
```bash
grep -r "mongodb+srv://" src/
grep -r "MONGODB_URI" src/
grep -r "JWT_SECRET" src/
```
Should return NO results in src/ code

3. **Initialize git (if not done)**
```bash
git init
```

4. **Check what will be committed**
```bash
git add .
git status
```
Ensure .env.local is NOT listed

5. **Safe to push**
```bash
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

## After Pushing to Git

### For Team Members / Deployment

1. Clone the repository
```bash
git clone <repo-url>
cd hospital-appointment
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local` from template
```bash
cp .env.example .env.local
```

4. Add real credentials to `.env.local`

5. Run the application
```bash
npm run dev
```

## Emergency - If You Accidentally Commit Secrets

If you accidentally commit `.env.local`:

1. **IMMEDIATELY** change all passwords/keys:
   - Generate new JWT_SECRET
   - Rotate MongoDB password
   - Regenerate Cloudinary API keys
   - Regenerate Resend API key

2. **Remove from git history**:
```bash
git rm --cached .env.local
git commit -m "Remove sensitive file"
git push --force
```

3. **Update .gitignore** (already done in this project)

## Production Deployment Checklist

When deploying to Vercel/Railway/Render:

- [ ] Add all environment variables in hosting dashboard
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Verify MongoDB allows connections from host
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS (usually automatic)
- [ ] Configure domain (optional)
- [ ] Test all features after deployment

## Monitoring & Maintenance

- [ ] Regularly update dependencies (`npm update`)
- [ ] Monitor MongoDB usage and limits
- [ ] Check Cloudinary storage quota
- [ ] Review Resend email sending limits
- [ ] Backup database regularly
- [ ] Review application logs
- [ ] Update secrets periodically

## Contact

For security issues, contact: your-email@example.com

**DO NOT** report security vulnerabilities in public issues.
