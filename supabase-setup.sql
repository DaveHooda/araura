-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  notification_preferences JSONB DEFAULT '{"email_alerts": true, "alert_min_kp": 5}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create curated aurora viewing locations table (read-only, admin-seeded)
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  tier INTEGER CHECK (tier IN (1, 2, 3)) DEFAULT 1,
  bortle_scale INTEGER CHECK (bortle_scale BETWEEN 1 AND 9),
  accessibility TEXT CHECK (accessibility IN ('easy', 'moderate', 'difficult')) DEFAULT 'easy',
  amenities JSONB DEFAULT '{}',
  best_months INTEGER[] DEFAULT ARRAY[9, 10, 11, 12, 1, 2, 3, 4],
  nearby_city TEXT,
  nearby_airport TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user saved locations table
CREATE TABLE saved_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  location_id UUID REFERENCES locations ON DELETE CASCADE NOT NULL,
  notes TEXT,
  alert_enabled BOOLEAN DEFAULT false,
  alert_min_kp INTEGER DEFAULT 5 CHECK (alert_min_kp BETWEEN 0 AND 9),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, location_id)
);

-- Indexes for performance
CREATE INDEX idx_locations_country ON locations(country);
CREATE INDEX idx_locations_tier ON locations(tier);
CREATE INDEX idx_locations_lat_lng ON locations(latitude, longitude);
CREATE INDEX idx_saved_locations_user ON saved_locations(user_id);
CREATE INDEX idx_saved_locations_alerts ON saved_locations(alert_enabled) WHERE alert_enabled = true;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for locations (read-only for all authenticated users)
CREATE POLICY "Anyone can view locations" ON locations
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Public can view locations" ON locations
  FOR SELECT TO anon USING (true);

-- RLS Policies for saved_locations
CREATE POLICY "Users can view own saved locations" ON saved_locations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved locations" ON saved_locations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved locations" ON saved_locations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved locations" ON saved_locations
  FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_locations_updated_at BEFORE UPDATE ON saved_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
