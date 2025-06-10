-- Add sample data only (skip schema creation since it already exists)

-- First, let's check if we have any existing projects, if not add some
INSERT INTO public.projects (id, name, description, start_date, status)
SELECT * FROM (
  VALUES 
    (uuid_generate_v4(), 'E-commerce Platform Redesign', 'Complete redesign of the company e-commerce platform', CAST('2024-10-01' AS TIMESTAMP WITH TIME ZONE), 'active'),
    (uuid_generate_v4(), 'Mobile App UX Research', 'User experience research for the new mobile application', CAST('2024-11-01' AS TIMESTAMP WITH TIME ZONE), 'active'),
    (uuid_generate_v4(), 'Digital Transformation Initiative', 'Company-wide digital transformation project', CAST('2024-09-15' AS TIMESTAMP WITH TIME ZONE), 'completed'),
    (uuid_generate_v4(), 'ML Model Implementation', 'Implementation of machine learning models for data analysis', CAST('2024-11-15' AS TIMESTAMP WITH TIME ZONE), 'active'),
    (uuid_generate_v4(), 'Customer Portal Development', 'Building a new customer self-service portal', CAST('2024-12-01' AS TIMESTAMP WITH TIME ZONE), 'active'),
    (uuid_generate_v4(), 'Data Analytics Dashboard', 'Real-time analytics dashboard for business intelligence', CAST('2024-11-10' AS TIMESTAMP WITH TIME ZONE), 'active')
) AS new_projects(id, name, description, start_date, status)
WHERE NOT EXISTS (
  SELECT 1 FROM public.projects WHERE name = new_projects.name
);

-- Add some additional skills if they don't exist
INSERT INTO public.skills (name, category, description)
SELECT * FROM (
  VALUES 
    ('Python', 'technical', 'Programming language for data science and backend development'),
    ('Docker', 'technical', 'Containerization platform for application deployment'),
    ('Kubernetes', 'technical', 'Container orchestration platform'),
    ('AWS', 'technical', 'Amazon Web Services cloud platform'),
    ('Machine Learning', 'technical', 'Artificial intelligence and predictive modeling'),
    ('Data Visualization', 'technical', 'Creating visual representations of data'),
    ('API Design', 'technical', 'Designing and implementing application programming interfaces'),
    ('Database Design', 'technical', 'Designing efficient database schemas'),
    ('Mentoring', 'soft', 'Guiding and developing other team members'),
    ('Presentation Skills', 'soft', 'Effectively presenting ideas and information'),
    ('Time Management', 'soft', 'Efficiently managing time and priorities'),
    ('Critical Thinking', 'soft', 'Analyzing and evaluating information objectively'),
    ('Conflict Resolution', 'soft', 'Resolving disagreements and disputes'),
    ('Documentation', 'process', 'Creating and maintaining technical documentation'),
    ('Performance Monitoring', 'process', 'Tracking and optimizing system performance'),
    ('Security Practices', 'process', 'Implementing security best practices'),
    ('Deployment Automation', 'process', 'Automating application deployment processes')
) AS new_skills(name, category, description)
WHERE NOT EXISTS (
  SELECT 1 FROM public.skills WHERE name = new_skills.name
);

-- Update knowledge circles with more detailed descriptions
UPDATE public.knowledge_circles 
SET description = CASE 
  WHEN name = 'AI & Machine Learning' THEN 'Exploring cutting-edge AI technologies, machine learning algorithms, and their practical applications in business solutions'
  WHEN name = 'Frontend Development' THEN 'Modern web development practices, frameworks like React/Vue/Angular, and user experience optimization'
  WHEN name = 'Leadership & Management' THEN 'Developing leadership capabilities, team management strategies, and organizational effectiveness'
  ELSE description
END;

-- Add more knowledge circles
INSERT INTO public.knowledge_circles (name, description, category, icon, color)
SELECT * FROM (
  VALUES 
    ('DevOps & Cloud', 'Infrastructure automation, cloud platforms, and deployment strategies', 'Technical', 'Cloud', 'bg-orange-500'),
    ('Data Science & Analytics', 'Data analysis, visualization, and business intelligence techniques', 'Technical', 'BarChart', 'bg-indigo-500'),
    ('Product Management', 'Product strategy, roadmap planning, and stakeholder management', 'Process', 'Briefcase', 'bg-pink-500'),
    ('Quality Assurance', 'Testing methodologies, automation, and quality improvement processes', 'Process', 'Shield', 'bg-red-500')
) AS new_circles(name, description, category, icon, color)
WHERE NOT EXISTS (
  SELECT 1 FROM public.knowledge_circles WHERE name = new_circles.name
);

-- Show success message
DO $$
BEGIN
  RAISE NOTICE 'Sample data has been successfully added to your Seedble Skills Ecosystem database!';
  RAISE NOTICE 'You can now:';
  RAISE NOTICE '1. Sign up multiple users to test the peer review system';
  RAISE NOTICE '2. Assign peer reviews between team members';
  RAISE NOTICE '3. Complete skills assessments';
  RAISE NOTICE '4. Explore the knowledge circles';
END $$;
