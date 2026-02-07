# 🚴 AI Bike Fit Advisor

**Smart bike fit guidance powered by data and full-stack engineering**

[Live App](https://ride-fit-ai.vercel.app) • [API Docs](https://ridefitai-api.onrender.com/docs)

---

![React](https://img.shields.io/badge/Frontend-React%20(Vite)-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)
![Deployment](https://img.shields.io/badge/Deployed-Vercel%20%7C%20Render-black)
![Status](https://img.shields.io/badge/Status-Live-success)

---

## Overview

**AI Bike Fit Advisor** helps cyclists make safe, incremental adjustments to their bike setup using rider measurements, riding style, flexibility, and common pain points.

The application translates real bike-fit principles into practical recommendations without requiring expensive professional equipment.

This project demonstrates a complete **full-stack production workflow** from development to cloud deployment.

---

## What It Does

The app analyzes:

- Height and inseam  
- Riding style (endurance, performance, etc.)  
- Flexibility level  
- Reported pain or discomfort  

It returns:

- Recommended saddle height (with range)
- Reach and handlebar guidance
- Bike geometry suggestions
- Confidence level
- Pain-specific adjustment insights
- A prioritized next adjustment

**Goal:** Practical guidance — not medical diagnosis.

---

## Why This Project Matters

Bike fit directly affects comfort, efficiency, and injury prevention. However, professional fitting services are not always accessible.

This project shows how software can:

- Translate biomechanics into actionable guidance  
- Provide safe, structured adjustments  
- Help riders understand how position affects performance  

From a development perspective, it demonstrates how to take an idea and ship a **real, public product**.

---

## Educational Purpose

This repository is designed as a learning resource for:

- Full-stack development (React + FastAPI)
- API design and data modeling
- Environment configuration
- CORS and cross-origin communication
- Cloud deployment using free services
- Production architecture for portfolio projects

Great for students or developers who want to learn how to go from **local project → live application**.

---

## Tech Stack

**Frontend**
- React (Vite)
- Bootstrap
- Fetch API

**Backend**
- FastAPI
- Pydantic
- Python

**Deployment**
- Vercel (Frontend)
- Render (Backend)

---

## Live Demo

Frontend  
https://ride-fit-ai.vercel.app

Backend  
https://ridefitai-api.onrender.com

API Documentation  
https://ridefitai-api.onrender.com/docs

---

## Running Locally

### Clone

```bash
git clone https://github.com/sjoin80/RideFitAI.git
cd RideFitAI
```

---

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at  
http://127.0.0.1:8000

Docs  
http://127.0.0.1:8000/docs

---

### Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at  
http://localhost:5173

---

## Environment Variables

Frontend uses:

```
VITE_API_BASE_URL
```

Local:
```
http://127.0.0.1:8000
```

Production:
```
https://ridefitai-api.onrender.com
```

---

## Ideas for Extension (Educational)

- Add machine learning fit predictions
- User accounts and saved fits
- Ride history tracking
- Analytics dashboard
- Mobile optimization
- Stripe integration for paid fits

---

## Disclaimer

This tool provides general bike fit guidance based on common fitting principles. It is not a medical or professional fitting service. Adjust gradually and consult a professional fitter for persistent pain.

---

## Author

**Shelby Joiner**  
Computer Science Student | Full-Stack Developer  

GitHub: https://github.com/sjoin80
