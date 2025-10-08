import { NextRequest, NextResponse } from 'next/server';
import { Client, TravelMode, UnitSystem } from '@googlemaps/google-maps-services-js';

const client = new Client({});

export async function POST(request: NextRequest) {
  try {
    const { startingAddress, addresses } = await request.json();

    // Validate input
    if (!startingAddress || !addresses || !Array.isArray(addresses)) {
      return NextResponse.json(
        { error: 'Invalid input. Please provide a starting address and an array of addresses.' },
        { status: 400 }
      );
    }

    if (addresses.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one destination address.' },
        { status: 400 }
      );
    }

    if (addresses.length > 20) {
      return NextResponse.json(
        { error: 'Maximum 20 addresses allowed.' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured.' },
        { status: 500 }
      );
    }

    // Call Google Maps Distance Matrix API
    const response = await client.distancematrix({
      params: {
        origins: [startingAddress],
        destinations: addresses,
        mode: TravelMode.driving,
        units: UnitSystem.imperial,
        key: apiKey,
      },
    });

    if (response.data.status !== 'OK') {
      return NextResponse.json(
        { error: `Google Maps API error: ${response.data.status}` },
        { status: 500 }
      );
    }

    // Parse results
    const results = response.data.rows[0].elements.map((element, index) => ({
      address: addresses[index],
      status: element.status,
      distance: element.status === 'OK' ? element.distance : null,
      duration: element.status === 'OK' ? element.duration : null,
    }));

    // Filter out failed lookups and sort by distance
    const validResults = results
      .filter(result => result.status === 'OK')
      .sort((a, b) => (a.distance?.value || 0) - (b.distance?.value || 0));

    const failedResults = results.filter(result => result.status !== 'OK');

    return NextResponse.json({
      success: true,
      results: validResults,
      failed: failedResults,
      startingAddress,
    });

  } catch (error) {
    console.error('Error in find-closest API:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
