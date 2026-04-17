# ⚔ The Rivalry — Setup & Deploy Guide

A weekly goal competition app for Jacob & Gabby. Built with vanilla JS + HTML, Supabase backend, deployed on Cloudflare Pages.

---

## Step 1: Supabase Setup

1. Go to https://supabase.com and create a new project (or use your existing Hotel Warrior project — just add the new tables to it)
2. In the SQL Editor, run the entire contents of `schema.sql`
3. Go to **Project Settings → API** and copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon / public key**

---

## Step 2: Add Your Credentials

Open `js/config.js` and replace the placeholders at the top:

```js
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

---

## Step 3: Deploy to Cloudflare Pages

Same process as Hotel Warrior:

1. Push this folder to a GitHub repo (e.g. `the-rivalry`)
2. Go to https://dash.cloudflare.com → **Workers & Pages → Create → Pages**
3. Connect your GitHub repo
4. Build settings:
   - **Framework preset**: None
   - **Build command**: *(leave blank)*
   - **Build output directory**: `/` (root)
5. Click **Save and Deploy**

Your site will be live at `https://the-rivalry.pages.dev` (or your custom domain).

---

## How It Works

### Weekly Flow
- **Monday**: Both Jacob and Gabby go to their pages and set 2 goals for the week
- **Mon–Fri**: Each person checks off their daily goals (2 checkboxes per day = 2 pts/day = 10 pts max/week)
- **Friday evening**: Head to the Arena page — if it's end of week, a "Lock In Results" banner appears
- Click it to save the winner and update the all-time record

### Scoring
- 2 goals × 5 days = **10 points max per week**
- Higher score wins; ties are recorded as ties
- All-time record tracks W-L-T for each player

### Pages
- **Arena** (`index.html`) — Live scoreboard, current week comparison, daily grid overview
- **Jacob** (`pages/jacob.html`) — Jacob's goals, daily checkins, his personal record
- **Gabby** (`pages/gabby.html`) — Gabby's goals, daily checkins, her personal record  
- **History** (`pages/history.html`) — All-time record, stats, win share bar, full week-by-week table

---

## File Structure

```
rivalry/
├── index.html          ← Arena / Competition page
├── css/
│   └── style.css       ← All styles
├── js/
│   └── config.js       ← Supabase config + shared utilities
├── pages/
│   ├── jacob.html
│   ├── gabby.html
│   └── history.html
└── schema.sql          ← Run this in Supabase SQL Editor
```
