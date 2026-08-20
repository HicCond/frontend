# Geography Quiz — Frontend

A React + TypeScript client for the multiple-choice quiz coding challenge. It consumes the
Spring Boot backend in the sibling `backend` repository — no quiz logic is duplicated here.

## Stack

- **React 18 + TypeScript**, built with **Vite**.
- **react-bootstrap** + Bootstrap 5 CSS for UI components.
- **Vitest + React Testing Library** for tests, with **MSW** mocking the API in the test
  environment only (the running app always talks to the real backend).

## Getting started

The backend must be running first — see `../backend/README.md` (`./gradlew bootRun`, listens on
`http://localhost:8080`).

```bash
npm install
npm run dev
```

Open the printed local URL (typically http://localhost:5173). By default the app talks to
`http://localhost:8080/api/v1/quiz`; set `VITE_API_BASE_URL` (copy `.env.example` to `.env`) to
point at a different backend instance.

## Scripts

| Command                | Description                           |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Start the Vite dev server.            |
| `npm run build`        | Type-check and build for production.  |
| `npm run preview`      | Preview the production build locally. |
| `npm test`             | Run the test suite once.              |
| `npm run test:watch`   | Run tests in watch mode.              |
| `npm run lint`         | Run ESLint.                           |
| `npm run format`       | Format the codebase with Prettier.    |
| `npm run format:check` | Check formatting without writing.     |

## Application flow

1. **Intro screen** — fetches quiz rules from the backend (`GET /api/v1/quiz`) and renders the
   title, description, and points-per-question scoring table; nothing is hardcoded. A Start
   button then fetches the questions.
2. **Quiz screen** — one question at a time. "Next" (or "Submit" on the last question) is
   disabled until an option is selected. No going back once you've moved on.
3. **Results screen** — total score against the passing threshold, correct/incorrect counts,
   percentage of questions correct, pass/fail, and the list of questions answered incorrectly
   with the correct answers.

All scoring, validation, and pass/fail logic lives on the server — the client only renders
whatever the API returns.

## API contract

Consumed from the backend (see `src/types/quiz.ts` and `../backend/README.md` for the
authoritative contract):

- `GET /api/v1/quiz` — quiz rules (title, description, scoring breakdown, passing score).
- `GET /api/v1/quiz/questions` — the questions; never includes the correct option.
- `POST /api/v1/quiz/submissions` — evaluates `{ answers: [{ questionId, optionId }] }` and
  returns the score, breakdown, and incorrect answers.
- Errors are RFC 9457 `application/problem+json`, with a `detail` message and a machine-readable
  `errors` array (`ValidationErrorCode` values such as `MISSING_ANSWER`, `OPTION_NOT_IN_QUESTION`).

## Project structure

```
src/
  types/quiz.ts        API contract types, mirroring the backend's DTOs
  api/quizApi.ts        Typed fetch client (getQuizRules, getQuestions, submitAnswers)
  hooks/useQuiz.ts       Rules/screen/answers/result state machine (useReducer)
  components/            IntroScreen, QuizScreen, QuestionOptions, ResultsScreen
  mocks/                 MSW handlers + fixture data used by the test suite only
```

## Assumptions & trade-offs

- No router: the three screens are a strictly linear wizard (Intro → Quiz → Results), so a
  single in-memory state machine was used instead of adding react-router for URLs that don't
  need to be shareable/bookmarkable.
- Client-side validation only gates UI progression (an option must be selected to continue) — it
  never duplicates scoring or pass/fail logic, which always comes from the API response.
- The pass/fail threshold is decided by score, not percentage (a fixed number of questions can be
  worth very different point totals), so the results screen leads with the score against the
  threshold and shows percentage as a secondary figure.
- MSW is only used to isolate the test suite from a running backend; the app itself always calls
  the real API, so there's nothing to toggle between "mock" and "real" modes at runtime.
