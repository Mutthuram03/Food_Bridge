# FoodBridge

## Dev

- Install: `npm install`
- Run frontend + backend together: `npm run dev:full`
  - Frontend: http://localhost:5173
  - Backend health: http://localhost:5173/health (proxied)

## Seeded demo logins

Password for all demo accounts: `test123`

- Restaurant: `hotel@test.com`
- Volunteer: `volunteer@test.com`
- Shelter: `shelter@test.com`

## Ranade font

Put your Ranade `.woff2` files in `public/fonts/`:
- `Ranade-Regular.woff2` (400)
- `Ranade-Medium.woff2` (500)
- `Ranade-Bold.woff2` (700)

If your files have different names/weights, update `src/index.css`.
