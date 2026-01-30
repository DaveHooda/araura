# Araura - Documentation Index

## Start Here 👇

### 🚀 New to the project?

1. Read **[QUICKSTART.md](QUICKSTART.md)** - Get running in 10 minutes
2. Follow the 3-step setup guide
3. Test locally at http://localhost:3000

### 📚 Complete Documentation

- **[PROJECT.md](PROJECT.md)** - Technical architecture & decisions
- **[SETUP.md](SETUP.md)** - Full setup + deployment guide
- **[CHECKLIST.md](CHECKLIST.md)** - What's implemented & status
- **[README.md](README.md)** - Project overview

### 💻 Code Structure

```
Frontend:    app/page.tsx + components/
Backend:     app/api/*/route.ts
Database:    supabase-setup.sql + seed-locations.sql
Scoring:     lib/scoring.ts
```

### 🔧 Configuration

- **.env.example** - Copy to .env.local and fill in
- **vercel.json** - Deployment config with cron
- **package.json** - Dependencies (45 packages)
- **tsconfig.json** - TypeScript strict mode

## Key Features

✅ Interactive dark map (Leaflet + CartoDB)
✅ 30 curated Northern locations
✅ Real-time aurora scoring (6 factors)
✅ User accounts & favorites (Supabase Auth)
✅ Smart email alerts (conditional)
✅ 100% free tier compatible
✅ Production-ready (TypeScript, ESLint)

## Quick Links

| Need                 | File                                     |
| -------------------- | ---------------------------------------- |
| Setup instructions   | [QUICKSTART.md](QUICKSTART.md)           |
| Architecture details | [PROJECT.md](PROJECT.md)                 |
| Deployment steps     | [SETUP.md](SETUP.md)                     |
| What's done          | [CHECKLIST.md](CHECKLIST.md)             |
| API documentation    | [README.md](README.md)                   |
| Database schema      | [supabase-setup.sql](supabase-setup.sql) |
| Location data        | [seed-locations.sql](seed-locations.sql) |
| Scoring algorithm    | [lib/scoring.ts](lib/scoring.ts)         |
| Main page            | [app/page.tsx](app/page.tsx)             |

## Development

```bash
npm install          # Already done
npm run dev         # Start local server
npm run build       # Test production build
```

## Deployment

```bash
# Push to GitHub, import to Vercel
# Add 5 env variables (see SETUP.md)
# Cron alerts run automatically
```

## Support

- See **[SETUP.md](SETUP.md)** troubleshooting section
- Check **[PROJECT.md](PROJECT.md)** for architecture questions
- Review **[CHECKLIST.md](CHECKLIST.md)** for what's implemented

---

**Status**: ✅ Complete & Ready to Deploy

**Cost**: $0/month (up to 5K users)

**Time to Production**: 10-15 minutes

🌌 Built for aurora chasers!
