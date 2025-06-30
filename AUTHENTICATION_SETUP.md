# Authentication Setup Guide

This guide will help you set up Supabase authentication for your Lody waitlist application.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A Supabase project created

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "lody-waitlist")
5. Enter a database password (save this securely)
6. Choose a region close to your users
7. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. These will look like:
   - URL: `https://your-project-id.supabase.co`
   - Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and replace the placeholder values:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 4: Enable Authentication in Supabase

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add your development URL: `http://localhost:8081`
3. Under **Redirect URLs**, add: `http://localhost:8081/**`
4. Click **Save**

## Step 5: Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link

## Step 6: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:8081`
3. You should see the authentication page
4. Try creating an account and signing in

## Features Included

- **Email/Password Authentication**: Users can sign up and sign in with email and password
- **Protected Routes**: The main page is protected and requires authentication
- **Session Management**: Automatic session persistence and management
- **Logout Functionality**: Users can sign out from the main page
- **Password Reset**: Users can reset their password via email
- **Form Validation**: Client-side validation for all forms
- **Error Handling**: Proper error messages for authentication failures

## Security Features

- Passwords are hashed and stored securely in Supabase
- JWT tokens are used for session management
- Environment variables keep credentials secure
- Protected routes prevent unauthorized access

## Customization

You can customize the authentication flow by:

1. **Modifying the UI**: Edit the components in `src/components/auth/`
2. **Adding OAuth providers**: Configure Google, GitHub, etc. in Supabase dashboard
3. **Custom user metadata**: Store additional user information in the `auth.users` table
4. **Email verification**: Configure email verification requirements

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**: Check that your environment variables are set correctly
2. **"Site URL not allowed"**: Make sure your localhost URL is added to the allowed sites in Supabase
3. **Email not sending**: Check your Supabase project's email settings
4. **Redirect issues**: Verify redirect URLs are configured correctly

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)

## Next Steps

Once authentication is working, you can:

1. Add user profiles and additional user data
2. Implement role-based access control
3. Add social login providers
4. Create user management features
5. Add analytics and user tracking 

## Security Analysis: VITE_ Environment Variables

### ✅ **Safe to Expose (What We're Using)**

The `VITE_` prefix **intentionally exposes** these values to the browser, which is **safe** for:

- **`VITE_SUPABASE_URL`** - This is just your project URL, safe to share
- **`VITE_SUPABASE_ANON_KEY`** - This is the "anon public" key, designed to be used in browsers

### 🛡️ **Why These Are Safe**

1. **Anon Public Key**: 
   - Designed specifically for client-side use
   - Has limited permissions (only what you configure)
   - Cannot bypass Row Level Security (RLS)
   - Cannot access admin functions

2. **Project URL**: 
   - Just a public endpoint
   - No sensitive information
   - Required for the client to connect

### ❌ **What's NOT Safe to Expose**

- **Service Role Key** (the secret one you showed me)
- **Database passwords**
- **API secrets**
- **Admin tokens**

## 🔧 **Best Practices for Supabase Client-Side Security**

### 1. **Enable Row Level Security (RLS)**
```sql
-- Example: Only allow users to see their own data
CREATE POLICY "Users can only see their own data" ON your_table
FOR ALL USING (auth.uid() = user_id);
```

### 2. **Configure Proper Policies**
- Set up RLS policies for all your tables
- Never use `service_role` key in client code
- Always use the `anon` key for browser applications

### 3. **Environment Variable Best Practices**
```env
# ✅ SAFE - These are designed for client-side use
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# ❌ NEVER - These should only be in server-side code
# VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# VITE_DATABASE_PASSWORD=your_password
```

## 🎯 **Your Current Setup is Secure**

Your current configuration is following best practices:

```env
VITE_SUPABASE_URL=https://dwzymbjpvnpqhebhquhht.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are:
- ✅ **Designed for browser use**
- ✅ **Have limited permissions**
- ✅ **Cannot bypass security policies**
- ✅ **Safe to expose publicly**

## 🚀 **Next Steps for Maximum Security**

1. **Enable RLS on your tables** (if you haven't already)
2. **Set up proper policies** for your data
3. **Use the anon key** (which you're already doing)
4. **Never expose the service role key**

Your authentication setup is secure and follows Supabase best practices! The warning you're seeing is just Vite being transparent about what gets exposed to the browser, which is exactly what we want for these specific variables. 