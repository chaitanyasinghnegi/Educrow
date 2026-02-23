-- ============================================================
-- EduCrow — Seed Data
-- Sample problems and examples for development
-- ============================================================

-- ──────────────────────────────────────────────
-- Problems
-- ──────────────────────────────────────────────
INSERT INTO public.problems (title, description, difficulty) VALUES
  ('Two Sum', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.', 'Easy'),
  ('Container With Most Water', 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.', 'Medium'),
  ('Valid Parentheses', 'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets, and open brackets are closed in the correct order.', 'Easy'),
  ('Reverse Linked List', 'Given the head of a singly linked list, reverse the list, and return the reversed list.', 'Easy');

-- ──────────────────────────────────────────────
-- Examples (keyed to problem IDs)
-- ──────────────────────────────────────────────

-- Two Sum examples (problem 1)
INSERT INTO public.examples (problem_id, input, output, explanation) VALUES
  (1, 'nums = [2,7,11,15], target = 9', '[0,1]', 'Because nums[0] + nums[1] == 9, we return [0, 1].'),
  (1, 'nums = [3,2,4], target = 6', '[1,2]', NULL),
  (1, 'nums = [3,3], target = 6', '[0,1]', NULL);

-- Container With Most Water examples (problem 2)
INSERT INTO public.examples (problem_id, input, output, explanation) VALUES
  (2, 'height = [1,8,6,2,5,4,8,3,7]', '49', 'The max area is between lines at index 1 and 8.'),
  (2, 'height = [1,1]', '1', NULL);

-- Valid Parentheses examples (problem 3)
INSERT INTO public.examples (problem_id, input, output, explanation) VALUES
  (3, 's = "()"', 'true', NULL),
  (3, 's = "()[]{}"', 'true', NULL),
  (3, 's = "(]"', 'false', NULL);

-- Reverse Linked List examples (problem 4)
INSERT INTO public.examples (problem_id, input, output, explanation) VALUES
  (4, 'head = [1,2,3,4,5]', '[5,4,3,2,1]', NULL),
  (4, 'head = [1,2]', '[2,1]', NULL),
  (4, 'head = []', '[]', NULL);
