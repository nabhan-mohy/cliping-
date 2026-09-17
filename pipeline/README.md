# ClipRewards - Local AI Pipeline & Docker Guide

This directory contains the background AI processing pipeline for the **ClipRewards** application. It allows you to run local Whisper transcription, FFmpeg 9:16 vertical video reframing, and virality moment detection completely offline and free.

## Architecture

```
User (Browser) ──> Web App (React + Express :3000) ──> AI Worker (FastAPI :8000)
                                                              │
                                            ┌─────────────────┴─────────────────┐
                                            ▼                                   ▼
                                       Whisper Model                        FFmpeg Engine
                                 (Local Audio to JSON)                  (9:16 Reframe & Export)
```

## Quick Start (Docker Compose)

To start both the web application and the Python AI pipeline on your local machine:

```bash
cd pipeline
docker-compose up --build
```

- Web App: `http://localhost:3000`
- AI Worker Docs (Swagger): `http://localhost:8000/docs`

## Manual Local Setup (Without Docker)

### 1. Requirements
- Python 3.10+
- FFmpeg installed (`brew install ffmpeg` on macOS or `sudo apt install ffmpeg` on Ubuntu)

### 2. Setup Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Run the AI Pipeline
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
