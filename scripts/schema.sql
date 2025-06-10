-- Create schema for Seedble Skills Ecosystem

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT,
  department TEXT,
  experience_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Skills master table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('technical', 'soft', 'process')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User skills mapping
CREATE TABLE IF NOT EXISTS public.user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 5),
  interest INTEGER NOT NULL CHECK (interest BETWEEN 1 AND 5),
  is_priority BOOLEAN DEFAULT false,
  last_assessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, skill_id)
);

-- Assessment history
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('complete', 'quick', 'role-specific')),
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed')),
  skills_evaluated INTEGER,
  completion_time INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Project members
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, user_id)
);

-- Peer reviews
CREATE TABLE IF NOT EXISTS public.peer_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'validated', 'flagged')),
  technical_score NUMERIC(3,2),
  soft_score NUMERIC(3,2),
  process_score NUMERIC(3,2),
  innovation_score NUMERIC(3,2),
  overall_score NUMERIC(3,2),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  validated_at TIMESTAMP WITH TIME ZONE
);

-- Review details (individual skill ratings)
CREATE TABLE IF NOT EXISTS public.review_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID REFERENCES public.peer_reviews(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge circles
CREATE TABLE IF NOT EXISTS public.knowledge_circles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Knowledge circle members
CREATE TABLE IF NOT EXISTS public.circle_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id UUID REFERENCES public.knowledge_circles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('member', 'leader')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(circle_id, user_id)
);

-- Create RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Policies for skills
CREATE POLICY "Anyone can view skills" 
  ON public.skills FOR SELECT 
  USING (true);

-- Policies for user_skills
CREATE POLICY "Users can view all user skills" 
  ON public.user_skills FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own skills" 
  ON public.user_skills FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills" 
  ON public.user_skills FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policies for assessments
CREATE POLICY "Users can view their own assessments" 
  ON public.assessments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments" 
  ON public.assessments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" 
  ON public.assessments FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policies for peer_reviews
CREATE POLICY "Users can view reviews they're involved in" 
  ON public.peer_reviews FOR SELECT 
  USING (auth.uid() = reviewer_id OR auth.uid() = reviewee_id);

CREATE POLICY "Users can insert reviews they're assigned to" 
  ON public.peer_reviews FOR INSERT 
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can update their own reviews" 
  ON public.peer_reviews FOR UPDATE 
  USING (auth.uid() = reviewer_id);

-- Create functions for real-time updates
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update user_skills when review is completed
CREATE OR REPLACE FUNCTION public.update_skills_from_review() 
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when a review is marked as completed
  IF NEW.status = 'completed' AND (OLD.status != 'completed' OR OLD.status IS NULL) THEN
    -- Update existing skills or insert new ones based on review details
    INSERT INTO public.user_skills (user_id, skill_id, level, interest, last_assessed)
    SELECT 
      NEW.reviewee_id, 
      rd.skill_id, 
      rd.score, 
      COALESCE((SELECT interest FROM public.user_skills WHERE user_id = NEW.reviewee_id AND skill_id = rd.skill_id), 3),
      NOW()
    FROM 
      public.review_details rd
    WHERE 
      rd.review_id = NEW.id
    ON CONFLICT (user_id, skill_id) 
    DO UPDATE SET 
      level = (EXCLUDED.level + user_skills.level) / 2, -- Average the scores
      last_assessed = EXCLUDED.last_assessed;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_peer_review_completed
  AFTER UPDATE ON public.peer_reviews
  FOR EACH ROW EXECUTE PROCEDURE public.update_skills_from_review();

-- Insert some initial data for testing
INSERT INTO public.skills (name, category, description)
VALUES 
  ('JavaScript', 'technical', 'Programming language for web development'),
  ('React', 'technical', 'Frontend library for building user interfaces'),
  ('Node.js', 'technical', 'JavaScript runtime for server-side development'),
  ('Communication', 'soft', 'Ability to convey information effectively'),
  ('Leadership', 'soft', 'Ability to guide and influence others'),
  ('Problem Solving', 'soft', 'Ability to find solutions to difficult issues'),
  ('Agile Methodology', 'process', 'Iterative approach to project management'),
  ('Code Review', 'process', 'Systematic examination of code'),
  ('Design Thinking', 'process', 'Problem-solving approach focused on users');

INSERT INTO public.knowledge_circles (name, description, category, icon, color)
VALUES 
  ('AI & Machine Learning', 'Exploring latest trends in artificial intelligence and ML applications', 'Technical', 'Brain', 'bg-purple-500'),
  ('Frontend Development', 'Modern web development practices and frameworks', 'Technical', 'Code', 'bg-blue-500'),
  ('Leadership & Management', 'Developing leadership skills and management techniques', 'Soft Skills', 'Target', 'bg-green-500');
