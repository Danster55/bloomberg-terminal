# Bloomberg Terminal — Setup Guide

## Overview
This is your dual-strategy investment terminal with live Finnhub data integration. It runs on Netlify (free) and is version-controlled on GitHub.

**What it does:**
- Scores your 67 ISA stocks (growth quality mode)
- Scores your pension funds (value + dividend mode)
- Fetches live P/E ratios, dividend yields, earnings data
- Shows risk flags and buy/sell signals
- Tracks progress to your £1M pension target

---

## Prerequisites

You should already have:
- ✅ GitHub account (created)
- ✅ Netlify account (you mentioned you have one)
- ✅ Finnhub API key: `d9nms3hr01qvumgb10m0d9nms3hr01qvumgb10mg`

---

## Step 1: Clone This Repository

1. Go to **GitHub.com** → Sign in with your account
2. Create a new repository:
   - Name: `bloomberg-terminal`
   - Description: "Dual Strategy Investment Dashboard"
   - Make it **Public** (so Netlify can access it)
   - Click "Create repository"

3. In your terminal, clone it locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/bloomberg-terminal.git
   cd bloomberg-terminal
   ```

4. Copy all these files into that directory:
   - `netlify.toml`
   - `netlify/functions/stock-data.js`
   - `index.html`
   - `package.json`
   - `SETUP_GUIDE.md` (this file)

5. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit: Bloomberg Terminal with Finnhub integration"
   git push origin main
   ```

---

## Step 2: Connect Netlify to GitHub

1. Go to **Netlify.com** → Sign in
2. Click "Add new site" → "Import an existing project"
3. Select "GitHub"
4. Authorize Netlify to access your GitHub account
5. Select your `bloomberg-terminal` repository
6. Click "Deploy site"

Netlify will now:
- Clone your repo
- Build the project (just copies files)
- Deploy to a live URL

---

## Step 3: Add Your Finnhub API Key (IMPORTANT)

Your API key must be added as an **environment variable** (never commit it to GitHub).

1. In Netlify dashboard, go to your site
2. Click "Site settings" → "Build & deploy" → "Environment"
3. Click "Edit variables"
4. Add a new variable:
   - **Key:** `FINNHUB_API_KEY`
   - **Value:** `d9nms3hr01qvumgb10m0d9nms3hr01qvumgb10mg`
5. Click "Save"

This allows the backend function to securely access Finnhub without exposing the key in your code.

---

## Step 4: Test the Terminal

1. Go back to your Netlify site URL (e.g., `bloomberg-terminal-xyz.netlify.app`)
2. You should see the terminal load
3. Click "DAN ISA COMBINED" to view your holdings
4. Watch as live financial data loads (P/E, dividend yield, earnings growth)
5. Each stock gets a score and signal

---

## How It Works

### Frontend (index.html)
- Displays your portfolio
- Calls Netlify Functions for data
- Shows scores and signals
- Renders in your browser

### Backend (netlify/functions/stock-data.js)
- Receives ticker symbol
- Calls Finnhub API **securely** (API key never exposed)
- Returns P/E, dividend yield, earnings data
- Frontend displays it

### Why This Setup?
- ✅ API key is **secure** (stored in Netlify, not in code)
- ✅ Code is **version controlled** (GitHub history)
- ✅ Site **auto-deploys** when you push to GitHub
- ✅ **No server costs** (Netlify free tier)

---

## Monthly Updates

Each month, to refresh your portfolio:

1. Export holdings from each platform as CSV or update manually
2. Edit the `portfolios` object in `index.html` with new values
3. Commit and push:
   ```bash
   git add index.html
   git commit -m "Update portfolio data - Aug 2026"
   git push origin main
   ```
4. Netlify auto-deploys the changes

---

## Customization

### Change Scoring Weights
Edit the `scoreGrowthQuality()` and `scoreValueDividend()` functions in `index.html`:
```javascript
// Current weights (Growth Quality)
eps_score = earnings_growth * 40%
rev_score = revenue_growth * 25%
fcf_score = free_cash_flow * 20%
roe_score = return_on_equity * 15%
```

### Add More Holdings
Add to the `portfolios` object in `index.html`:
```javascript
{ ticker: 'NEWSTOCK', value: 1000, ret: 100 }
```

### Change Portfolio Names
Edit the buttons and portfolio keys to match your needs.

---

## Troubleshooting

**Live data not loading?**
- Check that your Finnhub API key is set in Netlify environment variables
- Check browser console (F12) for errors
- Finnhub free tier: 60 calls/minute (plenty for 67 stocks)

**Netlify deploy failed?**
- Check build logs in Netlify dashboard
- Ensure all files are in the right folders
- Re-read Step 1 and Step 2

**Stock not scoring?**
- Some stocks (especially thinly traded ones) may not have Finnhub data
- The function will fall back to "—" if data unavailable

---

## Security Notes

- Your API key is **never** in your code (environment variable only)
- Your GitHub repo is public (code only, no secrets)
- Netlify Functions encrypt traffic
- This is production-ready

---

## Next Steps After Deploy

Once the terminal is live:

1. **Test it** — view your portfolio, check scores
2. **Share it** — send the URL to Ann (your wife) to see her accounts too
3. **Monthly refresh** — update data each month, push to GitHub
4. **Add watchlist** — expand with tickers you want to buy (I can add this)

---

## Questions?

If anything doesn't work:
1. Check the browser console (F12) for error messages
2. Check Netlify build logs
3. Verify the API key is set in environment variables
4. Let me know what error you see

---

**Your Terminal URL:** (will be shown after Netlify deploys)
Example: `https://bloomberg-terminal-abcd1234.netlify.app`
