<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/4b650e44-f367-40f0-8633-442c35d268d3

## Deployment on Vercel

1. **Set Environment Variables**: In your Vercel project settings, add `GEMINI_API_KEY` with your Google Gemini API key.
2. **Build Configuration**: Ensure the build command is `npm run build` and the output directory is `dist`.
3. **Redeploy**: You must redeploy after setting the environment variable so Vite can bake the key into the client-side bundle.

## Troubleshooting

- **Analysis not starting**: Ensure you have set the `GEMINI_API_KEY` in your environment.
- **Video too large**: The app supports videos up to 50MB. Larger videos may fail due to browser memory limits when encoding to Base64.
- **"GEMINI_API_KEY is not set" error**: This means the API key was not available during the build process. Check your Vercel/Local environment variables.
- **CORS Errors**: Ensure your Gemini API key has the correct permissions and is not restricted to specific origins that exclude your deployment URL.
