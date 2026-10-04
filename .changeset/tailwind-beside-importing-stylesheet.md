---
"@shadcn/lint": patch
---

Find Tailwind beside the stylesheet that imports it. In a workspace where the app's stylesheet imports a design system package's stylesheet and only that package depends on `tailwindcss`, `no-unknown-classes` no longer needs `tailwindcss` installed in the app as well.
