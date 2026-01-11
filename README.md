
# Music Flow / Opus Planner

A deliberate practice planner for musicians.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open the app**:
   Visit [http://localhost:3000](http://localhost:3000).

## Mocked User Flow

- **Login**: Click "I am a Student" to login as **Alice**, or "I am a Teacher" to login as **Maestro John**.
- **Student Dashboard**: 
  - View your weekly schedule.
  - Click a day's "Add" button to schedule a session.
  - Click a task to edit details.
  - Click the circle icon to toggle status (Todo/Done).
- **Teacher Dashboard**:
  - See list of students ("Alice").
  - Click on Alice to view/edit her calendar.
  - Assign new tasks to Alice.

## Technologies

- Next.js 15 App Router
- Tailwind CSS
- Shadcn UI
- Lucide React Icons
- Date-fns
- Mocked Context for State Management
