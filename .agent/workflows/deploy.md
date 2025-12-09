---
description: How to deploy the application to Firebase App Hosting
---

This project uses **Firebase App Hosting**, designed for Next.js applications.

### 1. Prerequisites
- A Firebase Project.
- A GitHub repository connected to your Firebase Project.

### 2. Automatic Deployment (Recommended)
Firebase App Hosting works by listening to your GitHub repository.
To deploy updates:

1.  Commit your changes:
    ```bash
    git add .
    git commit -m "Your commit message"
    ```
2.  Push to valid branch (usually `main`):
    ```bash
    git push origin main
    ```
3.  Monitor the rollout in the [Firebase Console](https://console.firebase.google.com/) under **App Hosting**.

### 3. Manual / Local Checks
- Ensure `apphosting.yaml` is correctly configured in the root directory.
- Test the build locally to ensure no errors before pushing:
    ```bash
    npm run build
    ```
