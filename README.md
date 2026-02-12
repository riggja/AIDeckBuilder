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

