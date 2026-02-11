This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Environment Setup

Create a `.env.local` file in the root directory with your API credentials:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your Heroku API URL and API key:

```env
NEXT_PUBLIC_HEROKU_URL=https://your-heroku-app.herokuapp.com/api/endpoint
NEXT_PUBLIC_API_KEY=your-api-key-here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

- **AI-Powered Deck Building**: Enter a prompt describing your desired deck and let AI generate it
- **Clean UI**: Modern, responsive design with dark mode support
- **Heroku Integration**: Connects to your Heroku API endpoint for deck generation

## API Request Format

The app sends requests to your Heroku endpoint in the following format:

```json
{
  "prompt": "create a slide deck",
  "model": "gpt-o4-2024-08-06"
}
```

The API should return a response with the generated deck content.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
