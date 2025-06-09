-- Ensure UUID extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role, department)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url',
    'Developer',
    'Engineering'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert some sample skills if they don't exist
INSERT INTO public.skills (name, category, description) VALUES
  ('JavaScript', 'technical', 'Programming language for web development'),
  ('React', 'technical', 'Frontend library for building user interfaces'),
  ('Node.js', 'technical', 'JavaScript runtime for server-side development'),
  ('Python', 'technical', 'High-level programming language'),
  ('SQL', 'technical', 'Database query language'),
  ('Communication', 'soft', 'Ability to convey information effectively'),
  ('Leadership', 'soft', 'Ability to guide and influence others'),
  ('Problem Solving', 'soft', 'Ability to find solutions to difficult issues'),
  ('Teamwork', 'soft', 'Ability to work effectively with others'),
  ('Agile Methodology', 'process', 'Iterative approach to project management'),
  ('Code Review', 'process', 'Systematic examination of code'),
  ('Design Thinking', 'process', 'Problem-solving approach focused on users')
ON CONFLICT (name) DO NOTHING;

-- Insert sample knowledge circles if they don't exist
INSERT INTO public.knowledge_circles (name, description, category, icon, color) VALUES
  ('AI & Machine Learning', 'Exploring latest trends in artificial intelligence and ML applications', 'Technical', 'Brain', 'bg-purple-500'),
  ('Frontend Development', 'Modern web development practices and frameworks', 'Technical', 'Code', 'bg-blue-500'),
  ('Leadership & Management', 'Developing leadership skills and management techniques', 'Soft Skills', 'Target', 'bg-green-500'),
  ('DevOps & Infrastructure', 'Cloud computing, CI/CD, and infrastructure management', 'Technical', 'Server', 'bg-orange-500')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON public.user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_peer_reviews_reviewer_id ON public.peer_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_peer_reviews_reviewee_id ON public.peer_reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON public.project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON public.project_members(project_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
