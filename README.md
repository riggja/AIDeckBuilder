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

### 4. Project Architecture

```bash
/deck-builder-ai
├── /app
│   ├── /prompt        # Contains page where user enters prompt
│   ├── /results       # Displays slide deck and allows users to edit and export the deck
│   └── page.tsx       # Main front page with link to GitHub repo
```

### 5. Project Features

- **AI-Powered Deck Building**: Enter a prompt describing your desired deck and let AI generate it
- **Navigation**: Users can use the arrow keys to navigate through the slide deck
- **Modifiable**: Modify any slide, with changes saved in local storage so they appear on a page refresh
- **Export .pptx**: Export any slide as a .pptx file
- **View Previous**: Users can access the last generated deck after returning to prompt page