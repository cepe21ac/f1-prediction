# Apex Predict

F1 qualifying second-stint predictor. Companion website to the [F1 Qualifying Predictor R model](https://github.com/cepe21ac/f1-qualifying-predictor) by Cesare Pesci.

Enter driver, session, circuit, conditions, tyre compound, tyre status, and first stint time — get a predicted second stint lap time. Client-side JavaScript port of the R model.

---

## How to deploy this (first time — read all the way through)

You'll need three things: Node.js on your laptop, a GitHub account (you already have one — `cepe21ac`), and a Vercel account (free, connect it to GitHub). Total time: ~30 minutes if it's your first deploy.

### Step 1 — Install Node.js (once, ~5 min)

**On Mac:** Easiest is via [nodejs.org](https://nodejs.org/) — download the LTS installer, run it, done. Or if you have Homebrew: `brew install node`.

**On Windows:** Same — [nodejs.org](https://nodejs.org/) LTS installer.

Verify it worked: open Terminal (Mac) or PowerShell (Windows), type:
```
node -v
npm -v
```
Both should print version numbers.

### Step 2 — Get this project onto your laptop (~2 min)

Unzip this folder anywhere on your computer. In Terminal/PowerShell, `cd` into the folder:
```
cd path/to/apex-predict-site
```

### Step 3 — Install dependencies and test locally (~3 min)

```
npm install
npm run dev
```

The second command will print something like `Local: http://localhost:5173/`. Open that in your browser. You should see the site running locally. If it works here, it'll work in production.

Kill the local server with `Ctrl+C` when done testing.

### Step 4 — Push to GitHub (~5 min)

Create a new repository on GitHub called `apex-predict` (or whatever you want). **Do not initialize it with a README, .gitignore, or license** — leave it empty.

Then in your terminal, from inside the project folder:
```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/cepe21ac/apex-predict.git
git push -u origin main
```

Replace `apex-predict` in the URL with whatever you named the repo.

### Step 5 — Deploy on Vercel (~5 min)

1. Go to [vercel.com](https://vercel.com/) and sign up (use "Continue with GitHub" — much easier).
2. Once in, click **Add New → Project**.
3. Vercel will show your GitHub repos. Find `apex-predict` and click **Import**.
4. Framework Preset should auto-detect as **Vite** — leave everything else at defaults.
5. Click **Deploy**.

30-60 seconds later, Vercel gives you a URL like `apex-predict-cesare.vercel.app`. That's your live site. Share the URL with anyone.

### Step 6 — (Optional) Custom domain (~15 min)

If you buy a domain like `apexpredict.com` from [Namecheap](https://www.namecheap.com/) or [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) (~$10/year), you can point it at your Vercel project via **Settings → Domains** in the Vercel dashboard. Follow their instructions to update your DNS. Takes 5-30 minutes for DNS to propagate.

### Making changes later

Edit `src/App.jsx` locally, test with `npm run dev`, then push:
```
git add .
git commit -m "Description of change"
git push
```

Vercel auto-deploys on every push. Live site updates in ~30 seconds.

---

## Tech stack

- **React 18** — UI
- **Vite** — build tool + dev server
- **Tailwind CSS 3** — styling
- **Vercel** — hosting

No backend. All prediction logic runs in the user's browser.

---

## Credit

Model by [Cesare Pesci](https://github.com/cepe21ac). MIT license.
