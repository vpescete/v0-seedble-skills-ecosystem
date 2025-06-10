-- Insert sample projects
INSERT INTO public.projects (id, name, description, start_date, status)
VALUES 
  (uuid_generate_v4(), 'E-commerce Platform Redesign', 'Complete redesign of the company e-commerce platform', '2024-10-01', 'active'),
  (uuid_generate_v4(), 'Mobile App UX Research', 'User experience research for the new mobile application', '2024-11-01', 'active'),
  (uuid_generate_v4(), 'Digital Transformation Initiative', 'Company-wide digital transformation project', '2024-09-15', 'completed'),
  (uuid_generate_v4(), 'ML Model Implementation', 'Implementation of machine learning models for data analysis', '2024-11-15', 'active');

-- Insert sample profiles (these will be created when users sign up, but we can add some for testing)
-- Note: You'll need to replace these UUIDs with actual user IDs from your auth.users table
-- For now, this is just to show the structure

-- Insert sample peer reviews (you'll need to update the user IDs)
-- This is commented out because we need real user IDs
/*
INSERT INTO public.peer_reviews (reviewer_id, reviewee_id, project_id, status, created_at)
SELECT 
  (SELECT id FROM auth.users LIMIT 1 OFFSET 0) as reviewer_id,
  (SELECT id FROM auth.users LIMIT 1 OFFSET 1) as reviewee_id,
  (SELECT id FROM public.projects WHERE name = 'E-commerce Platform Redesign') as project_id,
  'pending' as status,
  NOW() - INTERVAL '2 days' as created_at;
*/
