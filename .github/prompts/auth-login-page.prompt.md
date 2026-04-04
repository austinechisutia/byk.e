---
description: "Implement a complete auth system: login page with Google OAuth and email/password, registration, forgot password flow, password reset via email link, and secure JWT sessions. Uses NextAuth, Prisma adapter, bcrypt, and nodemailer."
name: "Auth — Full Flow (Login, Register, Forgot & Reset Password)"
argument-hint: "Brand colors, app name, redirect path, or SMTP provider"
agent: "agent"
---

Implement a **complete authentication system** for a Next.js App Router project. Cover every step below in order. Do not skip any step.

## Stack

- Next.js 14+ (App Router, TypeScript)
- NextAuth.js v4 (`next-auth`, `@next-auth/prisma-adapter`)
- Prisma (existing `lib/prisma.ts`)
- `bcrypt` + `@types/bcrypt`
- `nodemailer` + `@types/nodemailer`
- Tailwind CSS

Install any missing packages before proceeding.

---

## 1. Auth utilities — `lib/auth-utils.ts`

```ts
export const DEFAULT_AUTH_REDIRECT = '/';
export const AUTH_PASSWORD_MIN_LENGTH = 8;
export const AUTH_PASSWORD_MAX_LENGTH = 72; // bcrypt truncates at 72 — cap to prevent DoS
export const AUTH_NAME_MAX_LENGTH = 80;

export function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getSafeCallbackPath(url?: string | null) {
  if (!url || !url.startsWith('/') || url.startsWith('//')) {
    return DEFAULT_AUTH_REDIRECT;
  }
  return url;
}
```

---

## 2. Prisma schema additions — `prisma/schema.prisma`

Add these models (required by `@next-auth/prisma-adapter` + password reset):

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  passwordHash  String?
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

model PasswordResetToken {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expires   DateTime
  createdAt DateTime @default(now())
  @@index([userId])
}
```

Run `npx prisma migrate dev --name add_auth_models` then `npx prisma generate`.

---

## 3. NextAuth config — `lib/auth.ts`

- **adapter**: `PrismaAdapter(prisma)`
- **session**: `{ strategy: 'jwt', maxAge: 60 * 60 * 24 * 7 }`
- **pages**: `{ signIn: '/login', error: '/login' }`
- **providers**:
  - `GoogleProvider` — reads `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
  - `CredentialsProvider` — `authorize`:
    1. Reject if credentials missing
    2. Reject if `password.length > AUTH_PASSWORD_MAX_LENGTH` (avoids bcrypt DoS)
    3. Find user by `normalizeEmail(email)`
    4. Return identical `'Invalid email or password.'` for any failure — never leak which field was wrong
    5. `bcrypt.compare` only — never timing-unsafe equality
- **callbacks**:
  - `jwt` — copy `user.id` → `token.sub` on first sign-in
  - `session` — copy `token.sub` → `session.user.id`
  - `redirect` — pass all URLs through `getSafeCallbackPath`; reject external origins

---

## 4. NextAuth route — `app/api/auth/[...nextauth]/route.ts`

```ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## 5. Registration API — `app/api/auth/register/route.ts`

`POST` — validates email, checks password length, hashes with `bcrypt.hash(password, 12)`, creates user. Returns `409` on duplicate email (catch unique-constraint error, never expose DB details). Returns `201` on success — no user object in response.

---

## 6. Mailer utility — `lib/mailer.ts`

Create a nodemailer transporter reading from env:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` (`'true'`/`'false'`), `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

Export `sendPasswordResetEmail(to: string, resetUrl: string)` — sends a branded HTML email with a button linking to `resetUrl`.

---

## 7. Forgot password API — `app/api/auth/forgot-password/route.ts`

`POST { email }`:
1. Normalize email, look up user — **always return `{ success: true }`** regardless of whether the email exists (prevents enumeration)
2. Skip if user has no `passwordHash` (Google-only account)
3. Delete existing reset tokens for this user
4. Generate `crypto.randomBytes(32).toString('hex')` token, set `expires = now + 1 hour`
5. Save `PasswordResetToken` to DB
6. Build `resetUrl = ${NEXTAUTH_URL}/reset-password?token=...`
7. Call `sendPasswordResetEmail` — **wrap in try/catch**, log errors, don't fail the response

---

## 8. Reset password API — `app/api/auth/reset-password/route.ts`

`POST { token, password }`:
1. Validate token is a non-empty string
2. Validate password length (`AUTH_PASSWORD_MIN_LENGTH` to `AUTH_PASSWORD_MAX_LENGTH`)
3. Find `PasswordResetToken` by token — return `400` if not found or expired (`record.expires < new Date()`)
4. `bcrypt.hash(password, 12)`, update `user.passwordHash`
5. Delete the used token
6. Return `{ success: true }`

---

## 9. TypeScript augmentation — `types/next-auth.d.ts`

```ts
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: { id: string } & DefaultSession['user'];
  }
}
```

---

## 10. Login page — `app/login/page.tsx`

Server component:
- `getServerSession(authOptions)` — redirect authenticated users to `callbackUrl`
- Await `searchParams` (Next.js 15+), sanitize `callbackUrl` with `getSafeCallbackPath`
- Two-column layout (brand copy left, form right), collapses to single column on mobile
- Pass `callbackUrl` and `oauthError` to `<AuthPageForm />`
- Wrap `<AuthPageForm />` in `<Suspense>` — required because the form uses `useSearchParams`

---

## 11. Auth form — `components/auth/AuthPageForm.tsx`

Client component (`'use client'`). Mode toggle: `'signin'` | `'signup'`.

**Reads from URL**: `useSearchParams` to detect `?reset=success` and show a green success banner.

**Google button**: `signIn('google', { callbackUrl })`

**Email form**:
- Sign-up: `POST /api/auth/register` → then `signIn('credentials', { redirect: false })`
- Sign-in: `signIn('credentials', { email, password, redirect: false, callbackUrl })`
- On success: `router.replace(result.url ?? callbackUrl)` + `router.refresh()`
- On failure: display `result.error`

**OAuth error mapping**: map `OAuthAccountNotLinked`, `OAuthCallback`, `OAuthSignin` etc. to user-friendly strings.

**Password field** (sign-in mode only): show a **"Forgot password?"** link below it linking to `/forgot-password`.

**Input constraints**: `minLength` / `maxLength` attributes driven by `auth-utils.ts` constants.

**Loading state**: disable all buttons while `isLoading`.

---

## 12. Forgot password page — `app/forgot-password/page.tsx`

Client component. Single email input form. On submit: `POST /api/auth/forgot-password`. On success show a confirmation message: _"If an account exists, we've sent a reset link. Check your inbox — it expires in 1 hour."_ — regardless of whether the email was found. Include a "Back to Sign In" link.

---

## 13. Reset password page — `app/reset-password/page.tsx`

Client component. Reads `?token` from URL via `useSearchParams` — show an error if missing.

Form fields: **New Password** + **Confirm Password** — validate they match client-side before submitting.

On submit: `POST /api/auth/reset-password`. On success: `router.replace('/login?reset=success')`.

Wrap `useSearchParams` usage in a child component with a `<Suspense>` boundary in the default export.

---

## 14. Navbar frosted background

The navbar should show dark text and a frosted background (no scroll needed) on these routes:
`/login`, `/forgot-password`, `/reset-password`

Detect via `usePathname()` and apply the frosted style when `isFrosted` is true.

---

## 15. Environment variables — `.env.local`

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=          # openssl rand -base64 32

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# SMTP — for password reset emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=you@gmail.com
SMTP_PASS=                # Gmail: App Password (16 chars, no spaces)
SMTP_FROM="Your App <you@gmail.com>"
```

**Gmail App Password**: requires 2-Step Verification. Generate at myaccount.google.com/apppasswords. Enter the 16 characters **without spaces**.

**Google OAuth**: add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI in Google Cloud Console.

---

## Security checklist

- [ ] `AUTH_PASSWORD_MAX_LENGTH = 72` — bcrypt DoS prevention
- [ ] `getSafeCallbackPath` rejects paths not starting with `/` or starting with `//`
- [ ] Credentials provider returns identical error for wrong email or wrong password
- [ ] Forgot-password route always returns success regardless of email existence
- [ ] Reset token is deleted immediately after use
- [ ] Reset token expiry is checked server-side (`record.expires < new Date()`)
- [ ] `NEXTAUTH_SECRET` set and not committed to source control
- [ ] `SMTP_PASS` is a Gmail App Password, not your account password

Implement a complete login and registration system for a Next.js App Router project using **NextAuth.js**, **Prisma**, and **bcrypt**. Follow every step below exactly.

## Stack assumptions

- Next.js 14+ with App Router and TypeScript
- Prisma with an existing database connection in `lib/prisma.ts`
- Tailwind CSS for styling
- Packages required: `next-auth`, `@next-auth/prisma-adapter`, `bcrypt`, `@types/bcrypt`

Install any missing packages before proceeding.

---

## 1. Auth utilities — `lib/auth-utils.ts`

Create this file with:

- `DEFAULT_AUTH_REDIRECT = '/'`
- `AUTH_PASSWORD_MIN_LENGTH = 8`
- `AUTH_PASSWORD_MAX_LENGTH = 72` — bcrypt silently truncates beyond 72 bytes; cap here to prevent DoS
- `AUTH_NAME_MAX_LENGTH = 80`
- `normalizeEmail(email)` — lowercase + trim
- `isValidEmail(email)` — simple regex guard
- `getSafeCallbackPath(url?)` — returns the path only if it starts with `/` and not `//`; otherwise returns `DEFAULT_AUTH_REDIRECT`. This prevents open-redirect attacks.

---

## 2. Prisma schema additions — `prisma/schema.prisma`

Add the standard NextAuth models required by `@next-auth/prisma-adapter`:

- `Account` — OAuth provider records linked to a User
- `Session` — optional (only needed for database sessions; JWT strategy doesn't use it but the adapter still expects the model)
- `VerificationToken`
- `User` — extend with `passwordHash String?` and `name String?`

Run `npx prisma migrate dev --name add_auth_models` after updating the schema.

---

## 3. NextAuth config — `lib/auth.ts`

Export `authOptions: NextAuthOptions` with:

- **adapter**: `PrismaAdapter(prisma)`
- **session**: `{ strategy: 'jwt', maxAge: 60 * 60 * 24 * 7 }`
- **jwt**: `{ maxAge: 60 * 60 * 24 * 7 }`
- **pages**: `{ signIn: '/login', error: '/login' }`
- **providers**:
  - `GoogleProvider` — reads `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from env
  - `CredentialsProvider` — `authorize` function must:
    1. Reject if credentials are missing
    2. Reject early if password exceeds `AUTH_PASSWORD_MAX_LENGTH` (avoids bcrypt processing oversized input)
    3. Look up user by normalized email
    4. Return generic `'Invalid email or password.'` for any failure — never leak which field was wrong
    5. Use `bcrypt.compare` — never a timing-unsafe equality check
- **callbacks**:
  - `jwt` — copy `user.id` into `token.sub` on first sign-in
  - `session` — copy `token.sub` into `session.user.id`
  - `redirect` — pass all URLs through `getSafeCallbackPath`; reject paths that resolve outside `baseUrl`

---

## 4. NextAuth route — `app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## 5. Registration route — `app/api/auth/register/route.ts`

`POST /api/auth/register` must:

1. Parse JSON body; return `400` if malformed
2. Validate email with `isValidEmail`; return `400` with `{ error: 'Invalid email.' }` on failure
3. Reject password shorter than `AUTH_PASSWORD_MIN_LENGTH` or longer than `AUTH_PASSWORD_MAX_LENGTH`
4. Hash with `bcrypt.hash(password, 12)`
5. Use `prisma.user.create` — catch unique-constraint errors and return `409 { error: 'An account with this email already exists.' }`
6. Return `201` on success — do **not** return the created user object

---

## 6. NextAuth TypeScript augmentation — `types/next-auth.d.ts`

Augment `Session.user` to include `id: string`. Import `DefaultSession` from `next-auth` (not re-exported from somewhere else) to avoid shadowing the module.

---

## 7. Login page — `app/login/page.tsx`

Server component that:

1. Calls `getServerSession(authOptions)` — redirect authenticated users to `callbackUrl` immediately
2. Reads `callbackUrl` and `error` from `searchParams` (await the Promise in Next.js 15+)
3. Sanitizes `callbackUrl` through `getSafeCallbackPath`
4. Renders a two-column layout (description left, form right) that collapses to single-column on mobile
5. Passes `callbackUrl` and `oauthError` as props to `<AuthPageForm />`

---

## 8. Auth form — `components/auth/AuthPageForm.tsx`

Client component (`'use client'`) with sign-in / sign-up mode toggle:

**Google button**
- Calls `signIn('google', { callbackUrl })` — simple, no extra error handling needed

**Email form**
- Sign-up mode: POST to `/api/auth/register`, then fall through to `signIn('credentials', { redirect: false })`
- Sign-in mode: call `signIn('credentials', { email, password, redirect: false, callbackUrl })` directly
- On success (`result.url` exists, no `result.error`): `router.replace(result.url ?? callbackUrl)` then `router.refresh()`
- On failure: display `result.error` in a visible error paragraph

**OAuth error mapping** — map `OAuthAccountNotLinked`, `OAuthCallback`, `OAuthSignin`, etc. to user-friendly strings; fall back to a generic message

**Input constraints** — use `minLength` / `maxLength` HTML attributes driven by the constants from `auth-utils.ts`

**Loading state** — disable both the Google button and the submit button while `isLoading` is true

---

## 9. Environment variables

The following must be set in `.env.local`:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
```

Remind the user to:
- Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI in Google Cloud Console
- Add the production URL equivalent before deploying

---

## Security checklist (verify before finishing)

- [ ] Password length is capped at 72 to prevent bcrypt DoS
- [ ] `getSafeCallbackPath` rejects paths that don't start with `/` or start with `//`
- [ ] Credentials provider returns identical error message regardless of which field was wrong
- [ ] Registration route catches unique-constraint errors without leaking DB details
- [ ] `NEXTAUTH_SECRET` is set and not committed to source control
- [ ] Google OAuth redirect URIs are restricted to known origins
