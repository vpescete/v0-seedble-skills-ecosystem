-- Script per creare 10 utenti con diverse competenze

-- Inserimento di 10 utenti con ruoli e dipartimenti diversi
INSERT INTO users (id, email, full_name, avatar_url, role, department, created_at, updated_at)
VALUES
  ('u1001', 'marco.rossi@seedble.com', 'Marco Rossi', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marco', 'Frontend Developer', 'Engineering', NOW(), NOW()),
  ('u1002', 'giulia.bianchi@seedble.com', 'Giulia Bianchi', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Giulia', 'UX Designer', 'Design', NOW(), NOW()),
  ('u1003', 'alessandro.verdi@seedble.com', 'Alessandro Verdi', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alessandro', 'Backend Developer', 'Engineering', NOW(), NOW()),
  ('u1004', 'sofia.neri@seedble.com', 'Sofia Neri', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia', 'Project Manager', 'Management', NOW(), NOW()),
  ('u1005', 'luca.gialli@seedble.com', 'Luca Gialli', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luca', 'Data Scientist', 'Data', NOW(), NOW()),
  ('u1006', 'chiara.azzurri@seedble.com', 'Chiara Azzurri', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chiara', 'DevOps Engineer', 'Operations', NOW(), NOW()),
  ('u1007', 'matteo.viola@seedble.com', 'Matteo Viola', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Matteo', 'Product Manager', 'Product', NOW(), NOW()),
  ('u1008', 'elena.arancio@seedble.com', 'Elena Arancio', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', 'Full Stack Developer', 'Engineering', NOW(), NOW()),
  ('u1009', 'davide.marrone@seedble.com', 'Davide Marrone', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Davide', 'UI Designer', 'Design', NOW(), NOW()),
  ('u1010', 'valentina.rosa@seedble.com', 'Valentina Rosa', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Valentina', 'Marketing Specialist', 'Marketing', NOW(), NOW());

-- Verifica se esistono già delle skills, altrimenti le inserisce
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM skills LIMIT 1) THEN
        -- Inserimento di skills tecniche
        INSERT INTO skills (id, name, category, description, created_at)
        VALUES
          ('s1001', 'React', 'technical', 'Sviluppo frontend con React', NOW()),
          ('s1002', 'Node.js', 'technical', 'Sviluppo backend con Node.js', NOW()),
          ('s1003', 'Python', 'technical', 'Programmazione in Python', NOW()),
          ('s1004', 'UI Design', 'technical', 'Design di interfacce utente', NOW()),
          ('s1005', 'UX Research', 'technical', 'Ricerca sull''esperienza utente', NOW()),
          ('s1006', 'DevOps', 'technical', 'Pratiche DevOps e CI/CD', NOW()),
          ('s1007', 'Data Analysis', 'technical', 'Analisi dei dati', NOW()),
          ('s1008', 'Machine Learning', 'technical', 'Algoritmi di machine learning', NOW()),
          ('s1009', 'AWS', 'technical', 'Amazon Web Services', NOW()),
          ('s1010', 'Docker', 'technical', 'Containerizzazione con Docker', NOW()),
          ('s1011', 'Kubernetes', 'technical', 'Orchestrazione di container', NOW()),
          ('s1012', 'SQL', 'technical', 'Database SQL', NOW()),
          ('s1013', 'NoSQL', 'technical', 'Database NoSQL', NOW()),
          ('s1014', 'GraphQL', 'technical', 'API GraphQL', NOW()),
          ('s1015', 'REST API', 'technical', 'API RESTful', NOW()),
          
          -- Inserimento di soft skills
          ('s2001', 'Leadership', 'soft', 'Capacità di leadership', NOW()),
          ('s2002', 'Comunicazione', 'soft', 'Comunicazione efficace', NOW()),
          ('s2003', 'Lavoro di squadra', 'soft', 'Collaborazione in team', NOW()),
          ('s2004', 'Problem Solving', 'soft', 'Risoluzione di problemi', NOW()),
          ('s2005', 'Creatività', 'soft', 'Pensiero creativo', NOW()),
          ('s2006', 'Adattabilità', 'soft', 'Capacità di adattamento', NOW()),
          ('s2007', 'Gestione del tempo', 'soft', 'Time management', NOW()),
          ('s2008', 'Pensiero critico', 'soft', 'Analisi critica', NOW()),
          ('s2009', 'Negoziazione', 'soft', 'Capacità di negoziazione', NOW()),
          ('s2010', 'Empatia', 'soft', 'Comprensione emotiva', NOW()),
          
          -- Inserimento di process skills
          ('s3001', 'Agile', 'process', 'Metodologie Agile', NOW()),
          ('s3002', 'Scrum', 'process', 'Framework Scrum', NOW()),
          ('s3003', 'Kanban', 'process', 'Metodologia Kanban', NOW()),
          ('s3004', 'Project Management', 'process', 'Gestione progetti', NOW()),
          ('s3005', 'Product Management', 'process', 'Gestione prodotti', NOW()),
          ('s3006', 'Design Thinking', 'process', 'Approccio Design Thinking', NOW()),
          ('s3007', 'Lean', 'process', 'Metodologia Lean', NOW()),
          ('s3008', 'Six Sigma', 'process', 'Metodologia Six Sigma', NOW()),
          ('s3009', 'Quality Assurance', 'process', 'Assicurazione qualità', NOW()),
          ('s3010', 'Risk Management', 'process', 'Gestione del rischio', NOW());
    END IF;
END $$;

-- Associazione di skills agli utenti con diversi livelli di competenza e interesse
-- Marco Rossi - Frontend Developer
INSERT INTO user_skills (id, user_id, skill_id, level, interest, is_priority, last_assessed, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'u1001', 's1001', 5, 5, true, NOW(), NOW(), NOW()),   -- React (esperto)
  (uuid_generate_v4(), 'u1001', 's1004', 3, 4, false, NOW(), NOW(), NOW()),  -- UI Design (intermedio)
  (uuid_generate_v4(), 'u1001', 's1014', 4, 3, false, NOW(), NOW(), NOW()),  -- GraphQL (avanzato)
  (uuid_generate_v4(), 'u1001', 's2003', 4, 4, true, NOW(), NOW(), NOW()),   -- Lavoro di squadra (avanzato)
  (uuid_generate_v4(), 'u1001', 's2004', 3, 3, false, NOW(), NOW(), NOW()),  -- Problem Solving (intermedio)
  (uuid_generate_v4(), 'u1001', 's3001', 3, 4, false, NOW(), NOW(), NOW());  -- Agile (intermedio)

-- Giulia Bianchi - UX Designer
INSERT INTO user_skills (id, user_id, skill_id, level, interest, is_priority, last_assessed, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'u1002', 's1004', 5, 5, true, NOW(), NOW(), NOW()),   -- UI Design (esperto)
  (uuid_generate_v4(), 'u1002', 's1005', 5, 5, true, NOW(), NOW(), NOW()),   -- UX Research (esperto)
  (uuid_generate_v4(), 'u1002', 's2005', 4, 5, true, NOW(), NOW(), NOW()),   -- Creatività (avanzato)
  (uuid_generate_v4(), 'u1002', 's2002', 4, 3, false, NOW(), NOW(), NOW()),  -- Comunicazione (avanzato)
  (uuid_generate_v4(), 'u1002', 's2010', 5, 4, false, NOW(), NOW(), NOW()),  -- Empatia (esperto)
  (uuid_generate_v4(), 'u1002', 's3006', 4, 5, true, NOW(), NOW(), NOW());   -- Design Thinking (avanzato)

-- Alessandro Verdi - Backend Developer
INSERT INTO user_skills (id, user_id, skill_id, level, interest, is_priority, last_assessed, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'u1003', 's1002', 5, 4, true, NOW(), NOW(), NOW()),   -- Node.js (esperto)
  (uuid_generate_v4(), 'u1003', 's1012', 4, 3, false, NOW(), NOW(), NOW()),  -- SQL (avanzato)
  (uuid_generate_v4(), 'u1003', 's1013', 4, 4, true, NOW(), NOW(), NOW()),   -- NoSQL (avanzato)
  (uuid_generate_v4(), 'u1003', 's1015', 5, 3, false, NOW(), NOW(), NOW()),  -- REST API (esperto)
  (uuid_generate_v4(), 'u1003', 's2004', 3, 4, false, NOW(), NOW(), NOW()),  -- Problem Solving (intermedio)
  (uuid_generate_v4(), 'u1003', 's3001', 3, 2, false, NOW(), NOW(), NOW());  -- Agile (intermedio)

-- Sofia Neri - Project Manager
INSERT INTO user_skills (id, user_id, skill_id, level, interest, is_priority, last_assessed, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'u1004', 's2001', 5, 5, true, NOW(), NOW(), NOW()),   -- Leadership (esperto)
  (uuid_generate_v4(), 'u1004', 's2002', 5, 4, true, NOW(), NOW(), NOW()),   -- Comunicazione (esperto)
  (uuid_generate_v4(), 'u1004', 's2007', 4, 4, true, NOW(), NOW(), NOW()),   -- Gestione del tempo (avanzato)
  (uuid_generate_v4(), 'u1004', 's2009', 4, 3, false, NOW(), NOW(), NOW()),  -- Negoziazione (avanzato)
  (uuid_generate_v4(), 'u1004', 's3001', 5, 4, true, NOW(), NOW(), NOW()),   -- Agile (esperto)
  (uuid_generate_v4(), 'u1004', 's3002', 5, 5, true, NOW(), NOW(), NOW()),   -- Scrum (esperto)
  (uuid_generate_v4(), 'u1004', 's3004', 5, 4, true, NOW(), NOW(), NOW()),   -- Project Management (esperto)
  (uuid_generate_v4(), 'u1004', 's3010', 4, 3, false, NOW(), NOW(), NOW());  -- Risk Management (avanzato)

-- Luca Gialli - Data Scientist
INSERT INTO user_skills (id, user_id, skill_id, level, interest, is_priority, last_assessed, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'u1005', 's1003', 5, 5, true, NOW(), NOW(), NOW()),   -- Python (esperto)
  (uuid_generate_v4(), 'u1005', 's1007', 5, 5, true, NOW(), NOW(), NOW()),   -- Data Analysis (esperto)
  (uuid_generate_v4(), 'u1005', 's1008', 4, 5, true, NOW(), NOW(), NOW()),   -- Machine Learning (avanzato)
  (uuid_generate_v4(), 'u1005', 's1012', 4, 3, false, NOW(), NOW(), NOW()),  -- SQL (avanzato)
  (uuid_generate_v4(), 'u1005', 's2004', 4, 3, false, NOW(), NOW(), NOW()),  -- Problem Solving (avanzato)
  (uuid_generate_v4(), 'u1005', 's2008', 5, 4, true, NOW(), NOW(), NOW());   -- Pensiero critico (esperto)

-- Chiara Azzurri - DevOps Engineer
INSERT INTO user_skills (id, user_id, skill_id, level, interest, is_priority, last_assessed, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'u1006', 's1006', 5, 5, true, NOW(), NOW(), NOW()),   -- DevOps (esperto)
  (uuid_generate_v4(), 'u1006', 's1009', 5, 4, true, NOW(), NOW(), NOW()),   -- AWS (esperto)
  (uuid_generate_v4(), 'u1006', 's1010', 5, 5, true, NOW(), NOW(), NOW()),   -- Docker (esperto)
  (uuid_generate_v4(), 'u1006', 's1011', 4, 5, true, NOW(), NOW(), NOW()),   -- Kubernetes (avanzato)
  (uuid_generate_v4(), 'u1006', 's2004', 4, 3, false, NOW(), NOW(), NOW()),  -- Problem Solving (avanzato)
  (uuid_generate_v4(), 'u1006', 's2006', 3, 4, false, NOW(), NOW(), NOW()),  -- Adattabilità (intermedio)
  (uuid_generate_v4(), 'u1006', 's3009', 4, 3, false, NOW(), NOW(), NOW());  -- Quality Assurance (avanzato)

-- Matteo Viola - Product Manager
INSERT INTO user_skills (id, user_id, skill_id, level, interest, is_priority, last_assessed, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'u1007', 's2001', 4, 5, true, NOW(), NOW(), NOW()),   -- Leadership (avanzato)
  (uuid_generate_v4(), 'u1007', 's2002', 5, 4, true, NOW(), NOW(), NOW()),   -- Comunicazione (esperto)
  (uuid_generate_v4(), 'u1007', 's2005', 4, 4, false, NOW(), NOW(), NOW()),  -- Creatività (avanzato)
  (uuid_generate_v4(), 'u1007', 's2009', 5, 4, true, NOW(), NOW(), NOW()),   -- Negoziazione (esperto)
  (uuid_generate_v4(), 'u1007', 's3001', 4, 3, false, NOW(), NOW(), NOW()),  -- Agile (avanzato)
  (uuid_generate_v4(), 'u1007', 's3005', 5, 5, true, NOW(), NOW(), NOW()),   -- Product Management (esperto)
  (uuid_generate_v4(), 'u1007', 's3006', 4, 5, true, NOW(), NOW(), NOW()),   -- Design Thinking (avanzato)
  (uuid_generate_v4(), 'u1007', 's3007', 3, 4, false, NOW(), NOW(), NOW());  -- Lean (intermedio)

-- Elena Arancio - Full Stack Developer
INSERT INTO user_skills (id, user_id, skill_id, level, interest, is_priority, last_assessed, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'u1008', 's1001', 4, 5, true, NOW(), NOW(), NOW()),   -- React (avanzato)
  (uuid_generate_v4(), 'u1008', 's1002', 4, 4, true, NOW(), NOW(), NOW()),   -- Node.js (avanzato)
  (uuid_generate_v4(), 'u1008', 's1012', 4, 3, false, NOW(), NOW(), NOW()),  -- SQL (avanzato)
  (uuid_generate_v4(), 'u1008', 's1014', 3, 4, false, NOW(), NOW(), NOW()),  -- GraphQL (intermedio)
  (uuid_generate_v4(), 'u1008', 's1015', 4, 4, true, NOW(), NOW(), NOW()),   -- REST API (avanzato)
  (uuid_generate_v4(), 'u1008', 's2003', 4, 3, false, NOW(), NOW(), NOW()),  -- Lavoro di squadra (avanzato)
  (uuid_generate_v4(), 'u1008', 's2004', 3, 4, false, NOW(), NOW(), NOW()),  -- Problem Solving (intermedio)
  (uuid_generate_v4(), 'u1008', 's3001', 3, 3, false, NOW(), NOW(), NOW());  -- Agile (intermedio)

-- Davide Marrone - UI Designer
INSERT INTO user_skills (id, user_id, skill_id, level, interest, is_priority, last_assessed, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'u1009', 's1001', 2, 3, false, NOW(), NOW(), NOW()),  -- React (base)
  (uuid_generate_v4(), 'u1009', 's1004', 5, 5, true, NOW(), NOW(), NOW()),   -- UI Design (esperto)
  (uuid_generate_v4(), 'u1009', 's1005', 3, 4, false, NOW(), NOW(), NOW()),  -- UX Research (intermedio)
  (uuid_generate_v4(), 'u1009', 's2002', 4, 3, false, NOW(), NOW(), NOW()),  -- Comunicazione (avanzato)
  (uuid_generate_v4(), 'u1009', 's2005', 5, 5, true, NOW(), NOW(), NOW()),   -- Creatività (esperto)
  (uuid_generate_v4(), 'u1009', 's2010', 4, 3, false, NOW(), NOW(), NOW()),  -- Empatia (avanzato)
  (uuid_generate_v4(), 'u1009', 's3006', 3, 4, false, NOW(), NOW(), NOW());  -- Design Thinking (intermedio)

-- Valentina Rosa - Marketing Specialist
INSERT INTO user_skills (id, user_id, skill_id, level, interest, is_priority, last_assessed, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'u1010', 's2002', 5, 5, true, NOW(), NOW(), NOW()),   -- Comunicazione (esperto)
  (uuid_generate_v4(), 'u1010', 's2005', 5, 4, true, NOW(), NOW(), NOW()),   -- Creatività (esperto)
  (uuid_generate_v4(), 'u1010', 's2007', 4, 3, false, NOW(), NOW(), NOW()),  -- Gestione del tempo (avanzato)
  (uuid_generate_v4(), 'u1010', 's2008', 4, 4, false, NOW(), NOW(), NOW()),  -- Pensiero critico (avanzato)
  (uuid_generate_v4(), 'u1010', 's2010', 4, 5, true, NOW(), NOW(), NOW()),   -- Empatia (avanzato)
  (uuid_generate_v4(), 'u1010', 's3007', 3, 4, false, NOW(), NOW(), NOW());  -- Lean (intermedio)

-- Creazione di alcune valutazioni per gli utenti
INSERT INTO assessments (id, user_id, type, status, skills_evaluated, completion_time, created_at, completed_at)
VALUES
  (uuid_generate_v4(), 'u1001', 'complete', 'completed', 6, 720, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
  (uuid_generate_v4(), 'u1002', 'complete', 'completed', 6, 540, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
  (uuid_generate_v4(), 'u1003', 'quick', 'completed', 4, 300, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
  (uuid_generate_v4(), 'u1004', 'role-specific', 'completed', 8, 960, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
  (uuid_generate_v4(), 'u1005', 'complete', 'completed', 6, 780, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  (uuid_generate_v4(), 'u1006', 'quick', 'completed', 5, 420, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  (uuid_generate_v4(), 'u1007', 'role-specific', 'completed', 7, 840, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  (uuid_generate_v4(), 'u1008', 'complete', 'completed', 8, 900, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  (uuid_generate_v4(), 'u1009', 'quick', 'completed', 5, 360, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  (uuid_generate_v4(), 'u1010', 'complete', 'completed', 6, 660, NOW(), NOW());

SELECT 'Inseriti 10 utenti con diverse competenze e valutazioni' AS result;
