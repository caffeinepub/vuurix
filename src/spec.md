# Specification

## Summary
**Goal:** Deliver a fashion e-commerce MVP for “VUURIX” with a polished storefront UI, backend product/order APIs, and end-to-end shopping flow from browsing to order confirmation.

**Planned changes:**
- Build core storefront pages: Home (hero + featured), Shop/product listing with category filtering, Product Detail (images, price, description, selectable size/color when available), Cart, and Checkout.
- Implement a single Motoko canister with product and order data models and APIs: list products, fetch product by ID, create order (from cart + shipping info) returning an order ID, and fetch order by ID; persist orders in stable storage.
- Connect frontend to backend using React Query for product list/detail and order creation, including visible loading and error states.
- Apply a consistent fashion-forward theme (English UI text, monochrome/cream with high-contrast accents; avoid blue/purple by default) across all pages and components.
- Add and reference generated static assets from `frontend/public/assets/generated`: VUURIX logo, homepage hero banner, and product placeholder images for items without custom images.

**User-visible outcome:** Users can browse VUURIX products, filter by category, view product details and variants, add items to a cart, complete a validated checkout form, place an order, and see an order confirmation with an order ID.
