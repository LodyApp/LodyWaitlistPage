# Deployment Guide for thelodyapp.com

This guide will help you configure your Supabase authentication for your production website.

## 🚀 Quick Setup for Production

### Step 1: Update Supabase Settings

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (`dwzymbjpvnpqhebhquhht`)
3. Go to **Authentication** → **Settings**
4. Update the following:

   **Site URL:**
   ```
   https://thelodyapp.com
   ```

   **Redirect URLs:**
   ```
   https://thelodyapp.com/**
   https://thelodyapp.com
   ```

5. Click **Save**

### Step 2: Configure Environment Variables on Your Hosting Platform

Choose your hosting platform below:

## 📦 Vercel Deployment

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

   ```
   Name: VITE_SUPABASE_URL
   Value: https://dwzymbjpvnpqhebhquhht.supabase.co
   Environment: Production, Preview, Development
   ```

   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3enltYmpwdm5wcWhlYnF1aGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNzk5MjYsImV4cCI6MjA2NjY1NTkyNn0.ORGTMrulkyDLkYKl7Vqrn8_aAJ_lAT5yFYSJLYb_nX8
   Environment: Production, Preview, Development
   ```

5. Click **Save**
6. Redeploy your project

## 🌐 Netlify Deployment

1. Go to your [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add these variables:

   ```
   Key: VITE_SUPABASE_URL
   Value: https://dwzymbjpvnpqhebhquhht.supabase.co
   Scope: All scopes
   ```

   ```
   Key: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3enltYmpwdm5wcWhlYnF1aGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNzk5MjYsImV4cCI6MjA2NjY1NTkyNn0.ORGTMrulkyDLkYKl7Vqrn8_aAJ_lAT5yFYSJLYb_nX8
   Scope: All scopes
   ```

5. Click **Save**
6. Trigger a new deployment

## ☁️ Other Hosting Platforms

### GitHub Pages
- Environment variables aren't directly supported
- Consider using Vercel or Netlify instead

### AWS Amplify
1. Go to your Amplify Console
2. **App settings** → **Environment variables**
3. Add the same variables as above

### Firebase Hosting
- Environment variables aren't directly supported
- Consider using Vercel or Netlify instead

## 🔍 Testing Your Production Setup

1. **Deploy your changes**
2. **Visit**: `https://thelodyapp.com`
3. **Test authentication**:
   - Try creating a new account
   - Try signing in
   - Check if logout works
   - Verify protected routes work

## 🛠️ Troubleshooting

### Common Issues:

1. **"Invalid API key" error**:
   - Double-check your environment variables are set correctly
   - Make sure you're using the `anon public` key, not the `service_role` key

2. **"Site URL not allowed" error**:
   - Verify `https://thelodyapp.com` is added to Supabase Site URL settings
   - Check that redirect URLs include `https://thelodyapp.com/**`

3. **Authentication not working**:
   - Check browser console for errors
   - Verify environment variables are loaded (they should be available in `import.meta.env`)

### Debug Steps:

1. **Check if environment variables are loaded**:
   Add this temporarily to your app to debug:
   ```javascript
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
   ```

2. **Check Supabase logs**:
   - Go to Supabase Dashboard → **Logs**
   - Look for authentication-related errors

## 🔒 Security Reminders

- ✅ **Use anon public key** for client-side code
- ❌ **Never use service_role key** in the browser
- ✅ **Environment variables are secure** when properly configured
- ✅ **HTTPS is required** for production authentication

## 📞 Need Help?

If you're still having issues:
1. Check your hosting platform's documentation
2. Review Supabase authentication docs
3. Check browser console for specific error messages 