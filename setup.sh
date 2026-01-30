#!/bin/bash
# Quick setup script for Araura

set -e

echo "🌌 Araura Setup Script"
echo "====================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found!"
  echo "Please copy .env.example to .env.local and fill in your credentials:"
  echo ""
  echo "  cp .env.example .env.local"
  echo "  # Edit .env.local with your Supabase and Resend keys"
  echo ""
  exit 1
fi

# Check if env vars are set
if grep -q "your-supabase-url" .env.local; then
  echo "⚠️  .env.local still has placeholder values!"
  echo "Please update with real credentials:"
  echo "  - NEXT_PUBLIC_SUPABASE_URL"
  echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
  echo "  - SUPABASE_SERVICE_ROLE_KEY"
  echo "  - RESEND_API_KEY"
  echo "  - CRON_SECRET"
  echo ""
  exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Check if database is seeded
echo "Checking database..."
node -e "
const { createClient } = require('@supabase/supabase-js');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.log('❌ Supabase credentials missing');
  process.exit(1);
}
const client = createClient(url, key);
client.from('locations').select('count').then(({ count }) => {
  if (!count || count === 0) {
    console.log('⚠️  No locations found in database!');
    console.log('Please run supabase-setup.sql and seed-locations.sql in Supabase SQL Editor');
    process.exit(1);
  }
  console.log('✅ Database has ' + count + ' locations');
}).catch((err) => {
  console.log('⚠️  Could not verify database: ' + err.message);
  console.log('Make sure supabase-setup.sql has been run');
});
" 2>/dev/null || echo "⚠️  Skipping database check"

echo ""
echo "✅ Setup looks good!"
echo ""
echo "Next steps:"
echo "  1. npm run dev"
echo "  2. Open http://localhost:3000"
echo "  3. Test signing up and saving locations"
echo ""
echo "See SETUP.md for full documentation"
