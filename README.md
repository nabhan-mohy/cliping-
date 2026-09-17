# ClipRewards - AI Clipping & Campaign Tool

AI-powered short-form video clipping tool tailored for Content Rewards, virality scoring, multi-aspect ratio rendering, and campaign payout tracking.

---

## 🚀 Quick Start

You can run and test the complete web app, video editor, and clipping engine locally on **Windows** or **macOS/Linux** in under 2 minutes.

### 🪟 Windows Setup Guide (PowerShell / Command Prompt)

1. **Extract the ZIP**:
   - Right-click `cliprewards---ai-clipping-&-campaign-tool.zip` in Windows File Explorer.
   - Click **"Extract All..."** and choose a folder (e.g. `C:\Projects\cliprewards`).

2. **Open PowerShell or Terminal in that folder**:
   - Open PowerShell or Windows Terminal, and `cd` into the folder:
     ```powershell
     cd path\to\extracted-folder
     ```
   - *Tip:* You can also open the folder in File Explorer, type `powershell` or `cmd` in the top address bar, and press Enter!

3. **Install Dependencies**:
   ```powershell
   npm install
   ```

4. **(Optional) Configure `.env`**:
   In PowerShell:
   ```powershell
   Copy-Item .env.example .env
   ```
   (Or in Command Prompt: `copy .env.example .env`)
   Open `.env` in Notepad and add your Gemini API key if you have one:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```
   *(Note: If you don't configure an API key, the app still works completely offline using the built-in local heuristics engine!)*

5. **Run the App**:
   ```powershell
   npm run dev
   ```
   Open **`http://localhost:3000`** in Chrome, Edge, or any browser.

---

### 🍎 macOS / Linux Setup Guide
```bash
unzip "cliprewards---ai-clipping-&-campaign-tool.zip"
cd cliprewards---ai-clipping-&-campaign-tool
npm install
cp .env.example .env
npm run dev
```

---

## 🧪 What to Test in the App

1. **Clip Generation**:
   - On the homepage, paste any YouTube/Drive video link, or click one of the verified presets (e.g. **Oz Ali 8-Figure Ecom Blueprint** or **Alex Hormozi 100M Leads**).
   - Click the **"Generate Clips"** button (or **"Preferences"** to customize duration, aspect ratio, or caption style).
   - Watch the animated **AI Processing Pipeline** (Audio Extraction → Transcription → Virality Scoring → 9:16 Reframing).
   - The view will automatically scroll down to the generated clips gallery!

2. **9:16 Vertical Video Editor**:
   - Select any generated clip card (ranked with 96/100, 92/100, 89/100 virality scores).
   - Press **Play** in the 9:16 phone simulator to see animated word-by-word synchronized captions with emojis and top hook banners.
   - Adjust the **Speaker Crop Offset** slider to pan left/center/right.
   - Edit the hook headline banner or click any word in the transcript to edit it in real-time.
   - Click **"Download 1080p MP4"** to test simulated video compilation.

3. **Content Rewards Campaign Tracker**:
   - Switch to the **Campaigns & Bounties** tab to view active creator pools, CPM payout tiers, and link-in-bio rules.
   - Switch to **Earnings & Payouts** to simulate live post views and track dollar rewards accumulating.

---

## 🐳 Optional: Local Python Whisper Pipeline (Docker)

If you want to run the offline Whisper transcription & FFmpeg microservice alongside the app:

```bash
cd pipeline
docker-compose up --build
```
- Web Application: `http://localhost:3000`
- FastAPI Whisper Worker Docs: `http://localhost:8000/docs`

---

## 📦 Production Build

To test the production build:
```bash
npm run build
npm run start
```
