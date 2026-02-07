AI Bike Fit Advisor

A full stack web application that provides personalized bicycle fit recommendations using rider measurements, riding style, flexibility, and common pain points.

Live App: https://ride-fit-ai.vercel.app

API: https://ridefitai-api.onrender.com

Overview

AI Bike Fit Advisor is designed to help cyclists make safe, incremental adjustments to their bike setup without requiring expensive professional equipment.

The application analyzes rider inputs such as:

Height and inseam

Riding style (endurance, performance, etc.)

Flexibility level

Reported discomfort or pain areas

It then returns:

Recommended saddle height and range

Reach and handlebar guidance

Geometry suggestions

Confidence level

Pain specific adjustment insights

A prioritized next adjustment

The goal is not medical diagnosis, but practical, data informed fit guidance.

Why This Project Exists

Bike fit has a direct impact on comfort, performance, and injury prevention, but professional fitting services are not always accessible.

This project demonstrates how software and simple rule based intelligence can:

Translate biomechanical principles into actionable guidance

Provide safe adjustment recommendations

Help riders learn how their position affects comfort and performance

From a development perspective, this project was built to demonstrate real world full stack architecture and deployment.

Educational Value

This project is intentionally structured as a learning resource for students and developers who want to understand:

Full stack architecture (React + FastAPI)

API design and data modeling

Environment based configuration

CORS and cross origin communication

Production deployment using free cloud services

Real world project structure for a portfolio

It can be used to learn:

How frontend and backend communicate

How to deploy a Python API publicly

How to deploy a modern React app

How to manage environment variables

How to structure a practical software project from idea to production

Technology Stack

Frontend

React (Vite)

Bootstrap

Fetch API

Backend

FastAPI

Pydantic

Python

Deployment

Frontend: Vercel

Backend: Render

Features

Rider measurement input

Pain point selection

Rule based fit estimation

Saddle height calculation with range

Position and geometry guidance

Confidence scoring

Prioritized adjustment recommendation

Public API endpoint

Production deployment

Installation (Local Development)

Clone the repository:

git clone https://github.com/sjoin80/RideFitAI.git
cd RideFitAI

Backend
cd backend
python -m venv venv
venv\Scripts\activate  (Windows)
pip install -r requirements.txt
uvicorn main:app --reload


Backend runs at:
http://127.0.0.1:8000

API docs:
http://127.0.0.1:8000/docs

Frontend

Open a new terminal:

cd frontend
npm install
npm run dev


Frontend runs at:
http://localhost:5173

The frontend will automatically connect to the local backend.

Environment Configuration

The frontend uses:

VITE_API_BASE_URL


Examples:

Local:

http://127.0.0.1:8000


Production:

https://ridefitai-api.onrender.com

Educational Use Case

This project is ideal for:

Students learning full stack development

Developers learning FastAPI or React

Portfolio demonstration of deployment skills

Understanding how to turn a concept into a working product

Learning cloud deployment without paid infrastructure

You are encouraged to fork the project and:

Add machine learning models

Add user accounts

Add ride history tracking

Improve the fit logic

Add analytics or monetization features

Disclaimer

This tool provides general bike fit guidance based on common fitting principles. It is not a medical or professional fitting service. Users should make adjustments gradually and consult a professional fitter for persistent pain or complex issues.

Author

Shelby Joiner
Computer Science Student | Full Stack Developer
GitHub: https://github.com/sjoin80
