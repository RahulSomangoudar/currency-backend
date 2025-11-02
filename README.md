
# Currency Quotes API (USD → ARS / BRL)

This Node.js project fetches USD exchange quotes from 3 sources per currency (ARS and BRL),
keeps them refreshed every 60 seconds, and exposes three endpoints:

- `GET /quotes?currency=ARS|BRL` — returns array of quotes from the three sources
- `GET /average?currency=ARS|BRL` — returns average buy/sell
- `GET /slippage?currency=ARS|BRL` — returns slippage of each source vs average

## How to run locally

1. Extract the zip and open a terminal in the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Server runs on port 3000 by default. Examples:
   - `http://localhost:3000/quotes?currency=ARS`
   - `http://localhost:3000/average?currency=BRL`
   - `http://localhost:3000/slippage?currency=ARS`

## Deploy

You can deploy to Render, Heroku, Railway or any Node.js host. Make sure to set the start command to `npm start`.
If using Docker, build and run using the included `Dockerfile`.

## Notes

- The scraping code uses `axios` + `cheerio`. Site HTML may change; if a parser breaks, check the corresponding fetcher file in `src/fetchers/`.
- The app caches data in an SQLite file `db.sqlite`. It refreshes automatically every 60 seconds.
