-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- Create custom types
CREATE TYPE user_role AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE project_status AS ENUM ('draft', 'active', 'completed', 'archived');
CREATE TYPE deployment_status AS ENUM ('deploying', 'deployed', 'failed', 'paused');
CREATE TYPE integration_status AS ENUM ('connected', 'disconnected', 'error');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'free',
  credits INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User statistics
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  total_images INTEGER DEFAULT 0,
  total_code INTEGER DEFAULT 0,
  daily_tasks_completed INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  framework TEXT NOT NULL,
  status project_status DEFAULT 'draft',
  image_url TEXT,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges (tracks which badges users have earned)
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  badge_id TEXT NOT NULL,
  earned BOOLEAN DEFAULT FALSE,
  earned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Daily tasks tracking
CREATE TABLE daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  task_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, task_id, date)
);

-- Tool usage tracking
CREATE TABLE tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  tool_id TEXT NOT NULL,
  credits_used INTEGER NOT NULL,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deployments
CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  url TEXT,
  status deployment_status DEFAULT 'deploying',
  build_time TEXT,
  auto_deploy BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integrations
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  service TEXT NOT NULL,
  status integration_status DEFAULT 'disconnected',
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, service)
);

-- Create indexes for better performance
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_daily_tasks_user_id ON daily_tasks(user_id);
CREATE INDEX idx_daily_tasks_date ON daily_tasks(date);
CREATE INDEX idx_tool_usage_user_id ON tool_usage(user_id);
CREATE INDEX idx_tool_usage_tool_id ON tool_usage(tool_id);
CREATE INDEX idx_deployments_user_id ON deployments(user_id);
CREATE INDEX idx_deployments_project_id ON deployments(project_id);
CREATE INDEX idx_integrations_user_id ON integrations(user_id);

-- Row Level Security Policies

-- Users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- User stats
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own stats" ON user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- User badges
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own badges" ON user_badges FOR UPDATE USING (auth.uid() = user_id);

-- Daily tasks
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tasks" ON daily_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON daily_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON daily_tasks FOR UPDATE USING (auth.uid() = user_id);

-- Tool usage
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tool usage" ON tool_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tool usage" ON tool_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Deployments
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own deployments" ON deployments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own deployments" ON deployments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own deployments" ON deployments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own deployments" ON deployments FOR DELETE USING (auth.uid() = user_id);

-- Integrations
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own integrations" ON integrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own integrations" ON integrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own integrations" ON integrations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own integrations" ON integrations FOR DELETE USING (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deployments_updated_at BEFORE UPDATE ON deployments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to calculate user level based on XP
CREATE OR REPLACE FUNCTION calculate_user_level(xp_amount INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level formula: level = floor(xp / 1000) + 1, max level 50
  RETURN LEAST(FLOOR(xp_amount / 1000.0) + 1, 50);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to add XP and update level
CREATE OR REPLACE FUNCTION add_user_xp(user_uuid UUID, xp_to_add INTEGER)
RETURNS VOID AS $$
DECLARE
  new_xp INTEGER;
  new_level INTEGER;
BEGIN
  UPDATE user_stats 
  SET xp = xp + xp_to_add
  WHERE user_id = user_uuid
  RETURNING xp INTO new_xp;
  
  new_level := calculate_user_level(new_xp);
  
  UPDATE user_stats
  SET level = new_level
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete daily task
CREATE OR REPLACE FUNCTION complete_daily_task(user_uuid UUID, task_uuid TEXT, xp_reward INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  task_exists BOOLEAN;
BEGIN
  -- Check if task already completed today
  SELECT EXISTS(
    SELECT 1 FROM daily_tasks 
    WHERE user_id = user_uuid 
    AND task_id = task_uuid 
    AND date = CURRENT_DATE 
    AND completed = TRUE
  ) INTO task_exists;
  
  IF task_exists THEN
    RETURN FALSE;
  END IF;
  
  -- Insert or update daily task
  INSERT INTO daily_tasks (user_id, task_id, completed, completed_at, date)
  VALUES (user_uuid, task_uuid, TRUE, NOW(), CURRENT_DATE)
  ON CONFLICT (user_id, task_id, date) 
  DO UPDATE SET completed = TRUE, completed_at = NOW();
  
  -- Add XP reward
  PERFORM add_user_xp(user_uuid, xp_reward);
  
  -- Update daily tasks completed count
  UPDATE user_stats 
  SET daily_tasks_completed = daily_tasks_completed + 1
  WHERE user_id = user_uuid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to use tool credits
CREATE OR REPLACE FUNCTION use_tool_credits(user_uuid UUID, tool_id_param TEXT, credits_needed INTEGER, tool_config JSONB DEFAULT '{}')
RETURNS BOOLEAN AS $$
DECLARE
  user_credits INTEGER;
BEGIN
  -- Get user's current credits
  SELECT credits INTO user_credits FROM users WHERE id = user_uuid;
  
  IF user_credits < credits_needed THEN
    RETURN FALSE;
  END IF;
  
  -- Deduct credits
  UPDATE users SET credits = credits - credits_needed WHERE id = user_uuid;
  
  -- Log tool usage
  INSERT INTO tool_usage (user_id, tool_id, credits_used, config)
  VALUES (user_uuid, tool_id_param, credits_needed, tool_config);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;