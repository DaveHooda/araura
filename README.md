# Araura - Aurora Viewing Location Finder

A Next.js web application that helps users find the best locations to view Northern Lights (Aurora Borealis) by analyzing real-time data from multiple sources:

- **Aurora Activity**: NOAA Space Weather Prediction Center Kp index
- **Cloud Coverage**: Open-Meteo weather data
- **Air Quality**: OpenAQ global air quality index
- **Light Pollution**: Light pollution map overlay
- **Accessibility**: Curated locations with infrastructure

## Features

- 🗺️ **Interactive Dark Map**: Leaflet.js with CartoDB Dark Matter theme and light pollution overlay
- 🌌 **30 Curated Northern Locations**: Accessible sites across Alaska, Canada, Iceland, Scandinavia
- 📊 **Real-Time Aurora Scoring**: Weighted algorithm combining all 5 data sources
- 👤 **User Authentication**: Save favorite locations with Supabase Auth
- 📧 **Smart Alerts**: Email notifications only when viewing conditions are actually good (Kp 4+, <50% clouds)
- 💯 **100% Free Stack**: No API costs for development and early growth

## Tech Stack

### Frontend

- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **Leaflet.js** + **react-leaflet** for interactive maps
- **CartoDB Dark Matter** tiles (free, night-friendly)

### Backend

- **Supabase** (PostgreSQL + Authentication)
- **Next.js API Routes** for serverless functions

### Data Sources (All Free)

- **NOAA SWPC**: Aurora Kp index and forecasts
- **Open-Meteo**: Cloud coverage and weather data
- **OpenAQ**: Global air quality index
- **Light Pollution Map**: Satellite-based light pollution overlay

## Aurora Scoring Algorithm

The app uses a weighted scoring system optimized for Northern hemisphere viewing:

| Factor              | Weight | Description                     |
| ------------------- | ------ | ------------------------------- |
| **Latitude**        | 25%    | 65-72°N = optimal (aurora oval) |
| **Kp Index**        | 25%    | Aurora activity level (0-9)     |
| **Clouds**          | 20%    | Clear skies critical            |
| **Light Pollution** | 15%    | Bortle scale darkness           |
| **Moon Phase**      | 10%    | New moon = best                 |
| **Air Quality**     | 5%     | Visibility/clarity              |

**Score Ranges:**

- **80-100**: Excellent viewing
- **65-79**: Good viewing
- **50-64**: Moderate viewing
- **35-49**: Poor viewing
- **0-34**: Not visible

## Email Alerts

Alerts are only sent when conditions warrant it:

- Score ≥ 65 (good or excellent)
- Kp index ≥ 4 (moderate to strong activity)
- Cloud coverage < 50%

This prevents spam and ensures users only get notified when there's a real chance to see aurora.

## License

MIT
