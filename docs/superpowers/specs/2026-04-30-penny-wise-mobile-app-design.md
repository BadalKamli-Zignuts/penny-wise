# Penny Wise Mobile App Design

## Decision

Build `penny-wise-mobile-app` as a fresh Expo SDK 55 TypeScript app that recreates the Replit `Expense-Insight` visual system as a native mobile app and uses a real backend architecture:

- Expo Router for app navigation.
- NativeWind for utility-first React Native styling.
- Gluestack-style local primitives for accessible, reusable UI components.
- Zustand for client state and optimistic UI.
- Firebase Auth for email/password authentication.
- Firestore for user-scoped expenses, budgets, categories, AI insights, and chat history.
- An Expo Router API/server boundary for Groq requests so the mobile client does not expose `GROQ_API_KEY`.
- `.env.example` template entries for Firebase and Groq credentials because credentials are not available yet.

Approach A was selected over Firebase Cloud Functions for the first build because it delivers the requested connected product with fewer setup blockers. The AI boundary will be isolated so it can move to Cloud Functions in a future release without changing screens or state APIs.

## Product Positioning

Penny Wise is an AI-powered financial behavior coach, not a generic expense tracker with chat attached. The core experience should help a user understand what changed, what is risky, and what to do next.

The first connected version focuses on a polished end-to-end workflow:

1. Sign up or sign in.
2. Complete onboarding.
3. Add and manage expenses.
4. See monthly health, category spend, trends, and budget status.
5. Ask the AI coach questions about real Firestore-backed spending data.
6. Receive generated insights and budget warnings.
7. Adjust currency, AI tone, and profile settings.

Voice, OCR, push notifications, and anomaly detection will have visible entry points and service boundaries, but the first implementation will not depend on native voice recognition, receipt parsing, scheduled notifications, or a trained anomaly model. This keeps the first product complete without pretending advanced subsystems are production-ready.

## Design Reference

Use the Replit AI project at:

`/Users/ztlab131/Desktop/projects/penny-wise/Expense-Insight`

Primary blueprint files:

- `artifacts/mockup-sandbox/src/components/mockups/lumen-tracker/Dashboard.tsx`
- `artifacts/mockup-sandbox/src/components/mockups/lumen-tracker/Analytics.tsx`
- `artifacts/mockup-sandbox/src/components/mockups/lumen-tracker/ExpenseEntry.tsx`
- `artifacts/mockup-sandbox/src/components/mockups/lumen-tracker/Activities.tsx`
- `artifacts/mockup-sandbox/src/components/mockups/lumen-tracker/AIChat.tsx`
- `artifacts/mockup-sandbox/src/components/mockups/lumen-tracker/AIInsights.tsx`
- `artifacts/mockup-sandbox/src/components/mockups/lumen-tracker/Onboarding*.tsx`
- `artifacts/mockup-sandbox/src/components/mockups/lumen-tracker/_group.css`

Translate the design to native patterns rather than copying web markup. Preserve the dark fintech mood, compact mobile layout, violet/cyan gradient accents, glass cards, rounded bottom sheet, central add button, AI insight cards, and chat widgets.

The default currency is INR (`₹`). The settings screen will let the user change the currency symbol in the first implementation.

## App Structure

Route groups:

- `app/(auth)/sign-in.tsx` for email/password sign in.
- `app/(auth)/sign-up.tsx` for account creation.
- `app/(auth)/verify.tsx` for the email verification handoff and resend flow supported by Firebase Auth.
- `app/onboarding/index.tsx` for initial AI coach and tracking onboarding.
- `app/(tabs)/index.tsx` for dashboard.
- `app/(tabs)/analytics.tsx` for trend and budget analytics.
- `app/(tabs)/activity.tsx` for expense history and filters.
- `app/(tabs)/coach.tsx` for AI chat.
- `app/(tabs)/settings.tsx` for profile, currency, AI tone, and sign out.
- `app/expense/new.tsx` for the add expense bottom-sheet style screen.
- `app/expense/[id].tsx` for edit/delete.
- `app/api/ai/chat+api.ts` for Groq chat requests.
- `app/api/ai/insights+api.ts` for insight generation.

The tab bar uses icons only where the meaning is clear, with the center action opening `app/expense/new.tsx`. The app is dark theme only.

## Data Model

Firestore user root:

`users/{uid}`

Documents and collections:

- `users/{uid}`: profile settings such as name, currency, AI tone, onboarding status, created date.
- `users/{uid}/expenses/{expenseId}`: amount, currency, category id, merchant, note, spentAt, recurring flag, createdAt, updatedAt.
- `users/{uid}/categories/{categoryId}`: name, icon, color, monthlyBudget, sortOrder, system flag.
- `users/{uid}/insights/{insightId}`: title, body, severity, category id, period, generatedAt, source.
- `users/{uid}/chats/{threadId}/messages/{messageId}`: role, content, widgets, createdAt.

Core TypeScript models will live under `src/features/*` and `src/lib/firebase`.

## State And Sync

Zustand stores:

- `authStore`: current user/session readiness.
- `expenseStore`: expenses, categories, budgets, loading state, optimistic CRUD actions.
- `settingsStore`: currency, AI tone, onboarding completion.
- `coachStore`: current chat messages, pending state, latest insight cards.

Firestore subscriptions keep the active user’s expenses/categories/profile in sync. Expense creation and updates are optimistic: local state updates first, Firestore write follows, failures roll back the affected item and surface an inline error.

Derived analytics should be pure functions so they are easy to test:

- Monthly total.
- Category totals.
- Budget usage.
- Week/month/year spending series.
- Spending velocity.
- End-of-month projection.
- Simple anomaly candidates based on percentage change from previous comparable periods.

## AI Integration

Groq requests go through Expo Router API routes. The mobile app sends a compact structured finance context, not raw UI state.

Request shape:

```ts
type CoachRequest = {
  message: string;
  tone: "casual" | "strict" | "advisor";
  currency: string;
  context: {
    period: "week" | "month" | "year";
    totals: AnalyticsTotals;
    budgets: BudgetSnapshot[];
    topCategories: CategorySpend[];
    recentExpenses: ExpenseSummary[];
    anomalies: AnomalyCandidate[];
  };
};
```

The server route builds a system prompt that frames Groq as a financial behavior coach. The response returns plain coach text plus optional lightweight widget data for budget warnings, comparison bars, or insight cards.

Environment template entries:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `GROQ_API_KEY`
- `GROQ_MODEL`

`GROQ_API_KEY` must not be read from client-side code.

## UI System

Use NativeWind classes for layout and styling with a small theme token layer:

- Background: `#0A0B12`
- Surface: `#11131C`
- Border: `rgba(255,255,255,0.08)`
- Primary text: `#FFFFFF`
- Secondary text: `#8B8D98`
- Accent violet: `#8B5CF6`
- Accent indigo: `#6366F1`
- Accent cyan: `#06B6D4`
- Mint: `#34D399`
- Amber: `#FBBF24`
- Coral: `#FB7185`

Reusable components:

- `Screen`
- `GlassCard`
- `GradientButton`
- `IconButton`
- `MetricHero`
- `InsightCard`
- `ExpenseRow`
- `CategoryPill`
- `BudgetProgress`
- `SegmentedControl`
- `BottomActionBar`
- `ChatBubble`
- `CoachWidget`

Use `lucide-react-native` for icons and avoid custom SVG icons unless a chart requires vector drawing.

## Charts

Use `victory-native` for the first implementation because it covers line, bar, and pie/donut needs with less custom drawing than Skia. Chart wrappers should receive already-derived data and stay presentation-only.

Charts:

- Dashboard mini spending line.
- Analytics period line chart.
- Category donut/breakdown.
- Budget progress bars.
- Chat comparison widget.

## Error Handling

Auth screens show form-level and field-level errors.

Firestore sync failures show a compact error banner and preserve local input so the user can retry.

AI failures show a friendly assistant message explaining that the coach could not respond, with a retry action. The app should still work as an expense tracker if Groq credentials are absent.

Missing Firebase env values should fail loudly in development with a setup-focused message.

## Testing Strategy

Use test-driven development for behavioral code.

Initial tests should cover:

- Analytics totals and category breakdowns.
- Budget threshold states.
- End-of-month projection.
- Anomaly candidate detection.
- Expense validation and Firestore serialization.
- AI context shaping and prompt input constraints.
- Zustand action behavior for add/update/delete using mocked repositories.

Verification commands:

- `npm run test`
- `npm run typecheck`
- `npm run lint`
- `npx expo start --clear` for manual app verification once dependencies are installed.

## Delivery Notes

The app folder starts empty. The first implementation should scaffold the Expo app in:

`/Users/ztlab131/Desktop/projects/penny-wise/penny-wise-mobile-app`

Because credentials are unavailable, commit an `.env.example` and keep `.env` ignored.

The parent `/Users/ztlab131/Desktop/projects/penny-wise` is not currently a git repository. Do not initialize git unless the user asks. If no repository exists when the spec is written, skip the commit requirement and tell the user why.
