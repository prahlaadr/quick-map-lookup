# Quick Map Lookup

Live demo: https://quick-map-lookup.vercel.app

A web application that calculates driving distances from a starting point to multiple destinations using the Google Maps Distance Matrix API, then ranks them by proximity.

## Overview

This application solves the problem of determining which location from a list is closest by driving distance rather than straight-line distance. It handles up to 20 destination addresses and supports flexible input formats through regex-based address parsing.

## Technical Implementation

### Core Technologies
- Next.js 14 (App Router with React Server Components)
- TypeScript for type safety
- Tailwind CSS for styling
- Google Maps Distance Matrix API
- Serverless API routes for backend logic

### Key Features
- Driving distance calculations using real road networks
- Imperial units (miles) for distance measurements
- Regex-based address parser supporting multiple input formats
- Client-side validation and real-time address counting
- Serverless architecture (no persistent state)

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

## How It Works

### Address Parsing Algorithm
The application uses a two-strategy parsing system implemented in `lib/addressParser.ts`:

1. **Line-by-line detection**: If 70% or more lines match address patterns (street number + street suffix + optional city/state), treats input as a simple list
2. **Regex extraction**: For text blocks, uses pattern matching to extract addresses:
   - Matches US street suffixes (St, Ave, Rd, Blvd, etc.)
   - Identifies state names and abbreviations
   - Captures street numbers and names
   - Filters results by minimum length to reduce false positives

Pattern matching supports:
- Full addresses: `123 Main Street, Springfield, IL 62701`
- Partial addresses: `456 Oak Ave, Chicago`
- Mixed formats within the same input

### Distance Calculation
Backend API route (`app/api/find-closest/route.ts`) handles:
- Input validation (max 20 addresses)
- Google Maps Distance Matrix API integration
- Unit conversion to imperial (miles)
- Sorting by distance value (meters internally)
- Error handling for invalid addresses

API returns:
- Valid results sorted by proximity
- Failed lookups with status codes
- Distance in human-readable format (e.g., "2.3 mi")
- Estimated driving time

### Frontend Architecture
React component (`app/page.tsx`) manages:
- Form state and user input
- Real-time address counting using the parser
- API communication via fetch
- Results rendering with conditional styling
- Error message display

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

## Limitations and Considerations

### API Costs
- Google Maps Distance Matrix API pricing: $5 per 1,000 elements after free tier
- Each query consumes N elements (N = number of destination addresses)
- Example: 20 addresses costs $0.10 per query
- Google provides $200/month credit (~40,000 distance calculations)

### Known Limitations
1. **Address Parser Accuracy**
   - US addresses only (state names and abbreviations hardcoded)
   - May produce false positives on street-like patterns
   - Requires at least street number + suffix for reliable detection
   - Complex international addresses not supported

2. **API Constraints**
   - Maximum 20 destination addresses per query (UI enforced)
   - Google Maps API rate limits apply
   - Requires valid, geocodable addresses
   - Network latency affects response time

3. **Application Scope**
   - Single query at a time (no batch processing)
   - No address validation before API call
   - No caching of previous queries
   - Stateless (no user accounts or history)

## Project Structure

```
├── app/
│   ├── page.tsx              # Client component: form, state, results display
│   ├── layout.tsx            # Root layout with metadata
│   └── api/
│       └── find-closest/
│           └── route.ts      # POST endpoint for distance calculations
├── lib/
│   └── addressParser.ts      # Regex-based address extraction logic
├── .env.local                # API key storage (gitignored)
├── .env.example              # Template for environment variables
└── tailwind.config.ts        # Tailwind configuration
```

### Key Files

**`lib/addressParser.ts`**
- Exports `parseAddresses(input: string): string[]`
- Contains US_STATES array and STREET_SUFFIXES array
- Implements two regex patterns for flexible address matching
- Returns deduplicated array of detected addresses

**`app/api/find-closest/route.ts`**
- POST handler accepting `{ startingAddress: string, addresses: string[] }`
- Validates input length and format
- Calls Google Maps API with imperial units
- Returns sorted results with distance/duration objects

**`app/page.tsx`**
- React functional component with form state
- Real-time address counting
- Conditional rendering for results and errors
- Tailwind-based responsive layout

## License

MIT
