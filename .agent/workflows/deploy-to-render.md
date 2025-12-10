---
description: How to deploy the application to Render
---

# Deploying to Render Cloud

Render is a modern cloud provider ideal for hosting Next.js applications.

## Prerequisites

1.  A GitHub repository with your code pushed.
2.  A [Render](https://render.com) account.

## Set Up a Web Service on Render

1.  **Dashboard**: Go to your Render Dashboard and click **New +** -> **Web Service**.
2.  **Connect Repo**: Select "Build and deploy from a Git repository" and connect your `careerraah-react-1` repository.
3.  **Details**:
    *   **Name**: `careerraah-mentor`
    *   **Region**: Closest to your users (e.g., Singapore, Frankfurt, Oregon).
    *   **Branch**: `main`
    *   **Root Directory**: **Leave Blank**. (Only set this if your `package.json` is not in the top-level folder).
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
4.  **Environment Variables**:
    *   Click "Add Environment Variable".
    *   **Key**: `GENKIT_API_KEY`
    *   **Value**: `2da76598c5bc4f58bf173e0716952f63.DNaORJT5qciifQ2Rc2qgLZzg` (Ensure this is the correct key for your chosen AI provider).
    *   Add any other secrets from `.env.local` (e.g., Firebase config).

## ⚠️ Critical: Ollama Configuration

Your current project uses `gpt-oss:120b-cloud` via **Ollama**.
*   **Problem**: Render Web Services do not have Ollama or GPUs installed. They cannot run this model locally (`http://127.0.0.1:11434` will fail).
*   **Solution**: You must do one of the following before deploying:

### Option A: Use a Hosted AI Provider (Easier)
Switch back to **Google Gemini** or another cloud provider.
1.  Open `src/ai/genkit.ts`.
2.  Comment out the `ollama` plugin and uncomment `googleAI`.
3.  Ensure `GENKIT_API_KEY` is a valid API key for that provider.

### Option B: Deploy Ollama Separately (Advanced)
If you must use `gpt-oss:120b-cloud`:
1.  Deploy Ollama on a GPU instance (e.g., Render Private Service, AWS EC2, or a provider like Together AI).
2.  Update `src/ai/genkit.ts`:
    ```typescript
    ollama({
      models: [{ name: 'gpt-oss:120b-cloud' }],
      serverAddress: 'https://your-ollama-instance-url.com', // Update this!
    }),
    ```
3.  Ensure the remote Ollama instance has the model pulled (`ollama pull gpt-oss:120b-cloud`).

## Finalizing Deployment
5.  **Create Web Service**: Click the button.
6.  **Monitor**: Watch the "Logs" tab. If the build succeeds but the app crashes, check that `npm start` is configured correctly in `package.json`.

## Configuring Custom Domain (GoDaddy)

To connect `www.career.raah.com`:
1.  **Render Dashboard**: Go to your Web Service -> **Settings** -> **Custom Domains**.
2.  **Add Domain**: Enter `www.career.raah.com`.
3.  **GoDaddy DNS**:
    *   Login to GoDaddy and manage DNS for `raah.com`.
    *   Add a **CNAME** record:
        *   **Host**: `www.career`
        *   **Value**: `[your-app-name].onrender.com` (Copy this from Render).
        *   **TTL**: 1 Hour (or default).
