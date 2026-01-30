# Setup Guide - Araura Aurora Viewing Finder

## Prerequisites

1. **Supabase Account** (Free tier)
    - Visit [supabase.com](https://supabase.com)
    - Create new organization and project
    - Choose free tier
    - Region: Closest to you

2. **Resend Account** (Free tier)
    - Visit [resend.com](https://resend.com)
    - Sign up with email
    - Create API key for email alerts

## Step 1: Configure Environment Variables

### Get Supabase Keys

1. Go to your Supabase project dashboard
2. Click **Settings** (gear icon) in left sidebar
3. Click **API** under **Configuration**
4. Copy these values:
    - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
    - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

### Get Resend API Key

1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Create new API key
3. Copy the key → `RESEND_API_KEY`

### Generate CRON_SECRET

```bash
# Generate a secure random string
openssl rand -base64 32
```

Copy output → `CRON_SECRET`

### Update .env.local

Edit `/Users/davehooda/Desktop/Code/araura/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
RESEND_API_KEY=re_your-resend-key-here
CRON_SECRET=your-generated-secret-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 2: Run Database Setup Scripts

### Option A: Using Supabase CLI

```bash
# Install Supabase CLI (if not already installed)
brew install supabase/tap/supabase

# Link your project
supabase link

# Run the schema setup
supabase db push
```

### Option B: Manual SQL (Easier)

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in left sidebar
3. Click **New query**
4. Copy entire contents of `supabase-setup.sql`
5. Paste into the SQL editor
6. Click **Run**
7. Wait for success message

**Repeat for seed data:**

1. Click **New query** again
2. Copy entire contents of `seed-locations.sql`
3. Paste into the SQL editor
4. Click **Run**

This creates all tables, indexes, policies, and populates 30 accessible Northern locations.

## Step 3: Verify Setup

### Start Dev Server

```bash
cd /Users/davehooda/Desktop/Code/araura
npm run dev
```

Expected output:

```
▲ Next.js 16.1.4
- Local:         http://localhost:3000
✓ Ready in Xms
```

### Test the App

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see:
    - Map with CartoDB Dark theme and light pollution overlay
    - 30 locations as green/blue/orange markers
    - Sidebar with location list and Kp status
    - Sign In / Sign Up buttons (top right)

### Test Authentication

1. Click **Sign Up**
2. Enter email and password
3. Should see "Check your email to confirm and sign in" message
4. Go to Supabase → Authentication → Users to confirm user was created
5. Click **Sign In**
6. Use same email/password
7. Should redirect to home page
8. Now see **Favorites** and **Sign Out** buttons

### Test Saving Locations

1. While logged in, click **Save** button on any location
2. Button should change to green **Saved**
3. Click **Favorites** in header
4. Should see your saved location listed
5. Click **Remove** to delete

## Step 4: Set Up Cron Alerts (Vercel Deployment)

After deploying to Vercel, set up cron job to check aurora conditions hourly.

### Create vercel.json

File: `vercel.json`

```json
{
    "crons": [
        {
            "path": "/api/alerts/run",
            "schedule": "0 * * * *"
        }
    ]
}
```

This runs `/api/alerts/run` every hour at the top of the hour.

### Add CRON_SECRET to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Select your Araura project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
    - Name: `CRON_SECRET`
    - Value: (same value from `.env.local`)
    - Select **Production** and **Preview**
5. Redeploy

Vercel will automatically call `/api/alerts/run` with:

```
Authorization: Bearer <CRON_SECRET>
```

### How Alerts Work

The cron job:

1. Runs every hour
2. Fetches current NOAA Kp index
3. For each user with alerts enabled:
    - Fetches weather, air quality, light pollution for their saved locations
    - Calculates viewing score
    - Only sends email if:
        - Score ≥ 65 (good or excellent)
        - Kp ≥ 4 (moderate activity)
        - Clouds < 50%
    - Respects user's minimum Kp preference

This prevents alert spam and ensures users only get notified when there's a real chance to see aurora.

## Deployment (Vercel)

### Prerequisites

- Git repository with all code pushed
- GitHub, GitLab, or Bitbucket account

### Deploy Steps

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New...** → **Project**
3. Import your Git repository
4. Select Framework: **Next.js**
5. Add Environment Variables:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `RESEND_API_KEY`
    - `CRON_SECRET`
6. Click **Deploy**

Your site will be live in ~60 seconds at `your-project.vercel.app`

## Troubleshooting

### "No locations found" message on home page

**Solution:** SQL scripts didn't run successfully

- Go to Supabase SQL Editor
- Run `SELECT COUNT(*) FROM locations;`
- Should return 30
- If 0, re-run `seed-locations.sql`

### "Failed to fetch aurora data" in browser console

**Solution:** NOAA API temporarily down or connection issue

- Try refreshing page
- NOAA is usually reliable, may be brief outage
- Check [status.noaa.gov](https://status.noaa.gov)

### Sign up works but can't sign in

**Solution:** Email confirmation needed

- Go to Supabase → Authentication → Users
- Manually confirm user (click user, set `Email Confirmed` to true)
- Or check email for confirmation link

### Alerts not sending

**Solution:** Check several things

1. CRON_SECRET is correct in Vercel environment
2. RESEND_API_KEY is valid and not expired
3. Go to Resend dashboard → Emails to see sending history
4. Check Vercel Cron logs in project settings

### Map not showing light pollution overlay

**Solution:** Tile service may be down temporarily

- Overlay is optional; map still functions without it
- Check [lightpollutionmap.info](https://lightpollutionmap.info)
- Try refreshing after a few minutes

## Next Steps

1. **Customize locations**: Add more locations to `seed-locations.sql`
2. **Adjust scoring**: Edit weights in `lib/scoring.ts`
3. **Add features**: Community sightings, photos, analytics
4. **Mobile app**: Build React Native version using same backend

## Support

- **Supabase docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Resend docs**: [resend.com/docs](https://resend.com/docs)
- **Issues**: Check GitHub issues or reach out to maintainers

---

Built with 💚 for aurora chasers
