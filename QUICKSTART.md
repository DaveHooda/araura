# Araura - Quick Start Guide

## 📋 What You Have

A complete, production-ready aurora viewing finder web app with:

- ✅ Interactive map (Leaflet + CartoDB Dark theme)
- ✅ Light pollution overlay (VIIRS satellite data)
- ✅ Real-time aurora scoring (NOAA Kp index)
- ✅ Weather data (Open-Meteo, completely free)
- ✅ Air quality data (OpenAQ, completely free)
- ✅ User authentication (Supabase)
- ✅ Save favorite locations (read-only, no uploads)
- ✅ Email alerts (conditional, only when chances are good)
- ✅ 30 curated accessible Northern locations
- ✅ 100% free tier compatible

## 🚀 Get Started in 3 Steps

### Step 1: Get Your Supabase Keys (5 min)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (free tier)
3. Wait for it to initialize
4. Click **Settings** → **API**
5. Copy these 3 values:
    - `Project URL`
    - `anon public` (labeled as `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
    - `service_role secret` (labeled as `SUPABASE_SERVICE_ROLE_KEY`)

### Step 2: Run the SQL Setup (2 min)

In your Supabase project:

1. Click **SQL Editor** in the left sidebar
2. Click **New query** button
3. Open `supabase-setup.sql` from the project folder
4. Copy all the SQL code
5. Paste into the Supabase SQL editor
6. Click **Run** button
7. Wait for "Query executed successfully"
8. Repeat **Steps 2-7** for `seed-locations.sql`

Your database is now ready!

### Step 3: Configure and Run (3 min)

```bash
cd /Users/davehooda/Desktop/Code/araura

# Edit the .env.local file with your keys
# Copy these values from Step 1:
# NEXT_PUBLIC_SUPABASE_URL=your-url-from-step-1
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-step-1
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-step-1

# Generate a random secret for alerts:
openssl rand -base64 32
# Copy the output to CRON_SECRET in .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 🧪 Test It

1. **See the map** - You should see 30 locations marked on the map
2. **Sign up** - Click "Sign Up", enter email + password
3. **Save a location** - Click "Save" on any location in the sidebar
4. **View favorites** - Click "Favorites" in the header
5. **Sign out** - Click "Sign Out"

## 📧 Optional: Set Up Email Alerts

To get email notifications when aurora conditions are good:

1. Go to [resend.com](https://resend.com)
2. Create a free account
3. Create an API key
4. Add to `.env.local`:
    ```
    RESEND_API_KEY=re_your_key_here
    ```

When deployed to Vercel, alerts will run automatically every hour.

## 📱 What Each Part Does

### Map View

- **Green markers** = Tier 1 (Premium locations)
- **Blue markers** = Tier 2 (Good locations)
- **Orange markers** = Tier 3 (Moderate locations)
- **Light pollution heatmap** = Red = light, Blue = dark
- Click any marker to see details

### Scoring Algorithm

Combines 6 factors to score each location 0-100:

| Factor               | Weight | Example                        |
| -------------------- | ------ | ------------------------------ |
| Latitude             | 25%    | 65-72°N is optimal             |
| Aurora Activity (Kp) | 25%    | Updated every 30 min from NOAA |
| Cloud Coverage       | 20%    | Clear = best                   |
| Light Pollution      | 15%    | Bortle scale 1-9               |
| Moon Phase           | 10%    | New moon = best                |
| Air Quality          | 5%     | Clear visibility               |

**Score meanings:**

- 80-100: Excellent viewing 🟢
- 65-79: Good viewing 🟡
- 50-64: Moderate viewing 🟠
- 35-49: Poor viewing 🔴
- 0-34: Not visible ⚫

### Email Alerts

Only send when ALL conditions are met:

- Score ≥ 65
- Kp index ≥ 4
- Cloud coverage < 50%

This prevents spam and ensures users only get alerts when there's a real chance.

## 🔧 Troubleshooting

**Map shows "No locations found"**

- Supabase tables not created or seeded
- Check Supabase SQL Editor → Run `SELECT COUNT(*) FROM locations;`
- Should return 30
- If 0, re-run `seed-locations.sql`

**Can't sign in**

- Go to Supabase → Authentication → Users
- Manually click "Confirm" on your user
- Then try signing in

**Dev server won't start**

- Make sure all env vars in `.env.local` are real (not placeholders)
- Delete `.next` folder and restart
- Check `npm --version` is 20+

## 📚 Full Documentation

See `SETUP.md` for:

- Deployment to Vercel
- Cron job setup for alerts
- Scaling beyond free tiers
- Adding more locations
- Customizing scoring weights
- API documentation

## 💚 You're All Set!

Your aurora viewing finder is ready to help people find the Northern Lights.

**Next ideas:**

- Add community sighting photos
- Show 3-day aurora forecast
- Mobile app with React Native
- Historical aurora database

---

Questions? Check the issues or reach out! 🌌
