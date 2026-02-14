# Specification

## Summary
**Goal:** Build a minimalist, premium monochrome BLAK e-commerce experience with a parallax-driven Home page, Shop with filters/sorting, persistent Cart, validated Checkout with backend order creation, and an admin interface for product/inventory/image management.

**Planned changes:**
- Apply a site-wide BLAK visual system (black/white/light-gray palette, modern sans-serif typography, editorial spacing, subtle micro-interactions, accessible focus states).
- Create routes/pages: Home, Shop (Inventory), Cart, Checkout, Contact; add sticky top navigation (BLAK wordmark left; Home/Shop/Cart right) and footer links (Home/Shop/Cart/Contact) with social icons.
- Implement Home page structure: full-screen parallax hero with CTA, 2–3 alternating parallax editorial sections with fade-in-on-scroll, featured collection grid (3–4 products) with hover effects and “View All” link, About/Brand section, monochrome footer.
- Implement Shop page: responsive product grid; filters for Category and Size; sorting by Price (Low→High) and Newest; product cards with hover-revealed Add to Cart (desktop) and always-accessible Add to Cart on mobile.
- Build frontend cart system: add/remove items, quantity controls, selected size, subtotal/shipping/total summary, “Proceed to Checkout” gated by non-empty cart; persist cart across reloads.
- Build Checkout page: Shipping + Billing forms, payment method selection (Credit Card/Apple Pay/PayPal UI-only), Order Summary panel, required-field validation, “Complete Order” CTA.
- Implement backend order placement: create order record with line items, totals, shipping method, and checkout details (excluding sensitive card data); on success show confirmation and clear persisted cart.
- Implement backend product management in a single Motoko actor: product CRUD, stock/inventory, category + available sizes, image upload/storage/retrieval; add an admin UI to manage products and inventory.
- Add performance/SEO basics: responsive/optimized images, per-page title/description metadata, smooth scrolling animations (parallax restricted to Home only).
- Add generated black-and-white fashion photography assets under `frontend/public/assets/generated` and use them for Home backgrounds and as product placeholders until admin uploads exist.

**User-visible outcome:** Users can browse a monochrome BLAK storefront, filter/sort products, add items to a persistent cart, complete a validated checkout that creates an order and shows confirmation, and admins can manage products, inventory, and product images from the browser.
