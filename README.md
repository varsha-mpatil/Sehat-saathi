# Sehat Saathi - Rural Healthcare Platform

Sehat Saathi is an Indian digital healthcare platform designed to bridge the gap between rural patients and quality healthcare.

## 🚀 Deployment Instructions (GitHub & Vercel)

### 1. GitHub Upload
1. Create a new repository on GitHub.
2. Initialize your local folder and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```
   **Important**: Do NOT upload `node_modules` or `.env` files. Your `.gitignore` should handle this.

### 2. Vercel Deployment
1. Go to [vercel.com](https://vercel.com) and import your GitHub repository.
2. **Environment Variables**: You MUST set the following variables in the Vercel Dashboard (Project Settings > Environment Variables):
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `NODE_ENV`: Set to `production`.
3. Vercel will automatically detect the `vercel.json` and deploy the frontend (Vite) and backend (Express functions).

## 🛠️ Features
- **Symptom Checker**: AI-powered preliminary assessment.
- **Saathi AI Chatbot**: General health queries and app assistance.
- **Telemedicine**: Connect with online doctors (simulation).
- **Pharmacy Search**: Find medicine availability.

## 📦 Project Structure
- `/api`: Serverless backend functions (Express).
- `/src`: Frontend source code (React + Vite + Tailwind).
- `vercel.json`: Deployment configuration for routing.

## ⚠️ Potential Issues & Solutions
- **CORS Errors**: Ensure the backend allows requests from your Vercel domain (already configured in `api/index.ts`).
- **Firebase Permissions**: Ensure you have deployed your `firestore.rules` if using Firestore.
- **API Failures**: If the chatbot doesn't respond, check if your `GEMINI_API_KEY` is correctly set in Vercel.

## 🙋‍♂️ Support
For hackathon support, please contact your team leads.
