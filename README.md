This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Digital Business Card Scanner

A modern digital business card scanner application with shopping list management functionality.

### Features
- 🎴 Interactive digital business card with flip animation
- 📱 Responsive design for mobile and desktop
- 🛒 Comprehensive shopping list management system
- 📊 CSV export functionality for shopping data
- 🎨 Modern UI with gradient backgrounds and smooth animations

### Available Routes
- `/` - Main business card page with flip animation
- `/shoplist` - Hidden comprehensive shopping list management system (consolidated from previous grocery-list)
- `/woolworths-receipt` - Woolworths Mt Eden receipt data
- `/paknsave-receipt` - PAK'nSAVE Royal Oak receipt data

> **Note:** The `/shoplist` route is a shortened path for the shopping list management system. It's not linked from the business card UI but can be accessed directly.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
