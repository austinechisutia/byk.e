# Byk.e

Byk.e is a sustainable home and kitchenware storefront designed for eco-conscious households, gift buyers, and people who want durable, beautiful essentials without sacrificing environmental values. The brand combines modern living with a practical sustainability story: better materials, slower consumption, cleaner kitchens, and a more thoughtful home.

## Role of the site

This site is not just a catalogue — it is a conversion-focused commerce experience for a lifestyle brand. It exists to help people:

- discover eco-friendly kitchenware and home goods
- shop by product and category with a clear buying journey
- create a personal account and manage orders
- place orders through familiar local payment methods
- feel confident that the brand is environmentally conscious and professionally managed

The target audience is primarily:

- urban homeowners and apartment dwellers in Kenya
- environmentally aware consumers looking for sustainable alternatives
- people buying practical, premium home goods for gifting or upgrade projects
- customers who prefer mobile-first, local payment experiences like M-Pesa

## What the platform is designed to accomplish

The application currently delivers a complete storefront flow with strong e-commerce fundamentals:

- premium landing page with brand-led storytelling
- curated product discovery and bestsellers sections
- searchable product navigation and category browsing
- add-to-cart behaviour with persistent per-user cart storage
- login and registration flow with email/password and Google sign-in
- password reset flow with email delivery
- checkout with multiple payment options
- order creation and order history pages
- protected admin access for internal management
- responsive experience across mobile and desktop
- trust signals, cookie consent handling, and checkout security messaging

## How the experience works

1. A visitor lands on the home page and sees the brand story, product promise, and lifestyle imagery.
2. They browse products or use the search tool to find an item.
3. When they click add to cart, the app either saves the cart for an authenticated user or redirects them to login with a callback flow.
4. Once logged in, the cart is synced with the backend and remains available for the user session.
5. At checkout, the user enters delivery details and chooses a payment method.
6. Payment is processed through an external gateway:
   - Paystack for card payments
   - M-Pesa STK push for mobile money payments
7. After verification, an order is created and stored in the database with order items and payment metadata.
8. The user can review their order history and the admin can access order information from a protected dashboard.

## System design principles and how they are applied

This project follows a practical, product-first system design approach:

### 1. Separation of concerns
The codebase is divided into distinct layers:

- UI layer: Next.js App Router pages and React components
- business logic layer: cart, session, order creation, and payment handlers
- API layer: route handlers under app/api
- data layer: Prisma models and PostgreSQL
- infrastructure layer: environment variables for keys and secrets

This keeps checkout, auth, cart, and persistence independent and easier to test and extend.

### 2. Secure-by-default design
The platform treats authentication and payment flows as sensitive areas. It validates inputs server-side, uses signed sessions, hashes passwords with bcrypt, and restricts access to sensitive routes using session checks.

### 3. Single source of truth for user state
Cart and order data are not kept only in browser state. They are persisted through the server and linked to authenticated users. This prevents lost baskets and makes operations consistent across devices and sessions.

### 4. Trust-first commerce UX
The checkout experience is designed to be clear, reassuring, and conversion-ready:

- order summary card
- detailed shipping section
- explicit payment method selection
- verification states and timeout handling
- secure checkout messaging
- confirmation success state

### 5. Product-led, minimal-friction experience
The interface intentionally uses a premium but simple aesthetic and reduces visual clutter so users can focus on product value and trust rather than operational complexity.

### 6. Local payment relevance
Because the target audience is Kenyan, the commerce flow includes M-Pesa, which is widely used and familiar. This reduces friction compared with card-only flows and matches the user's payment behavior.

## Stack and architecture

### Frontend
- Next.js 16
- React 19
- Tailwind CSS
- Framer Motion for animation
- Lucide icons for UI details

### Backend and data
- Next.js API routes
- Prisma ORM
- PostgreSQL
- NextAuth for authentication

### Payment integrations
- Paystack for card processing and verification
- Safaricom Daraja / M-Pesa STK push for mobile money
- local fallback order creation for payment flows

## Data storage model

The database is modeled through Prisma and includes entities for the core commerce system:

- User
- Account
- Session
- VerificationToken
- PasswordResetToken
- Cart
- CartItem
- Order
- OrderItem

Core data relationships:

- a user can have one cart
- a cart has many cart items
- a user can have many orders
- each order contains many order items
- order and cart records are cascade-linked to the user for integrity and cleanup

Important data handling decisions:

- passwords are never stored in plain text
- reset tokens are stored with expiry timestamps
- cart items are saved as structured product entries with quantity and media metadata
- order data retains shipping and payment metadata so support and admin review are possible
- payment references such as M-Pesa checkout IDs and Paystack references are recorded for reconciliation and verification

## Payment methods and flow

### Paystack card payments
The app sends card details to the Paystack API for initialization and payment challenge handling. It supports:

- initial charge request
- OTP submission
- PIN submission
- transaction verification using the returned reference

Once payment is verified, the order is saved with the Paystack reference and the user is redirected to the success state.

### M-Pesa STK push
The app integrates with Safaricom Daraja to initiate an STK push to the customer phone number. The flow includes:

- phone number format normalization to Kenyan format
- OAuth token acquisition from Safaricom
- password and timestamp generation for STK requests
- callback URL configuration for payment completion checks
- polling the status endpoint until the payment resolves

The order is only finalized once the M-Pesa callback or polling status confirms payment success.

### PayPal UI state
A PayPal option is visible in the checkout UI, but the project does not currently include a full PayPal live integration for processing. The current implementation is best understood as a ready UI/purchase flow placeholder rather than a production-validated PayPal backend.

## Security model

This platform takes a practical, defense-in-depth approach to security:

- bcrypt hashing for local passwords
- validation of email and password fields before account creation
- sanitization and validation of cart and order payloads
- NextAuth session protection for authenticated routes
- callback path validation to prevent unsafe redirects
- server-side order creation and cart updates behind user-authentication checks
- reset token expiry and email-based recovery flow
- environment variables for all secret keys and provider credentials
- database cascade rules to reduce orphaned records while keeping related data clean

Important note: card information is not persisted in the local database. The app relies on external payment providers to process sensitive card details and stores only payment references needed for later verification and support.

## Authentication and account flow

The authentication system is built with NextAuth and includes:

- email/password credentials sign-in
- Google OAuth sign-in support
- JWT-based session strategy with a one-week expiration
- user session mapping to database users
- callback path safety for login redirects
- password reset email flow with expiration windows

## Admin capabilities

The platform includes an admin restriction flow using a configured ADMIN_EMAIL value. This prevents general users from accessing internal management screens and keeps operational data private.

## Design language: colors, typography, and animation

### Color palette
The brand uses a restrained, earthy palette consistent with sustainable design:

- deep forest green: #11430F
- soft lime accent: #e4f386
- warm off-white and cream backgrounds
- charcoal and dark gray for readability
- muted natural tones for product cards and surfaces

This palette creates warmth, trust, and a premium eco-luxury feel while keeping the interface usable and calm.

### Typography
The site uses a combination of editorial and utility fonts:

- Geist Sans: used for practical navigation, interface labels, product text, and general readability
- Playfair Display: used for luxury-style headings and the more premium editorial tone
- Great Vibes: available in the app configuration and used to create subtle expressive touches where appropriate

This mix supports the brand position: a premium, intentional product brand with a polished, contemporary editorial look.

### Animation approach
Animation is used to add clarity and a premium feeling without distracting from the purchase flow:

- Framer Motion transitions for checkout option changes and success states
- subtle card hover motions on product and gallery sections
- reveal transitions on landing page content using a custom ScrollReveal component
- soft pulsing and motion accents for eco/brand moments
- CSS transitions for buttons, links, and overlays

The result is a restrained but elegant interface that feels premium while staying fast, clear, and mobile friendly.

## Environment and local setup

To run the project locally, configure the following environment values:

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"

GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

PAYSTACK_SECRET_KEY="..."

MPESA_ENV="sandbox"
MPESA_CONSUMER_KEY="..."
MPESA_CONSUMER_SECRET="..."
MPESA_BUSINESS_SHORT_CODE="..."
MPESA_PASSKEY="..."
MPESA_CALLBACK_URL="http://localhost:3000/api/mpesa/callback"

SMTP_HOST="..."
SMTP_PORT="587"
SMTP_USER="..."
SMTP_PASS="..."
SMTP_FROM="..."
```

Then install and run:

```bash
npm install
npx prisma generate
npm run dev
```

## Run summary

Byk.e is a thoughtful, brand-driven commerce platform that merges sustainable product storytelling with a modern e-commerce flow. It is designed for Kenyan consumers and decision-makers who care about quality, eco-values, simplicity, and reliable local payment experiences. The application is structured around secure commerce practices, accessible product journeys, and a premium visual system that matches the brand promise.

## Project status

This repository represents a functional storefront foundation with live payment flows for Paystack and M-Pesa, user authentication, database persistence, and a scalable Next.js architecture suitable for continued product growth.
