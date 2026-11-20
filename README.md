# Jamal Ferguson Portfolio

My personal developer portfolio, built to showcase the projects I have created, the technologies I use, and the way I approach front-end development. The experience combines a responsive project showcase with playful interactions and an AI-powered portfolio guide named Little Jam.

## Features

- Responsive project showcase with desktop and mobile previews
- Project filtering by original work, clones, and client projects
- Detailed case studies for selected projects
- Light and dark themes
- Interactive, draggable Little Jam mascot
- Little Jam AI assistant for questions about my work and skills
- Accessible contact form and keyboard-friendly controls
- Redux Toolkit state management

## Built With

- Next.js
- React
- TypeScript
- Redux Toolkit
- Tailwind CSS
- OpenAI Responses API

## Requirements

- Node.js 20.9 or newer
- npm

## Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/Miingo954/jamal-ferguson-portfolio.git
cd jamal-ferguson-portfolio
npm install
```

## Environment Setup

Little Jam requires an OpenAI API key. Create a `.env.local` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key
```

The rest of the portfolio can run without this key, but AI responses will be unavailable.

## Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Author

Jamal Ferguson — front-end developer based in Northern California.
