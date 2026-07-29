# Frontend API Integration Documentation
**Project:** RentNest Frontend

## Overview
This document serves as the integration mapping between the Next.js App Router frontend components and the required backend endpoints as specified by Assignment 5.

## Public Endpoints
| Frontend Route | Next.js Component | Backend Endpoint | Method | Purpose |
|----------------|-------------------|------------------|--------|---------|
| `/` | `app/(publicGroup)/page.tsx` | `/api/properties` | `GET` | Fetches featured properties for the Hero/Featured sections. |
| `/properties` | `app/(publicGroup)/properties/page.tsx` | `/api/properties`, `/api/categories` | `GET` | Searches and filters through properties based on query params. |
| `/properties/[id]` | `app/(publicGroup)/properties/[id]/page.tsx`| `/api/properties/:id` | `GET` | Loads individual property details, landlord info, images. |

## Authentication
| Frontend Route | Next.js Component | Backend Endpoint | Method | Purpose |
|----------------|-------------------|------------------|--------|---------|
| `/auth/register`| (Auth Flow) | `/api/auth/register` | `POST` | Registers a tenant, landlord, or admin. |
| `/auth/login` | (Auth Flow) | `/api/auth/login` | `POST` | Authenticates User and responds with JWT matching role. |

## Role-based Dashboard Interactions
| Role / Component | Route | Backend Endpoint | Method | Purpose |
|------------------|-------|------------------|--------|---------|
| **Tenant** | `/dashboard/tenant` | `/api/rentals`, `/api/payments` | `GET` | Retrieve past requests and payment history. |
| **Tenant Payment** | `/dashboard/tenant/requests/[id]/pay`| `/api/payments/create` | `POST` | Initiate payment gateway logic via Stripe/SSLCommerz. |
| **Landlord** | `/dashboard/landlord` | `/api/landlord/properties` | `GET` | Fetch all properties listed by this landlord. |
| **Landlord Action**| `/dashboard/landlord/requests` | `/api/landlord/requests/:id`| `PATCH` | Approve or Reject a specific tenant rental request. |
| **Admin** | `/dashboard/admin` | `/api/admin/users`, `/api/admin/stats` | `GET` | Overview of platform analytics and user moderation. |

> Note: All authenticated requests attach the JWT Token (usually automatically via middleware or Axios Interceptors). Wait states and toast error boundaries manage API faults gracefully on the client.
