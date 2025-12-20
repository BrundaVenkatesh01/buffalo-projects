# 🚀 Buffalo Projects - Deployment Guide

## Quick Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy to Vercel
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - What's your project name? buffalo-projects
# - In which directory? ./
# - Want to override settings? N
```

## Quick Deploy to Netlify

# Option 1: CLI

npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist

# Option 2: Drag & Drop

# 1. Run: npm run build

# 2. Go to: https://app.netlify.com/drop

# 3. Drag the 'dist' folder to the browser

````

## Environment Variables (Optional)

Create these in your hosting dashboard if you want enhanced features:

```env
VITE_GEMINI_API_KEY=your_key_here     # For AI features
VITE_ANALYTICS_ID=your_id_here        # For analytics
````

## Pre-Deployment Checklist

✅ **Code Quality**

- No console.log statements in production
- No hardcoded API keys
- Build completes without errors

✅ **Features Working**

- Code generation (BUF-XXXX)
- Workspace tools (Canvas, MVP Planner, etc.)
- Public project gallery
- Teacher monitoring portal
- Resource directory

✅ **Performance**

- Bundle size optimized
- Lazy loading implemented
- LocalStorage for data persistence

## Post-Deployment Testing

1. **Test Core Flow:**
   - Visit homepage
   - Click "Start Project"
   - Create new workspace
   - Verify code generation (BUF-XXXX)
   - Add content to Business Model Canvas
   - Save and reload page (data persists)

2. **Test Public Features:**
   - Navigate to /projects
   - View public projects
   - Test search and filters

3. **Test Teacher Portal:**
   - Go to /teacher
   - Enter demo code: TEACH-DEMO

4. **Test Resources:**
   - Navigate to /resources
   - Verify Buffalo resources load

## Custom Domain Setup

### Vercel

```
Domain Settings → Add Domain → Enter your domain
```

### Netlify

```
Domain Management → Add Custom Domain → Enter your domain
```

## Monitoring

After deployment, monitor:

- Page load times (should be < 3s)
- Error rates (should be 0)
- User engagement metrics

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify environment variables are set
3. Clear browser cache and localStorage
4. Check network tab for failed requests

---

**Ready to go live! 🎉**

Your Buffalo entrepreneurial platform is production-ready and can be deployed in under 5 minutes.
