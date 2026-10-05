# LearnPath Course Management System

## Project structure

```text
course-management-system-main/
├── frontend/
├── react-frontend/
└── mock-api/
    └── db.json
```

## Run the mock API

Open Terminal 1:

```bash
cd react-frontend
npm install
npm run mock-api
```

The mock API will run at:

```text
http://localhost:5000
```

Courses endpoint:

```text
http://localhost:5000/courses
```

## Run the React application

Open Terminal 2:

```bash
cd react-frontend
npm run dev
```

Then open the Vite URL shown in the terminal.

The existing LearnPath features are preserved. Course data is loaded from the mock API and synchronized with the existing course/enrollment store used by the legacy pages.
