---
description: "Implement a login page with Google OAuth and email/password auth using NextAuth, Prisma adapter, and JWT sessions. Includes registration, secure redirects, and bcrypt-safe input validation."
name: "Auth — Login Page (Google + Email)"
argument-hint: "Any specifics to customize (brand colors, redirect path, UI tweaks)"
agent: "agent"
---

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
