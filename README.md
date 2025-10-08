# Address Proximity Finder

Find the closest location to your starting address based on driving distance using Google Maps Distance Matrix API.

## Features

- 🎯 Find the closest address from up to 20 destination addresses
- 🚗 Uses real driving distance and time (not straight-line)
- 📊 Results sorted by proximity with detailed distance and time info
- 🎨 Clean, modern UI with responsive design
- ⚡ Built with Next.js 14 and TypeScript

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

1. Enter your starting address in the first input field
2. Enter destination addresses in the textarea (one per line, max 20)
3. Click "Find Closest Location"
4. View results sorted by driving distance with the closest location highlighted

### Example Input

**Starting Address:**
```
1600 Amphitheatre Parkway, Mountain View, CA
```

**Destination Addresses:**
```
1 Apple Park Way, Cupertino, CA
1 Infinite Loop, Cupertino, CA
410 Terry Ave N, Seattle, WA
1 Microsoft Way, Redmond, WA
```

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

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API Client:** @googlemaps/google-maps-services-js
- **Deployment:** Vercel

## Project Structure

```
address-finder/
├── app/
│   ├── page.tsx              # Main UI component
│   ├── layout.tsx            # Root layout
│   └── api/
│       └── find-closest/
│           └── route.ts      # API endpoint for distance calculation
├── .env.local                # Environment variables (not in git)
├── .env.example              # Environment variables template
└── README.md
```

## License

MIT
