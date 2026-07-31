# RentNest Frontend 🏠
> "Find & List Rental Properties with Ease"

RentNest is a modern, fast, and responsive Next.js application built for a rental property marketplace. It provides tailored experiences for three key roles: Tenants (browsing, booking, paying), Landlords (listing properties, approving applications), and Admins (moderating users and listings).

---

## 🌟 Key Features

## live Link : https://rennest-forntent.vercel.app/
## Git Repo : https://github.com/mdratul4505/RentNest-Rental-Property-Management-Frontend-System.git
## Backend Repo : https://github.com/mdratul4505/RentNest-Rental-Property-Management-Backend-System.git

### 1. Role-Based Navigation & Dashboards
The application dynamically adapts its layouts, sidebars, and actions based on the authenticated user's role (Tenant, Landlord, or Admin). Protected routes are strictly guarded at the server level using Next.js Edge Middleware (`proxy.ts`).

### 2. Public Property Marketplace
- **Interactive Grid:** Optimized image loader (`next/image`) with details on prices, locations, and amenities.
- **Advanced Filters:** Search and filter listings by location, price range, property type, and categories in real-time.
- **Details Page:** Expanded property listings including images, descriptions, categories, landlord information, and direct "Request to Rent" triggers.

### 3. Tenant Workflows
- **Application Submission:** Choose move-in dates and request rentals directly from landlords.
- **Stripe Checkout Integration:** Complete secure credit/debit card payments via Stripe Elements inside approved rental workflows.
- **Reviews & Feedback:** Leave star ratings and commentary on properties once a rental booking becomes active.

### 4. Landlord Controls
- **Property Management:** Forms to create, edit, and toggle availability of rental properties.
- **Request Approval:** Approve or Reject tenant rent requests in real-time with instant toast notifications.

### 5. Admin Moderation
- **User Management:** Data tables with ban/unban controls to suspend violating accounts.
- **Overview Stats:** View platform health statistics, global properties, and requests.

### 6. Theme Switching & Animations
- **Light/Dark Mode:** Toggle class-based themes from the navbar with automatic system-preference detection and persistence via `localStorage`.
- **Framer Motion Animations:** Smooth staggered scroll entries, spring-loaded sliding tab elements, and hover lift effects across components.

---

## 🛠️ Technology Stack

- **Core Framework:** Next.js (App Router, Turbopack, Server Actions)
- **Styling:** Tailwind CSS , ShadCN & Radix UI primitives 
- **Animations:** Framer Motion
- **Payment Gateway:** Stripe (`@stripe/stripe-js`, `@stripe/react-stripe-js`)
- **Forms & Validation:** React Hook Form & Zod
- **Icons:** Lucide React
- **Notifications:** Sonner Toast

---

## 🔑 Default Test Accounts

Use these pre-seeded accounts to test specific roles (ensure backend database is seeded):

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@rentnest.com` | `AdminRentNest2026!` |
| **Landlord** | `landlord@rentnest.com` | `Landlord123!` |
| **Tenant** | `tenant@rentnest.com` | `Tenant123!` |

---

## 🚀 Getting Started

### 1. Installation

Install project dependencies using `pnpm` (configured workspace):
```bash
pnpm install
```

### 2. Environment Variables

Create a `.env` file at the root of the frontend directory:
```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000
BACKEND_API_URL=http://localhost:5000
JWT_ACCESS_SECRET=super_secret_key_access_987654321_rentnest
JWT_REFRESH_SECRET=super_secret_key_refresh_123456789_rentnest
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 3. Running Development Server

Start the application on port `3000`:
```bash
pnpm dev
```

### 4. Production Build

Verify TypeScript type-safety and compile the build:
```bash
pnpm build
pnpm start
```
