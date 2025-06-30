# 🚀 Fresh Supabase Setup Guide

Let's set up Supabase from scratch for your Lody waitlist page!

## Step 1: Create a Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** with your account
3. **Click "New Project"**
4. **Fill in the details:**
   - Organization: Choose your org
   - Name: `lody-waitlist` (or whatever you want)
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to your users
5. **Click "Create new project"**
6. **Wait for it to finish setting up** (takes 1-2 minutes)

## Step 2: Get Your Credentials

1. **In your Supabase dashboard, go to Settings → API**
2. **Copy these two values:**
   - **Project URL** (looks like: `https://abc123.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Create Environment File

1. **In your project root, create a file called `.env`**
2. **Add this content:**

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key_here
```

3. **Replace the placeholder values** with your actual credentials

## Step 4: Configure Authentication

1. **In Supabase dashboard, go to Authentication → Settings**
2. **Under "Site URL" add:** `http://localhost:5173`
3. **Under "Redirect URLs" add:** `http://localhost:5173/**`
4. **Click "Save"**

## Step 5: Test Your Setup

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser to `http://localhost:5173`**
3. **Open browser console (F12)**
4. **You should see:**
   ```
   ✅ Supabase connected successfully!
   🔗 URL: https://your-project.supabase.co
   🔑 Key exists: true
   ```

## Step 6: Create Waitlist Table

1. **In Supabase dashboard, go to SQL Editor**
2. **Run this SQL:**

```sql
-- Create waitlist table
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  target_languages TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for waitlist signups)
CREATE POLICY "Allow public inserts" ON waitlist
FOR INSERT WITH CHECK (true);

-- Allow users to see their own data (if you add user auth later)
CREATE POLICY "Users can view own data" ON waitlist
FOR SELECT USING (auth.uid()::text = email);

-- Create index on email for faster lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);
```

## Step 7: Test Waitlist Functionality

Your app should now be able to:
- ✅ Connect to Supabase
- ✅ Store waitlist entries
- ✅ Handle authentication (if needed)

## Troubleshooting

### ❌ "Missing Supabase environment variables"
- Make sure you created the `.env` file
- Check that the variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after creating `.env`

### ❌ "Invalid API key"
- Make sure you're using the **anon public** key, not the service role key
- Check that your project URL is correct

### ❌ "Site URL not allowed"
- Add `http://localhost:5173` to your Supabase auth settings
- Make sure you're using the correct port (check your dev server output)

## Next Steps

Once this is working, you can:
1. Add user authentication
2. Create admin dashboard
3. Add email notifications
4. Set up analytics

## Need Help?

- Check the browser console for error messages
- Verify your environment variables are loaded
- Make sure your Supabase project is active
- Try the connection test in the console

---

**🎉 You're all set! Your waitlist page should now work with Supabase!** 