# Ayusydah — Health Supplement E-Commerce Store

A modern, responsive e-commerce frontend for Ayusydah, a natural wellness supplement brand. Built with React and Tailwind CSS.

## Tech Stack

- **React 18** (Vite)
- **Tailwind CSS v4** — utility-first styling with custom brand color tokens
- **React Router** — client-side routing
- **Lucide React** + **React Icons** — iconography

## Features

- Sticky header with mega navigation (hover dropdowns with category images)
- Auto-rotating hero banner slider
- Product cards with ratings, discount badges, and cart/wishlist actions
- Responsive design (mobile hamburger menu, adaptive grids)
- Newsletter signup, testimonial slider, brand carousel
- Cookie consent banner

## Project Structure

\`\`\`
src/
  components/
    layout/     → Header, Footer, PromoBar, UtilityBar
    product/    → ProductCard
    category/   → CategoryCard
    ui/         → PromoBanner, CookieBanner
  sections/     → HeroSlider, BestSellers, Testimonials, etc.
  data/         → Mock JSON data (products, categories, brands, testimonials)
  pages/        → Home
\`\`\`

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit \`http://localhost:5173\`

## Notes

This is currently a frontend-only build using mock JSON data — no backend/database is connected yet.