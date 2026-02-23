# EduCrow — Future Features Roadmap

> **Purpose:** Planning document for upcoming features. Add new entries following the template format below.

---

## Planned Features

### Mobile Navigation Menu
- **Description:** Add a hamburger menu / drawer for mobile viewport so navigation links are accessible on small screens.
- **Motivation:** Currently, nav links are hidden below `md` breakpoint with no alternative.
- **Priority:** High
- **Notes:** Consider using a slide-out drawer or collapsible menu. Tailwind or Chakra UI drawer could be used.

---

### User Progress Tracking & Dashboard
- **Description:** Track which problems a user has solved, which videos they have watched, and display progress on the dashboard.
- **Motivation:** The landing page advertises "Track Progress" but it is not yet implemented.
- **Priority:** Medium
- **Notes:** Will require a Supabase table (e.g., `user_progress`) linked to `users.uuid`. Dashboard should display completion stats and streaks.

---

### Discussion Forum / Community Section
- **Description:** A section where users can discuss problems, share solutions, and ask questions.
- **Motivation:** The landing page highlights "Community" as a feature, but no community page exists.
- **Priority:** Low
- **Notes:** Could be implemented as a simple comment system per problem, or a dedicated forum page.

---

## Template

Use this template when adding new planned features:

```md
### [Feature Name]
- **Description:**
- **Motivation:**
- **Priority:** High / Medium / Low
- **Notes:**
```
