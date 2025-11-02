💱 Currency Quotes API (USD → ARS / BRL)

This Node.js backend project fetches live USD exchange rates from multiple sources for both ARS (Argentina) and BRL (Brazil).
It automatically refreshes data every 60 seconds and provides REST API endpoints.

------------------------------------------------------------
🚀 Features
------------------------------------------------------------
✅ Fetches real exchange rates from 3 sources per currency (ARS & BRL)

✅ Refreshes automatically every 60 seconds

✅ Stores latest data in a local SQLite database

✅ Provides 3 main API endpoints:

   • /quotes  → list of all fetched rates
   
   • /average → average buy/sell price
   
   • /slippage → % difference from the average

------------------------------------------------------------
⚙️ Tech Stack
------------------------------------------------------------
• Node.js + Express

• Axios + Cheerio for web scraping

• SQLite3 for caching recent quotes

• Deployed on Render

------------------------------------------------------------
🧩 Project Setup
------------------------------------------------------------

1️⃣ Clone the repository

git clone https://github.com/<your-username>/currency-backend.git

cd currency-backend

2️⃣ Install dependencies

npm install

3️⃣ Run the server locally

npm start

The API will start on: http://localhost:3000


------------------------------------------------------------
📡 API Endpoints
------------------------------------------------------------
All endpoints accept a query parameter: currency=ARS or BRL

🟢 Get quotes

GET /quotes?currency=ARS

GET /quotes?currency=BRL

Response:
[
  {
    "source": "https://www.dolarhoy.com",
    "buy_price": 1425,
    "sell_price": 1445,
    "fetched_at": "2025-11-02T06:46:54.912Z"
  }
]

🟠 Get average

GET /average?currency=ARS

Response:
{
  "average_buy_price": 1427.3,
  "average_sell_price": 1446.2
}

🔵 Get slippage

GET /slippage?currency=ARS

Response:
[
  {
    "source": "https://www.dolarhoy.com",
    "buy_price_slippage": 0.004,
    "sell_price_slippage": -0.006
  }
]

------------------------------------------------------------
🧠 Data Refresh Policy
------------------------------------------------------------
• The backend refreshes quotes every 60 seconds automatically.

• The fetched_at timestamp (UTC) shows when data was last updated.

• SQLite keeps only the most recent values for each currency.

------------------------------------------------------------
🧪 How to Test
------------------------------------------------------------

🔸 Using Postman:

1. Open Postman.

2. Create a new GET request.

   Example:

   https://currency-api.onrender.com/quotes?currency=ARS

4. Click SEND.

5. You’ll see live JSON output.

You can save these as a collection for easy testing.

🔸 Using cURL (Command Line):

Get quotes:

curl https://currency-api.onrender.com/quotes?currency=ARS

Get average:

curl https://currency-api.onrender.com/average?currency=BRL

Get slippage:

curl https://currency-api.onrender.com/slippage?currency=ARS

Example output:
[
  {
    "source": "https://www.dolarhoy.com",
    "buy_price_slippage": 0.004,
    "sell_price_slippage": -0.006
  }
]

------------------------------------------------------------
🕓 Time Format
------------------------------------------------------------
All timestamps use UTC (Coordinated Universal Time).
For India (IST), add +5 hours 30 minutes.

Example:
2025-11-02T06:46:54.912Z = 2025-11-02 12:16:54 PM IST

------------------------------------------------------------
✅ Summary
------------------------------------------------------------
Feature            | Status
------------------ | ---------------------
Auto Refresh       | ✅ Every 60 seconds
API Hosted         | ✅ Render
Frontend Required  | ❌ Not required
Database           | ✅ SQLite3 (auto-created)

------------------------------------------------------------
Author: Rahul Somangoudar
Deployment URL: (https://currency-api-tbtf.onrender.com/quotes?currency=BRL)
------------------------------------------------------------
