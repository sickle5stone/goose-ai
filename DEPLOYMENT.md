# Deployment Guide for Render

This guide will help you deploy the Goose AI application to Render.

## Prerequisites

1. A Render account (free tier available)
2. A Gemini API key from Google AI Studio
3. Your code pushed to GitHub

## Deployment Steps

### Option 1: Automatic Deployment (Recommended)

1. **Connect your GitHub repository to Render:**

   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" and select "Blueprint"
   - Connect your GitHub account and select the `goose-ai` repository
   - Render will automatically detect the `render.yaml` file and create both services
2. **Set Environment Variables:**

   - Go to your backend service in Render dashboard
   - Navigate to "Environment" tab
   - Add the following environment variable:
     - `GEMINI_API_KEY`: Your actual Gemini API key
3. **Update CORS Origins:**

   - After deployment, note your frontend URL (e.g., `https://goose-ai-frontend.onrender.com`)
   - Update the backend CORS configuration if needed

### Option 2: Manual Deployment

#### Deploy Backend Service

1. **Create Web Service:**

   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `goose-ai-backend`
     - **Runtime**: Node
     - **Build Command**: `cd backend && npm install && npm run build`
     - **Start Command**: `cd backend && npm start`
     - **Plan**: Free
2. **Set Environment Variables:**

   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: Your actual Gemini API key

#### Deploy Frontend Static Site

1. **Create Static Site:**

   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `goose-ai-frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
     - **Plan**: Free
2. **Set Environment Variables:**

   - `VITE_API_URL`: Your backend service URL (e.g., `https://goose-ai-backend.onrender.com`)

## Post-Deployment

1. **Test the Application:**

   - Visit your frontend URL
   - Try sending a message to ensure the backend connection works
2. **Update CORS if needed:**

   - If you get CORS errors, update the `corsOptions` in `backend/express.ts`
   - Add your actual frontend domain to the allowed origins

## Environment Variables Summary

### Backend (.env)

```
GEMINI_API_KEY=your_actual_api_key_here
NODE_ENV=production
PORT=10000
```

### Frontend

```
VITE_API_URL=https://your-backend-service.onrender.com
```

## Troubleshooting

- **Build fails**: Check the build logs in Render dashboard
- **CORS errors**: Ensure frontend domain is in backend CORS configuration
- **API errors**: Verify GEMINI_API_KEY is set correctly
- **Service won't start**: Check that all dependencies are in package.json

## Free Tier Limitations

- Services may sleep after 15 minutes of inactivity
- 750 hours per month of runtime
- Services may take 30+ seconds to wake up from sleep

For production use, consider upgrading to a paid plan for better performance and uptime.
