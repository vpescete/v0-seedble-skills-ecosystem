INSERT INTO public.profiles (id, updated_at, username, full_name, avatar_url, website)
VALUES ('a746a32b-6a9f-4a1e-8b3b-3b3b3b3b3b3b', NOW(), 'testuser', 'Test User', 'https://example.com/avatar.jpg', 'https://example.com');

INSERT INTO public.todos (id, created_at, task, is_complete, user_id)
VALUES ('b857b43c-7b0a-4c2f-9d4c-4c4c4c4c4c4c', NOW(), 'Buy groceries', FALSE, 'a746a32b-6a9f-4a1e-8b3b-3b3b3b3b3b3b');

INSERT INTO public.todos (id, created_at, task, is_complete, user_id)
VALUES ('c968c54d-8c1b-4d40-ae5d-5d5d5d5d5d5d', NOW(), 'Walk the dog', TRUE, 'a746a32b-6a9f-4a1e-8b3b-3b3b3b3b3b3b');

INSERT INTO public.todos (id, created_at, task, is_complete, user_id)
VALUES ('d079d65e-9d2c-4e51-bf6e-6e6e6e6e6e6e', NOW(), 'Pay bills', FALSE, 'a746a32b-6a9f-4a1e-8b3b-3b3b3b3b3b3b');
