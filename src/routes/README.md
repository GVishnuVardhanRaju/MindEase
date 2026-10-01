# Client Routes

TanStack Router's Vite plugin generates the route tree from this directory.
Every route module is rendered client-side; `src/routes/__root.tsx` provides the
shared application layout. The HTML document and React mount live in the root
`index.html` and `src/main.tsx` files.

## Conventions

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `about.tsx` | `/about` |
| `users/index.tsx` | `/users` |
| `users/$id.tsx` | `/users/:id` (dynamic — bare `$`, no curly braces) |
| `posts/{-$category}.tsx` | `/posts/:category?` (optional segment) |
| `files/$.tsx` | `/files/*` (splat — read via `_splat` param, never `*`) |
| `_layout.tsx` | layout route (renders children via `<Outlet />`) |
| `__root.tsx` | app shell — wraps every page; preserve `<Outlet />` |

`src/routeTree.gen.ts` is auto-generated. Don't edit it by hand.
