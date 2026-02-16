# Specification

## Summary
**Goal:** Add an admin-only product upload and management panel to create, edit, and delete catalog products, including product images via URL or file upload.

**Planned changes:**
- Add a new admin route (e.g., `/admin/products`) via TanStack Router and a visible admin entry point that is conditionally shown based on an admin check.
- Build an admin product list UI with Create, Edit, and Delete actions.
- Implement Create/Edit product forms with fields: name, description, price, category, sizes, colors, and image.
- Support product images via either an image URL input or a file picker that converts the file to a data URL, with an in-form preview before saving.
- Add backend support for (1) checking whether the caller is an admin and (2) persisting product create/update/delete operations.
- Add React Query mutation hooks for add/update/delete and ensure product list queries are invalidated/refetched after successful mutations; show an English error message on failures.
- Guard admin page access so non-admin users see a clear English restriction message and cannot perform product changes.

**User-visible outcome:** Admin users can manage the VUURIX product catalog from an admin page (including adding product photos via URL or file upload with preview), while non-admin users are blocked with an access-restricted message.
