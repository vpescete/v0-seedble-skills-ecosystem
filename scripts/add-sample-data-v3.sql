-- Add sample data with simple inserts (avoiding duplicates with WHERE NOT EXISTS)

-- Add projects
INSERT INTO public.projects (name, description, start_date, status)
SELECT 'E-commerce Platform Redesign', 'Complete redesign of the company e-commerce platform', '2024-10-01 00:00:00+00'::timestamp with time zone, 'active'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'E-commerce Platform Redesign');

INSERT INTO public.projects (name, description, start_date, status)
SELECT 'Mobile App UX Research', 'User experience research for the new mobile application', '2024-11-01 00:00:00+00'::timestamp with time zone, 'active'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Mobile App UX Research');

INSERT INTO public.projects (name, description, start_date, status)
SELECT 'Digital Transformation Initiative', 'Company-wide digital transformation project', '2024-09-15 00:00:00+00'::timestamp with time zone, 'completed'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Digital Transformation Initiative');

INSERT INTO public.projects (name, description, start_date, status)
SELECT 'ML Model Implementation', 'Implementation of machine learning models for data analysis', '2024-11-15 00:00:00+00'::timestamp with time zone, 'active'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'ML Model Implementation');

INSERT INTO public.projects (name, description, start_date, status)
SELECT 'Customer Portal Development', 'Building a new customer self-service portal', '2024-12-01 00:00:00+00'::timestamp with time zone, 'active'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Customer Portal Development');

INSERT INTO public.projects (name, description, start_date, status)
SELECT 'Data Analytics Dashboard', 'Real-time analytics dashboard for business intelligence', '2024-11-10 00:00:00+00'::timestamp with time zone, 'active'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Data Analytics Dashboard');

-- Add additional skills
INSERT INTO public.skills (name, category, description)
SELECT 'Python', 'technical', 'Programming language for data science and backend development'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Python');

INSERT INTO public.skills (name, category, description)
SELECT 'Docker', 'technical', 'Containerization platform for application deployment'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Docker');

INSERT INTO public.skills (name, category, description)
SELECT 'Kubernetes', 'technical', 'Container orchestration platform'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Kubernetes');

INSERT INTO public.skills (name, category, description)
SELECT 'AWS', 'technical', 'Amazon Web Services cloud platform'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'AWS');

INSERT INTO public.skills (name, category, description)
SELECT 'Machine Learning', 'technical', 'Artificial intelligence and predictive modeling'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Machine Learning');

INSERT INTO public.skills (name, category, description)
SELECT 'Data Visualization', 'technical', 'Creating visual representations of data'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Data Visualization');

INSERT INTO public.skills (name, category, description)
SELECT 'API Design', 'technical', 'Designing and implementing application programming interfaces'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'API Design');

INSERT INTO public.skills (name, category, description)
SELECT 'Database Design', 'technical', 'Designing efficient database schemas'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Database Design');

INSERT INTO public.skills (name, category, description)
SELECT 'Mentoring', 'soft', 'Guiding and developing other team members'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Mentoring');

INSERT INTO public.skills (name, category, description)
SELECT 'Presentation Skills', 'soft', 'Effectively presenting ideas and information'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Presentation Skills');

INSERT INTO public.skills (name, category, description)
SELECT 'Time Management', 'soft', 'Efficiently managing time and priorities'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Time Management');

INSERT INTO public.skills (name, category, description)
SELECT 'Critical Thinking', 'soft', 'Analyzing and evaluating information objectively'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Critical Thinking');

INSERT INTO public.skills (name, category, description)
SELECT 'Conflict Resolution', 'soft', 'Resolving disagreements and disputes'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Conflict Resolution');

INSERT INTO public.skills (name, category, description)
SELECT 'Documentation', 'process', 'Creating and maintaining technical documentation'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Documentation');

INSERT INTO public.skills (name, category, description)
SELECT 'Performance Monitoring', 'process', 'Tracking and optimizing system performance'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Performance Monitoring');

INSERT INTO public.skills (name, category, description)
SELECT 'Security Practices', 'process', 'Implementing security best practices'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Security Practices');

INSERT INTO public.skills (name, category, description)
SELECT 'Deployment Automation', 'process', 'Automating application deployment processes'
WHERE NOT EXISTS (SELECT 1 FROM public.skills WHERE name = 'Deployment Automation');

-- Add more knowledge circles
INSERT INTO public.knowledge_circles (name, description, category, icon, color)
SELECT 'DevOps & Cloud', 'Infrastructure automation, cloud platforms, and deployment strategies', 'Technical', 'Cloud', 'bg-orange-500'
WHERE NOT EXISTS (SELECT 1 FROM public.knowledge_circles WHERE name = 'DevOps & Cloud');

INSERT INTO public.knowledge_circles (name, description, category, icon, color)
SELECT 'Data Science & Analytics', 'Data analysis, visualization, and business intelligence techniques', 'Technical', 'BarChart', 'bg-indigo-500'
WHERE NOT EXISTS (SELECT 1 FROM public.knowledge_circles WHERE name = 'Data Science & Analytics');

INSERT INTO public.knowledge_circles (name, description, category, icon, color)
SELECT 'Product Management', 'Product strategy, roadmap planning, and stakeholder management', 'Process', 'Briefcase', 'bg-pink-500'
WHERE NOT EXISTS (SELECT 1 FROM public.knowledge_circles WHERE name = 'Product Management');

INSERT INTO public.knowledge_circles (name, description, category, icon, color)
SELECT 'Quality Assurance', 'Testing methodologies, automation, and quality improvement processes', 'Process', 'Shield', 'bg-red-500'
WHERE NOT EXISTS (SELECT 1 FROM public.knowledge_circles WHERE name = 'Quality Assurance');

-- Update existing knowledge circles with better descriptions
UPDATE public.knowledge_circles 
SET description = 'Exploring cutting-edge AI technologies, machine learning algorithms, and their practical applications in business solutions'
WHERE name = 'AI & Machine Learning';

UPDATE public.knowledge_circles 
SET description = 'Modern web development practices, frameworks like React/Vue/Angular, and user experience optimization'
WHERE name = 'Frontend Development';

UPDATE public.knowledge_circles 
SET description = 'Developing leadership capabilities, team management strategies, and organizational effectiveness'
WHERE name = 'Leadership & Management';

-- Show completion message
SELECT 'Sample data has been successfully added to your Seedble Skills Ecosystem database!' as message;
SELECT 'Total projects: ' || COUNT(*) as project_count FROM public.projects;
SELECT 'Total skills: ' || COUNT(*) as skill_count FROM public.skills;
SELECT 'Total knowledge circles: ' || COUNT(*) as circle_count FROM public.knowledge_circles;
