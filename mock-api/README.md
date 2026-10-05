# LearnPath Mock API

The React app uses JSON Server as a local mock REST API.

## Start the mock API

From `react-frontend`:

```bash
npm install
npm run mock-api
```

The API runs at `http://localhost:5000`.

Courses endpoint:

```text
GET    /courses
POST   /courses
PUT    /courses/:id
DELETE /courses/:id
```

## Start React

In another terminal:

```bash
npm run dev
```

Or run both together:

```bash
npm run dev:all
```
