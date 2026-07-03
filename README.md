# KNQR Online

KNQR Online is the digital boutique for the KNQR Lifestyle Brand, featuring premium Malawian fashion, curated fragrances, and accessories.

## Features

- Browse featured KNQR products and collections
- View product details, pricing, and availability
- Upload and manage product images for store updates
- Contact the KNQR team for orders, support, and collaboration
- Secure authentication with email, Google, and Apple sign-in
- Brand-focused storefront and support pages
- AI-powered mindset affirmation endpoint for the KNQR experience

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Firebase Authentication
- Firestore
- Express.js
- Google Gemini API

## Local Development

### Prerequisites

- Node.js
- Firebase project configuration
- Gemini API key for AI features

### Install

```bash
npm install
```

### Environment Variables

Create a `.env.local` file and add the required keys, including:

```bash
GEMINI_API_KEY=your_gemini_api_key
```

If you are using Firebase-backed features, configure the Firebase credentials used by the app as well.

### Run the App

```bash
npm run dev
```

## Deployment

### Render

1. Create a new Web Service in Render and connect this repository.
2. Set the build command to install dependencies and build the app.
3. Set the start command to run the server entry point.
4. Add the required environment variables in the Render dashboard, including `GEMINI_API_KEY` and any Firebase config values used by the app.
5. Deploy the service and verify the app loads correctly.

### Vercel

1. Import the repository into Vercel.
2. Add the required environment variables in the Vercel project settings.
3. Configure the project so the frontend builds correctly with Vite.
4. If you rely on the Express server, deploy the server separately or adapt the app to Vercel-compatible serverless routes.
5. Deploy and test authentication, product data, and any AI-powered features.

## Notes

This project is built for the KNQR brand and is not a generic AI Studio starter app.
