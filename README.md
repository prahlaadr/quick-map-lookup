# Quick Map Lookup

A web application that finds the closest address to your starting location based on actual driving distance using the Google Maps Distance Matrix API.

## Features

- Compare up to 20 destination addresses against a starting location
- Uses real driving distance and time calculations (not straight-line distance)
- Results automatically sorted by proximity
- Smart address parsing that handles both formatted lists and text blocks
- Displays distance in miles and estimated driving time
- Built with Next.js 14 and TypeScript

## Setup

### Prerequisites

- Node.js 18+ installed
- Google Cloud account with billing enabled
- Google Maps API key with Distance Matrix API enabled

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd address-finder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your Google Maps API key:
   - Copy `.env.example` to `.env.local`
   - Get your API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/credentials)
   - Enable the Distance Matrix API for your project
   - Add your key to `.env.local`:
     ```
     GOOGLE_MAPS_API_KEY=your_api_key_here
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter your starting address
2. Paste destination addresses (one per line or extract from text blocks)
3. Click "Find Closest Location"
4. View results sorted by driving distance

The application automatically detects addresses from plain text, so you can paste content from emails or documents without manual formatting.

## Deployment to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add your `GOOGLE_MAPS_API_KEY` environment variable in the Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `GOOGLE_MAPS_API_KEY` with your API key

## API Costs

- Google Maps Distance Matrix API: $5 per 1,000 elements (after $200/month free credit)
- Each query: 1 starting address × N destination addresses = N elements
- Example: 20 addresses = $0.10 per query
- Monthly free tier: ~40,000 queries/month covered by Google's $200 credit

## Technical Details

Built with Next.js 14, TypeScript, and Tailwind CSS. Uses the Google Maps Distance Matrix API through serverless API routes to calculate driving distances and times.

## Project Structure

```
├── app/
│   ├── page.tsx              # Main UI component
│   ├── layout.tsx            # Root layout
│   └── api/
│       └── find-closest/
│           └── route.ts      # Distance calculation API endpoint
├── lib/
│   └── addressParser.ts      # Smart address extraction utility
├── .env.local                # Environment variables (gitignored)
└── .env.example              # Environment variable template
```

## License

MIT
